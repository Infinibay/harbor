import type { Language, StringStream, TokenType } from "../types";

const KOTLIN_HARD_KEYWORDS = new Set([
  "as", "break", "class", "continue", "do", "else", "false", "for", "fun",
  "if", "in", "interface", "is", "null", "object", "package", "return",
  "super", "this", "throw", "true", "try", "typealias", "typeof", "val",
  "var", "when", "while",
]);

const KOTLIN_SOFT_KEYWORDS = new Set([
  "abstract", "actual", "annotation", "by", "catch", "companion", "const",
  "constructor", "crossinline", "data", "delegate", "dynamic", "enum",
  "expect", "external", "field", "file", "final", "finally", "get",
  "import", "infix", "init", "inline", "inner", "internal", "lateinit",
  "noinline", "open", "operator", "out", "override", "param", "private",
  "property", "protected", "public", "receiver", "reified", "sealed",
  "set", "setparam", "suspend", "tailrec", "vararg", "where", "it",
]);

const KOTLIN_TYPES = new Set([
  "Int", "Long", "Short", "Byte", "Float", "Double", "Boolean", "Char",
  "String", "Any", "Unit", "Nothing", "Number",
  "Array", "IntArray", "LongArray", "ShortArray", "ByteArray",
  "FloatArray", "DoubleArray", "BooleanArray", "CharArray",
  "List", "Map", "Set", "MutableList", "MutableMap", "MutableSet",
  "Collection", "MutableCollection", "Iterable", "MutableIterable",
  "Iterator", "MutableIterator", "ListIterator",
  "Sequence", "Pair", "Triple",
  "Comparable", "Comparator", "Throwable", "Exception",
  "Lazy", "Result", "Regex",
]);

const KOTLIN_BUILTINS = new Set([
  "println", "print", "readLine", "TODO", "require", "check",
  "requireNotNull", "checkNotNull", "error",
  "listOf", "mutableListOf", "mapOf", "mutableMapOf", "setOf",
  "mutableSetOf", "arrayOf", "intArrayOf", "longArrayOf",
  "lazy", "let", "apply", "run", "with", "also", "use", "takeIf",
  "takeUnless",
]);

interface KotlinState {
  ctx: KotlinCtx[];
}

type KotlinCtx =
  | { kind: "code" }
  | { kind: "blockComment"; depth: number }
  | { kind: "str" }       // `"..."`
  | { kind: "rawStr" };   // `"""..."""`

function topCtx(state: KotlinState): KotlinCtx {
  return state.ctx[state.ctx.length - 1] ?? { kind: "code" };
}

/** Kotlin block comments nest. */
function readBlockComment(stream: StringStream, state: KotlinState): TokenType {
  const top = topCtx(state);
  if (top.kind !== "blockComment") return "comment";
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      top.depth--;
      if (top.depth === 0) {
        state.ctx.pop();
        return "comment";
      }
      continue;
    }
    if (stream.match("/*", true)) {
      top.depth++;
      continue;
    }
    stream.next();
  }
  return "comment";
}

/** Body of `"…"` — handles `\` escapes and `$var` / `${...}` templates. */
function readStringBody(stream: StringStream, state: KotlinState): TokenType {
  while (!stream.eol()) {
    const ch = stream.peek();
    if (!ch) break;
    if (ch === "\\") {
      stream.next();
      if (!stream.eol()) stream.next();
      continue;
    }
    if (ch === "$") {
      const next1 = stream.line.charAt(stream.pos + 1);
      if (next1 === "{") {
        if (stream.pos > stream.start) return "string";
        stream.next(); // $
        stream.next(); // {
        state.ctx.push({ kind: "code" });
        return "operator";
      }
      if (/[A-Za-z_]/.test(next1)) {
        if (stream.pos > stream.start) return "string";
        stream.next(); // $
        stream.eatWhile(/[A-Za-z0-9_]/);
        return "variable";
      }
      stream.next();
      continue;
    }
    if (ch === '"') {
      stream.next();
      state.ctx.pop();
      return "string";
    }
    stream.next();
  }
  return "string";
}

