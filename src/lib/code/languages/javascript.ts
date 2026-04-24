import type { Language, StringStream, TokenType } from "../types";

export interface JavaScriptOptions {
  ts?: boolean;
  jsx?: boolean;
}

interface JSState {
  /** Stack of contexts. Top item determines how we read the next char.
   *  - `code`: standard expression / statement context.
   *  - `template` + `hash` continues a backtick string; interpolation
   *    (`${...}`) pushes a `code` context with matching `hash`.
   *  - `comment`: we're inside a `/* *\/` block that spans lines.
   *  - `jsxTag`: just-opened `<Tag`, reading attributes until `>`.
   *  - `jsxChildren`: between `<Tag>…</Tag>`, plain text + `{expr}`. */
  ctx: Array<JSContext>;
  /** After the last non-trivial token, can the next `/` start a regex?
   *  JS spec is ambiguous — we approximate by checking the previous
   *  non-whitespace token. */
  lastTokenType: TokenType | null;
  lastTokenText: string;
}

type JSContext =
  | { kind: "code"; braceDepth: number }
  | { kind: "template" }
  | { kind: "comment" }
  | { kind: "jsxTag" }
  | { kind: "jsxChildren" };

const JS_KEYWORDS = new Set([
  "await", "break", "case", "catch", "class", "const", "continue",
  "debugger", "default", "delete", "do", "else", "enum", "export",
  "extends", "false", "finally", "for", "from", "function", "if",
  "implements", "import", "in", "instanceof", "let", "new", "null",
  "of", "package", "private", "protected", "public", "return", "static",
  "super", "switch", "this", "throw", "true", "try", "typeof",
  "undefined", "var", "void", "while", "with", "yield", "async",
  "readonly", "satisfies", "as", "is",
]);

const TS_TYPE_KEYWORDS = new Set([
  "type", "interface", "namespace", "declare", "abstract", "keyof",
  "infer", "unique", "any", "unknown", "never", "object", "bigint",
  "boolean", "number", "string", "symbol",
]);

function canStartRegex(state: JSState): boolean {
  const prev = state.lastTokenType;
  if (prev === null) return true;
  if (prev === "keyword") {
    // After `return`, `typeof`, etc. regex is possible.
    const t = state.lastTokenText;
    if (
      t === "return" || t === "typeof" || t === "in" || t === "of" ||
      t === "instanceof" || t === "new" || t === "delete" ||
      t === "void" || t === "throw" || t === "yield" || t === "await"
    ) return true;
    return false;
  }
  if (prev === "operator" || prev === "punctuation") {
    return state.lastTokenText !== ")" && state.lastTokenText !== "]";
  }
  return false;
}

function readString(stream: StringStream, quote: string): TokenType {
  let escaped = false;
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\" && !escaped) {
      escaped = true;
      continue;
    }
    if (ch === quote && !escaped) return "string";
    escaped = false;
  }
  // Unterminated string — treat entire line as string. Not an error
  // classification: could be a legitimate line-continuation pattern.
  return "string";
}

function readBlockCommentBody(stream: StringStream, state: JSState): void {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.ctx.pop();
      return;
    }
    stream.next();
  }
}

function readTemplate(stream: StringStream, state: JSState): TokenType {
  while (!stream.eol()) {
    const ch = stream.peek();
    if (ch === "\\") {
      stream.next();
      stream.next();
      continue;
    }
    if (ch === "`") {
      stream.next();
      state.ctx.pop();
      return "string";
    }
    if (ch === "$" && stream.line.charAt(stream.pos + 1) === "{") {
      if (stream.pos > stream.start) return "string";
      stream.next();
      stream.next();
      state.ctx.push({ kind: "code", braceDepth: 0 });
      return "operator";
    }
    stream.next();
  }
  return "string";
}

function tokenIdentifier(
  stream: StringStream,
  state: JSState,
  opts: JavaScriptOptions,
): TokenType {
  stream.eatWhile(/[A-Za-z0-9_$]/);
  const word = stream.current();
  if (JS_KEYWORDS.has(word)) return "keyword";
  if (opts.ts && TS_TYPE_KEYWORDS.has(word)) return "keyword";
  if (word === "true" || word === "false" || word === "null" || word === "undefined") {
    return "keyword";
  }
  // Heuristic: capitalized identifier = Type or Component.
  if (/^[A-Z]/.test(word)) return "type";
  // Followed by `(` → function call.
  const rest = stream.line.slice(stream.pos);
  if (/^\s*\(/.test(rest)) return "function";
  // Identifier as object property key: `foo:` — common in object literals.
  if (/^\s*:/.test(rest) && state.lastTokenText === "{") return "property";
  return "variable";
}

function tokenNumber(stream: StringStream): TokenType {
  // `0x..`, `0b..`, `0o..`
  if (stream.match(/0[xX][0-9a-fA-F_]+n?/, true)) return "number";
  if (stream.match(/0[bB][01_]+n?/, true)) return "number";
  if (stream.match(/0[oO][0-7_]+n?/, true)) return "number";
  // decimal with optional exponent, optional bigint
  stream.match(/\d[\d_]*(\.[\d_]+)?([eE][+-]?\d+)?n?/, true);
  return "number";
}

function tokenRegex(stream: StringStream): TokenType {
  let inClass = false;
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      stream.next();
      continue;
    }
    if (ch === "[") inClass = true;
    else if (ch === "]") inClass = false;
    else if (ch === "/" && !inClass) break;
  }
  stream.eatWhile(/[gimsuy]/);
  return "regex";
}

