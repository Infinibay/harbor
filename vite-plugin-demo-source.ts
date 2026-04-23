/**
 * vite-plugin-demo-source
 *
 * Walks every .tsx file under the showcase, finds `<Demo>...</Demo>`
 * JSX elements, and injects a `source="..."` prop whose value is the
 * raw code the showcase should display.
 *
 * The plugin picks the source using two strategies, in order:
 *
 *   1. If the Demo's children are a single reference to a component
 *      declared at the top level of the same file — either as
 *      `function Name() { … }` or `const Name = () => …` — the whole
 *      declaration is used as the source. This is what makes large
 *      demos like `<EditorDemo />` useful: the reader sees the
 *      implementation, not the tautological `<EditorDemo />` call.
 *
 *   2. Otherwise, the children's original text is sliced and dedented.
 *      Inline demos (Buttons, TextFields, Rows of primitives) fall in
 *      here and show exactly what the author wrote.
 *
 * Skipped:
 *   - Files outside src/
 *   - <Demo /> with no children
 *   - <Demo source="...">…</Demo> (manual override wins)
 */

import type { Plugin } from "vite";
import { parse } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import type * as t from "@babel/types";
// @babel/traverse is CJS; under ESM interop the callable sits on
// `.default`. Accept either shape so this works across tool versions.
import babelTraverseImport from "@babel/traverse";

type TraverseFn = typeof babelTraverseImport;
const traverse: TraverseFn =
  (babelTraverseImport as unknown as { default?: TraverseFn }).default ??
  babelTraverseImport;

interface Edit {
  at: number;
  text: string;
}

function dedent(text: string): string {
  const lines = text.split("\n");
  let min = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^[ \t]*/);
    const indent = match ? match[0].length : 0;
    if (indent < min) min = indent;
  }
  if (!isFinite(min) || min === 0) return text.trim();
  return lines
    .map((l) => (l.length >= min ? l.slice(min) : l))
    .join("\n")
    .trim();
}

function escapeForTemplateLiteral(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

/** Top-level PascalCase `function` and `const = () => …` declarations
 *  in this file. Value is the outer statement so we can slice its full
 *  range (preserving `export` if present). */
function collectLocalComponents(ast: t.File): Map<string, t.Statement> {
  const map = new Map<string, t.Statement>();
  for (const stmt of ast.program.body) {
    let inner: t.Node = stmt;
    if (
      stmt.type === "ExportNamedDeclaration" ||
      stmt.type === "ExportDefaultDeclaration"
    ) {
      if (!stmt.declaration) continue;
      inner = stmt.declaration;
    }

    if (
      inner.type === "FunctionDeclaration" &&
      inner.id &&
      /^[A-Z]/.test(inner.id.name)
    ) {
      map.set(inner.id.name, stmt);
      continue;
    }

    if (inner.type === "VariableDeclaration") {
      for (const d of inner.declarations) {
        if (d.id.type !== "Identifier") continue;
        if (!/^[A-Z]/.test(d.id.name)) continue;
        if (!d.init) continue;
        if (
          d.init.type !== "ArrowFunctionExpression" &&
          d.init.type !== "FunctionExpression"
        ) {
          continue;
        }
        map.set(d.id.name, stmt);
      }
    }
  }
  return map;
}

/** If the Demo has exactly one meaningful child and that child is a
 *  JSXElement whose tag is a PascalCase identifier, return that name.
 *  Otherwise return null. */
function singleLocalChildName(demo: t.JSXElement): string | null {
  const meaningful = demo.children.filter(
    (c) => !(c.type === "JSXText" && c.value.trim() === ""),
  );
  if (meaningful.length !== 1) return null;
  const only = meaningful[0];
  if (only.type !== "JSXElement") return null;
  const opening = only.openingElement;
  if (opening.name.type !== "JSXIdentifier") return null;
  const name = opening.name.name;
  if (!/^[A-Z]/.test(name)) return null;
  return name;
}

function hasSourceAttr(opening: t.JSXOpeningElement): boolean {
  return opening.attributes.some(
    (a) =>
      a.type === "JSXAttribute" &&
      a.name.type === "JSXIdentifier" &&
      a.name.name === "source",
  );
}

export default function demoSourcePlugin(): Plugin {
  return {
    name: "harbor:demo-source",
    enforce: "pre",
    transform(code: string, id: string) {
      if (!id.endsWith(".tsx")) return null;
      if (id.includes("/node_modules/")) return null;
      if (!code.includes("<Demo")) return null;

      let ast;
      try {
        ast = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
          errorRecovery: true,
        });
      } catch {
        return null;
      }

      const locals = collectLocalComponents(ast);
      const edits: Edit[] = [];

      traverse(ast, {
        JSXElement(path: NodePath<t.JSXElement>) {
          const node = path.node;
          const opening = node.openingElement;
          if (opening.name.type !== "JSXIdentifier") return;
          if (opening.name.name !== "Demo") return;
          if (opening.selfClosing) return;
          if (node.children.length === 0) return;
          const closing = node.closingElement;
          if (!closing) return;
          if (hasSourceAttr(opening)) return;

          const openingEnd = opening.end;
          const closingStart = closing.start;
          if (openingEnd == null || closingStart == null) return;

          let cleaned: string | null = null;

          // Strategy 1: single reference to a local component.
          const refName = singleLocalChildName(node);
          if (refName) {
            const decl = locals.get(refName);
            if (decl && decl.start != null && decl.end != null) {
              cleaned = dedent(code.slice(decl.start, decl.end));
            }
          }

          // Strategy 2: raw children text.
          if (!cleaned) {
            cleaned = dedent(code.slice(openingEnd, closingStart));
          }

          if (!cleaned) return;

          const insertAt = openingEnd - 1;
          const attr = ` source={\`${escapeForTemplateLiteral(cleaned)}\`}`;
          edits.push({ at: insertAt, text: attr });
        },
      });

      if (edits.length === 0) return null;

      edits.sort((a, b) => b.at - a.at);
      let out = code;
      for (const edit of edits) {
        out = out.slice(0, edit.at) + edit.text + out.slice(edit.at);
      }
      return { code: out, map: null };
    },
  };
}
