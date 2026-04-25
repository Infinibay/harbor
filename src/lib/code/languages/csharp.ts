import type { Language, StringStream, TokenType } from "../types";

const CSHARP_KEYWORDS = new Set([
  "abstract", "as", "base", "break", "case", "catch", "checked", "class",
  "const", "continue", "default", "delegate", "do", "else", "enum",
  "event", "explicit", "extern", "false", "finally", "fixed", "for",
  "foreach", "goto", "if", "implicit", "in", "interface", "internal",
  "is", "lock", "namespace", "new", "null", "operator", "out", "override",
  "params", "private", "protected", "public", "readonly", "ref", "return",
  "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this",
  "throw", "true", "try", "typeof", "unchecked", "unsafe", "using",
  "virtual", "void", "volatile", "while",
  // Contextual keywords
  "async", "await", "var", "dynamic", "yield", "record", "init", "nameof",
  "when", "global", "partial", "value", "get", "set", "add", "remove",
  "where", "select", "from", "let", "group", "by", "into", "orderby",
  "ascending", "descending", "join", "on", "equals", "with", "and", "or",
  "not", "file", "required", "scoped",
]);

const CSHARP_TYPES = new Set([
  "bool", "byte", "sbyte", "char", "decimal", "double", "float", "int",
  "uint", "long", "ulong", "short", "ushort", "object", "string", "nint",
  "nuint",
  "String", "Object", "Boolean", "Int32", "Int64", "Double", "Decimal",
  "List", "Dictionary", "HashSet", "Queue", "Stack",
  "IEnumerable", "IList", "IDictionary", "ICollection", "IReadOnlyList",
  "IReadOnlyDictionary", "IComparable", "IDisposable",
  "Task", "ValueTask", "Action", "Func", "Predicate", "Nullable",
  "DateTime", "DateOnly", "TimeOnly", "TimeSpan", "Guid", "Uri",
  "Exception", "ArgumentException", "ArgumentNullException",
  "InvalidOperationException", "NotImplementedException",
  "Span", "ReadOnlySpan", "Memory", "ReadOnlyMemory",
]);

const CSHARP_BUILTINS = new Set([
  "Console", "Math", "Convert", "Environment", "Activator", "Assembly",
  "true", "false", "null",
]);

interface CSharpState {
  /** Stack of contexts. Allows clean re-entry between code and string
   *  interpolation regions. */
  ctx: Array<CSharpCtx>;
}

type CSharpCtx =
  | { kind: "code" }
  | { kind: "blockComment" }
  /** Interpolated string. `verbatim` allows newlines + `""` escapes;
   *  `dollarCount` is the number of `$` (1 = `{` opens interpolation,
   *  2 = `{{` opens, 3 = `{{{`, …). Raw/braced count makes raw $$" work. */
  | { kind: "iStr"; verbatim: boolean; dollars: number }
  /** Verbatim non-interpolated string `@"..."`. */
  | { kind: "vStr" };

function topCtx(state: CSharpState): CSharpCtx {
  return state.ctx[state.ctx.length - 1] ?? { kind: "code" };
}

function readBlockCommentBody(stream: StringStream, state: CSharpState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.ctx.pop();
      return "comment";
    }
    stream.next();
  }
  return "comment";
}

function readSimpleString(stream: StringStream, quote: string): TokenType {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      if (stream.eol()) return "string";
      stream.next();
      continue;
    }
    if (ch === quote) return "string";
  }
  return "string";
}

/** Verbatim string body. Doubled `""` is an escape — closing requires
 *  a single `"` not followed by another `"`. */
function readVerbatimBody(stream: StringStream, state: CSharpState): TokenType {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === '"') {
      if (stream.peek() === '"') {
        stream.next();
        continue;
      }
      state.ctx.pop();
      return "string";
    }
  }
  return "string";
}

/** Interpolated string body. Handles:
 *  - `{{` and `}}` literal escapes
 *  - `{expr}` opens an interpolation context
 *  - verbatim `""` escape when verbatim flag is set
 *  - non-verbatim `\` escape
 *  Returns the next token classification. */
function readInterpolatedBody(
  stream: StringStream,
  state: CSharpState,
  ctx: { kind: "iStr"; verbatim: boolean; dollars: number },
): TokenType {
  while (!stream.eol()) {
    const ch = stream.peek();
    if (!ch) break;
    if (ch === "{") {
      // Doubled brace = literal `{`.
      if (stream.line.charAt(stream.pos + 1) === "{") {
        stream.next();
        stream.next();
        continue;
      }
      // Open interpolation: emit any string text accumulated so far first.
      if (stream.pos > stream.start) return "string";
      // Push a code context; the matching `}` will pop us back here.
      stream.next();
      state.ctx.push({ kind: "code" });
      return "operator";
    }
    if (ch === "}") {
      if (stream.line.charAt(stream.pos + 1) === "}") {
        stream.next();
        stream.next();
        continue;
      }
      // Stray `}` — just consume.
      stream.next();
      continue;
    }
    if (ch === "\\" && !ctx.verbatim) {
      stream.next();
      if (!stream.eol()) stream.next();
      continue;
    }
    if (ch === '"') {
      if (ctx.verbatim && stream.line.charAt(stream.pos + 1) === '"') {
        stream.next();
        stream.next();
        continue;
      }
      stream.next();
      state.ctx.pop();
      return "string";
    }
    stream.next();
  }
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F_]+[uUlL]*/, true)) return "number";
  if (stream.match(/0[bB][01_]+[uUlL]*/, true)) return "number";
  stream.match(
    /\d[\d_]*(\.[\d_]+)?([eE][+-]?\d+)?[fFdDmMuUlL]*/,
    true,
  );
  return "number";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  const word = stream.current();
  if (CSHARP_KEYWORDS.has(word)) return "keyword";
  if (CSHARP_TYPES.has(word)) return "type";
  if (CSHARP_BUILTINS.has(word)) return "variable";
  if (/^I[A-Z]/.test(word)) return "type"; // Interface convention.
  if (/^[A-Z][A-Z0-9_]+$/.test(word) && word.length > 1) return "variable";
  if (/^[A-Z]/.test(word)) return "type";
  const rest = stream.line.slice(stream.pos);
  if (/^\s*\(/.test(rest)) return "function";
  return "variable";
}