function tokenJsxTag(stream: StringStream, state: JSState): TokenType | null {
  stream.eatSpace();
  const ch = stream.peek();
  if (!ch) return null;
  if (ch === ">") {
    stream.next();
    state.ctx.pop();
    state.ctx.push({ kind: "jsxChildren" });
    return "punctuation";
  }
  if (ch === "/") {
    stream.next();
    if (stream.peek() === ">") {
      stream.next();
      state.ctx.pop();
      return "punctuation";
    }
    return "punctuation";
  }
  if (ch === "{") {
    stream.next();
    state.ctx.push({ kind: "code", braceDepth: 0 });
    return "operator";
  }
  if (ch === "=") {
    stream.next();
    return "operator";
  }
  if (ch === '"' || ch === "'") {
    stream.next();
    return readString(stream, ch);
  }
  if (/[A-Za-z_]/.test(ch)) {
    stream.eatWhile(/[A-Za-z0-9_\-:]/);
    return "attribute";
  }
  stream.next();
  return null;
}

function tokenJsxChildren(stream: StringStream, state: JSState): TokenType | null {
  const ch = stream.peek();
  if (!ch) return null;
  if (ch === "<") {
    stream.next();
    if (stream.peek() === "/") {
      stream.next();
      stream.eatWhile(/[A-Za-z0-9_.\-]/);
      stream.eat(">");
      state.ctx.pop();
      return "tag";
    }
    stream.eatWhile(/[A-Za-z0-9_.]/);
    state.ctx.push({ kind: "jsxTag" });
    return "tag";
  }
  if (ch === "{") {
    stream.next();
    state.ctx.push({ kind: "code", braceDepth: 0 });
    return "operator";
  }
  stream.eatWhile((c) => c !== "<" && c !== "{");
  return null;
}

function tokenCode(
  stream: StringStream,
  state: JSState,
  opts: JavaScriptOptions,
): TokenType | null {
  stream.eatSpace();
  if (stream.pos > stream.start) return null;

  const ch = stream.peek();
  if (!ch) return null;

  // Comments
  if (stream.match("//", true)) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("/*", true)) {
    state.ctx.push({ kind: "comment" });
    readBlockCommentBody(stream, state);
    return "comment";
  }

  // Strings
  if (ch === '"' || ch === "'") {
    stream.next();
    return readString(stream, ch);
  }
  if (ch === "`") {
    stream.next();
    state.ctx.push({ kind: "template" });
    return readTemplate(stream, state);
  }

  // Numbers
  if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
    return tokenNumber(stream);
  }

  // Regex literal
  if (ch === "/" && canStartRegex(state)) {
    stream.next();
    return tokenRegex(stream);
  }

  // JSX opening: `<Tag` or `<tag` at expression position.
  if (opts.jsx && ch === "<") {
    const next = stream.line.charAt(stream.pos + 1);
    if (/[A-Za-z]/.test(next) && canStartRegex(state)) {
      stream.next();
      stream.eatWhile(/[A-Za-z0-9_.]/);
      state.ctx.push({ kind: "jsxTag" });
      return "tag";
    }
  }

  // Identifier / keyword
  if (/[A-Za-z_$]/.test(ch)) {
    return tokenIdentifier(stream, state, opts);
  }

  // Brace tracking for template interpolation exit.
  if (ch === "{") {
    stream.next();
    const top = state.ctx[state.ctx.length - 1];
    if (top && top.kind === "code") top.braceDepth++;
    return "punctuation";
  }
  if (ch === "}") {
    stream.next();
    const top = state.ctx[state.ctx.length - 1];
    if (top && top.kind === "code") {
      if (top.braceDepth === 0) {
        state.ctx.pop();
        // Resume template / jsx context on next call.
        return "operator";
      }
      top.braceDepth--;
    }
    return "punctuation";
  }

  // Simple operators / punctuation
  if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
    stream.next();
    stream.eatWhile(/[+\-*/%=<>!&|^~?:]/);
    return "operator";
  }
  if (/[[\](),.;]/.test(ch)) {
    stream.next();
    return "punctuation";
  }

  stream.next();
  return null;
}

/** JavaScript / TypeScript / JSX language factory. */
export function jsLang(opts: JavaScriptOptions = {}): Language<JSState> {
  return {
    name:
      opts.ts && opts.jsx
        ? "tsx"
        : opts.ts
        ? "typescript"
        : opts.jsx
        ? "jsx"
        : "javascript",
    aliases:
      opts.ts && opts.jsx
        ? ["tsx", "ts"]
        : opts.ts
        ? ["ts", "typescript"]
        : opts.jsx
        ? ["jsx"]
        : ["js", "mjs", "cjs"],
    startState(): JSState {
      return {
        ctx: [{ kind: "code", braceDepth: 0 }],
        lastTokenType: null,
        lastTokenText: "",
      };
    },
    token(stream, state) {
      const top = state.ctx[state.ctx.length - 1];
      let type: TokenType | null;
      if (!top) {
        state.ctx.push({ kind: "code", braceDepth: 0 });
        type = tokenCode(stream, state, opts);
      } else if (top.kind === "comment") {
        readBlockCommentBody(stream, state);
        type = "comment";
      } else if (top.kind === "template") {
        type = readTemplate(stream, state);
      } else if (top.kind === "jsxTag") {
        type = tokenJsxTag(stream, state);
      } else if (top.kind === "jsxChildren") {
        type = tokenJsxChildren(stream, state);
      } else {
        type = tokenCode(stream, state, opts);
      }
      const text = stream.current();
      if (type && text.trim()) {
        state.lastTokenType = type;
        state.lastTokenText = text;
      }
      return type;
    },
    lineComment: "//",
    blockComment: { open: "/*", close: "*/" },
    bracketPairs: [
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
    ],
    autoCloseMap: {
      "(": ")",
      "[": "]",
      "{": "}",
      "\"": "\"",
      "'": "'",
      "`": "`",
    },
    electricInput: /[{}()[\]]/,
  };
}