/** Body of `"""…"""` — no `\` escape; `$var` and `${expr}` still apply. */
function readRawStringBody(stream: StringStream, state: KotlinState): TokenType {
  while (!stream.eol()) {
    if (stream.match('"""', true)) {
      // Optional trailing extra `"` (Kotlin allows up to two more).
      stream.eat('"');
      stream.eat('"');
      state.ctx.pop();
      return "string";
    }
    const ch = stream.peek();
    if (!ch) break;
    if (ch === "$") {
      const next1 = stream.line.charAt(stream.pos + 1);
      if (next1 === "{") {
        if (stream.pos > stream.start) return "string";
        stream.next();
        stream.next();
        state.ctx.push({ kind: "code" });
        return "operator";
      }
      if (/[A-Za-z_]/.test(next1)) {
        if (stream.pos > stream.start) return "string";
        stream.next();
        stream.eatWhile(/[A-Za-z0-9_]/);
        return "variable";
      }
    }
    stream.next();
  }
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F_]+[uU]?[lL]?/, true)) return "number";
  if (stream.match(/0[bB][01_]+[uU]?[lL]?/, true)) return "number";
  stream.match(/\d[\d_]*(\.[\d_]+)?([eE][+-]?\d+)?[fFdDuUlL]?/, true);
  return "number";
}

function readBacktickIdent(stream: StringStream): TokenType {
  // Already consumed leading backtick.
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "`") return "variable";
  }
  return "variable";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  const word = stream.current();
  if (KOTLIN_HARD_KEYWORDS.has(word)) return "keyword";
  if (KOTLIN_SOFT_KEYWORDS.has(word)) return "keyword";
  if (KOTLIN_TYPES.has(word)) return "type";
  if (KOTLIN_BUILTINS.has(word)) return "function";
  if (/^[A-Z][A-Z0-9_]+$/.test(word) && word.length > 1) return "variable";
  if (/^[A-Z]/.test(word)) return "type";
  const rest = stream.line.slice(stream.pos);
  if (/^\s*\(/.test(rest)) return "function";
  return "variable";
}

function readAnnotation(stream: StringStream): TokenType {
  // Already past the `@`.
  // Use-site target syntax: `@param:Foo`, `@field:Bar`.
  stream.eatWhile(/[A-Za-z0-9_]/);
  if (stream.eat(":")) {
    stream.eatWhile(/[A-Za-z0-9_.]/);
  } else {
    while (stream.eat(".")) stream.eatWhile(/[A-Za-z0-9_]/);
  }
  return "meta";
}

function tokenCode(stream: StringStream, state: KotlinState): TokenType | null {
  if (stream.eatSpace()) return null;
  const ch = stream.peek();
  if (!ch) return null;

  if (stream.match("//", true)) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("/*", true)) {
    state.ctx.push({ kind: "blockComment", depth: 1 });
    return readBlockComment(stream, state);
  }

  // Triple-quoted raw string must precede `"`.
  if (stream.match('"""', true)) {
    state.ctx.push({ kind: "rawStr" });
    return readRawStringBody(stream, state);
  }
  if (ch === '"') {
    stream.next();
    state.ctx.push({ kind: "str" });
    return readStringBody(stream, state);
  }

  if (ch === "'") {
    // Char literal — Kotlin disallows multi-char.
    stream.next();
    while (!stream.eol()) {
      const c = stream.next();
      if (c === "\\") {
        if (!stream.eol()) stream.next();
        continue;
      }
      if (c === "'") return "string";
    }
    return "string";
  }

  if (ch === "`") {
    stream.next();
    return readBacktickIdent(stream);
  }

  if (ch === "@") {
    stream.next();
    return readAnnotation(stream);
  }

  if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
    return readNumber(stream);
  }

  if (/[A-Za-z_]/.test(ch)) {
    return readIdentifier(stream);
  }

  // `}` closes an interpolation if the directly enclosing ctx (below us)
  // is a string.
  if (ch === "}") {
    const below = state.ctx[state.ctx.length - 2];
    if (below && (below.kind === "str" || below.kind === "rawStr")) {
      stream.next();
      state.ctx.pop();
      return "operator";
    }
    stream.next();
    return "punctuation";
  }

  if (stream.match("->", true)) return "operator";
  if (stream.match("?:", true)) return "operator";
  if (stream.match("?.", true)) return "operator";
  if (stream.match("!!", true)) return "operator";
  if (stream.match("::", true)) return "punctuation";
  if (stream.match("..", true)) return "operator";

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

export function kotlinLang(): Language<KotlinState> {
  return {
    name: "kotlin",
    aliases: ["kotlin", "kt", "kts"],
    startState(): KotlinState {
      return { ctx: [{ kind: "code" }] };
    },
    token(stream, state): TokenType | null {
      const top = topCtx(state);
      if (top.kind === "blockComment") return readBlockComment(stream, state);
      if (top.kind === "str") return readStringBody(stream, state);
      if (top.kind === "rawStr") return readRawStringBody(stream, state);
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
      "`": "`",
    },
    electricInput: /[{}()[\]]/,
  };
}