/** Tries to consume a string opener at the current position. Recognises:
 *  `"..."`, `@"..."`, `$"..."`, `@$"..."`, `$@"..."`. Returns true if a
 *  string was opened (and pushes the appropriate context). */
function tryStringOpener(stream: StringStream, state: CSharpState): boolean {
  const m = stream.match(/(\$+)?(@)?(\$+)?"/, true) as RegExpMatchArray | boolean | null;
  if (!m || m === true) return false;
  const groups = m as RegExpMatchArray;
  const dollarsLeft = groups[1] ?? "";
  const at = groups[2] ?? "";
  const dollarsRight = groups[3] ?? "";
  const dollars = (dollarsLeft + dollarsRight).length;
  const verbatim = at === "@";
  if (dollars === 0 && !verbatim) {
    // Plain `"` — read body inline.
    while (!stream.eol()) {
      const ch = stream.next();
      if (ch === "\\") {
        if (stream.eol()) return true;
        stream.next();
        continue;
      }
      if (ch === '"') return true;
    }
    return true;
  }
  if (dollars === 0 && verbatim) {
    state.ctx.push({ kind: "vStr" });
    return true;
  }
  state.ctx.push({ kind: "iStr", verbatim, dollars });
  return true;
}

function tokenCode(stream: StringStream, state: CSharpState): TokenType | null {
  if (stream.eatSpace()) return null;
  const ch = stream.peek();
  if (!ch) return null;

  if (stream.match("//", true)) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("/*", true)) {
    state.ctx.push({ kind: "blockComment" });
    return readBlockCommentBody(stream, state);
  }

  // String openers: try $/@-prefixed first, then plain quote.
  if (ch === '"' || ch === "@" || ch === "$") {
    const startPos = stream.pos;
    if (tryStringOpener(stream, state)) {
      // Plain `"..."` was already consumed inside tryStringOpener; for
      // verbatim/interpolated the context was pushed and the body will be
      // read on the next call. Either way we've moved.
      const top = topCtx(state);
      if (top.kind === "vStr") return readVerbatimBody(stream, state);
      if (top.kind === "iStr") return readInterpolatedBody(stream, state, top);
      return "string";
    }
    // Not a string opener: rewind and treat `@`/`$` as misc.
    while (stream.pos > startPos) stream.backUp(1);
  }

  // `@verbatimIdent` — escapes a keyword as identifier.
  if (ch === "@") {
    stream.next();
    if (/[A-Za-z_]/.test(stream.peek() ?? "")) {
      stream.eatWhile(/[A-Za-z0-9_]/);
      return "variable";
    }
    return "punctuation";
  }

  if (ch === "'") {
    stream.next();
    return readSimpleString(stream, "'");
  }

  if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
    return readNumber(stream);
  }

  if (/[A-Za-z_]/.test(ch)) {
    return readIdentifier(stream);
  }

  // `}` may close an interpolation context if we're currently inside the
  // code part of one. We detect that by the presence of an `iStr` two
  // levels down (the code ctx is on top, iStr below it).
  if (ch === "}") {
    const below = state.ctx[state.ctx.length - 2];
    if (below && below.kind === "iStr") {
      stream.next();
      state.ctx.pop(); // pop the `code` ctx
      return "operator";
    }
    stream.next();
    return "punctuation";
  }

  if (/[+\-*/%=<>!&|^~?]/.test(ch)) {
    stream.next();
    stream.eatWhile(/[+\-*/%=<>!&|^~?]/);
    return "operator";
  }
  if (/[[\](){},.:;]/.test(ch)) {
    stream.next();
    return "punctuation";
  }

  stream.next();
  return null;
}

export function csharpLang(): Language<CSharpState> {
  return {
    name: "csharp",
    aliases: ["csharp", "cs", "c#"],
    startState(): CSharpState {
      return { ctx: [{ kind: "code" }] };
    },
    token(stream, state): TokenType | null {
      const top = topCtx(state);
      if (top.kind === "blockComment") {
        return readBlockCommentBody(stream, state);
      }
      if (top.kind === "vStr") {
        return readVerbatimBody(stream, state);
      }
      if (top.kind === "iStr") {
        return readInterpolatedBody(stream, state, top);
      }
      return tokenCode(stream, state);
    },
    lineComment: "//",
    blockComment: { open: "/*", close: "*/" },
    bracketPairs: [["(", ")"], ["[", "]"], ["{", "}"]],
    autoCloseMap: {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
    },
    electricInput: /[{}()[\]]/,
  };
}
