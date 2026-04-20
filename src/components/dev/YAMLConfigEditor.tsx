import { useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { CodeBlock } from "./CodeBlock";

export interface YAMLError {
  line: number;
  column?: number;
  message: string;
  severity?: "error" | "warning";
}

export interface YAMLSchemaShape {
  /** Required top-level keys. */
  requiredKeys?: string[];
  /** Disallowed keys (e.g. deprecated). */
  disallowedKeys?: string[];
  /** Minimum indent unit — 2 (default) or 4. */
  indent?: 2 | 4;
}

export interface YAMLConfigEditorProps {
  value: string;
  onChange?: (next: string) => void;
  /** Read-only — falls back to the plain CodeBlock look. */
  readOnly?: boolean;
  /** Light validation (required / disallowed keys + basic lint). */
  schema?: YAMLSchemaShape;
  /** Additional externally-computed errors (merged with the built-in ones). */
  errors?: readonly YAMLError[];
  height?: number;
  /** Header slot (title + actions). */
  header?: ReactNode;
  className?: string;
}

/** Very light YAML validation: detects odd indentation and required /
 *  disallowed top-level keys. Not a real parser — for strict validation
 *  wire up a real YAML parser on your end and feed errors via the
 *  `errors` prop. */
function lint(text: string, schema?: YAMLSchemaShape): YAMLError[] {
  const errs: YAMLError[] = [];
  const lines = text.split("\n");
  const indentUnit = schema?.indent ?? 2;
  const topLevel = new Set<string>();
  let inFlow = false;
  lines.forEach((raw, i) => {
    const lineNum = i + 1;
    const m = raw.match(/^(\s*)([^#\s].*)?$/);
    if (!m) return;
    const indent = m[1].length;
    const rest = m[2] ?? "";
    if (!rest) return;
    if (indent % indentUnit !== 0 && !inFlow) {
      errs.push({
        line: lineNum,
        message: `Indent ${indent} not a multiple of ${indentUnit}.`,
        severity: "warning",
      });
    }
    // Flow context toggle (very rough)
    if (/[{[]/.test(rest) && !/[}\]]/.test(rest)) inFlow = true;
    if (/[}\]]/.test(rest) && !/[{[]/.test(rest)) inFlow = false;
    // Top-level key
    if (indent === 0) {
      const km = rest.match(/^([A-Za-z0-9_.-]+)\s*:/);
      if (km) topLevel.add(km[1]);
    }
    // Tab detection
    if (/\t/.test(raw)) {
      errs.push({ line: lineNum, message: "Tab character not allowed in YAML.", severity: "error" });
    }
  });
  if (schema?.requiredKeys) {
    for (const k of schema.requiredKeys) {
      if (!topLevel.has(k)) {
        errs.push({ line: 1, message: `Missing required key: ${k}`, severity: "error" });
      }
    }
  }
  if (schema?.disallowedKeys) {
    for (const k of schema.disallowedKeys) {
      if (topLevel.has(k)) {
        errs.push({ line: 1, message: `Disallowed key present: ${k}`, severity: "warning" });
      }
    }
  }
  return errs;
}

/** Lightweight YAML editor: a `<textarea>` overlaid with line numbers
 *  and per-line error dots. When `readOnly`, falls back to `CodeBlock`
 *  for syntax-highlighted display. */
export function YAMLConfigEditor({
  value,
  onChange,
  readOnly,
  schema,
  errors: extra,
  height = 280,
  header,
  className,
}: YAMLConfigEditorProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [focus, setFocus] = useState(false);

  const errors = useMemo(() => {
    const base = lint(value, schema);
    return [...base, ...(extra ?? [])];
  }, [value, schema, extra]);

  const errByLine = useMemo(() => {
    const m = new Map<number, YAMLError[]>();
    for (const e of errors) {
      const list = m.get(e.line) ?? [];
      list.push(e);
      m.set(e.line, list);
    }
    return m;
  }, [errors]);

  if (readOnly) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {header}
        <CodeBlock lang="yaml" code={value} />
      </div>
    );
  }

  const lines = value.split("\n");
  const hasErrors = errors.filter((e) => e.severity !== "warning").length > 0;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {header}
      <div
        className={cn(
          "rounded-xl border overflow-hidden font-mono text-sm bg-[#0a0a10]",
          focus ? "border-fuchsia-400/40" : hasErrors ? "border-rose-400/30" : "border-white/10",
        )}
      >
        <div className="flex" style={{ height }}>
          {/* Line numbers + error dots */}
          <div
            aria-hidden
            className="shrink-0 w-12 py-2 bg-white/[0.02] border-r border-white/5 overflow-hidden text-[11px] text-right select-none"
          >
            {lines.map((_, i) => {
              const errs = errByLine.get(i + 1);
              const tone = errs?.some((e) => e.severity !== "warning")
                ? "text-rose-300"
                : errs
                  ? "text-amber-300"
                  : "text-white/30";
              return (
                <div key={i} className={cn("px-2 tabular-nums", tone)} title={errs?.map((e) => e.message).join("\n")}>
                  {errs ? "● " : ""}
                  {i + 1}
                </div>
              );
            })}
          </div>
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            spellCheck={false}
            className="flex-1 bg-transparent outline-none resize-none p-2 text-white/90 leading-[1.05]"
            style={{ height }}
          />
        </div>
      </div>
      {errors.length > 0 ? (
        <div className="flex flex-col gap-0.5 text-xs">
          {errors.map((e, i) => (
            <div
              key={i}
              className={cn(
                "flex items-baseline gap-2",
                e.severity === "warning" ? "text-amber-300" : "text-rose-300",
              )}
            >
              <span className="tabular-nums font-mono w-8 text-right">
                L{e.line}
                {e.column ? `:${e.column}` : ""}
              </span>
              <span>{e.message}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
