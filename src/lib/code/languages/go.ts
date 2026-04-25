import type { Language, StringStream, TokenType } from "../types";

const GO_KEYWORDS = new Set([
  "break", "case", "chan", "const", "continue", "default", "defer", "else",
  "fallthrough", "for", "func", "go", "goto", "if", "import", "interface",
  "map", "package", "range", "return", "select", "struct", "switch",
  "type", "var",
]);

const GO_TYPES = new Set([
  "bool", "byte", "complex64", "complex128", "error", "float32", "float64",
  "int", "int8", "int16", "int32", "int64", "rune", "string", "uint",
  "uint8", "uint16", "uint32", "uint64", "uintptr", "any", "comparable",
]);

const GO_BUILTINS = new Set([
  "append", "cap", "clear", "close", "complex", "copy", "delete", "imag",
  "len", "make", "max", "min", "new", "panic", "print", "println", "real",
  "recover",
  "true", "false", "iota", "nil",
]);

interface GoState {
  inBlockComment: boolean;
  /** Inside a multi-line backtick raw string. */
  inRawString: boolean;
}

function readBlockComment(stream: StringStream, state: GoState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.inBlockComment = false;
      return "comment";
    }
    stream.next();
  }
  return "comment";
}

/** Interpreted string `"..."` — must close on the same line per Go spec. */
function readInterpretedString(stream: StringStream): TokenType {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      if (stream.eol()) return "string";
      stream.next();
      continue;
    }
    if (ch === '"') return "string";
  }
  return "string";
}

/** Raw string body — `\` is literal; only the closing backtick ends it. */
function readRawString(stream: StringStream, state: GoState): TokenType {
  while (!stream.eol()) {
    if (stream.next() === "`") {
      state.inRawString = false;
      return "string";
    }
  }
  return "string";
}

function readRune(stream: StringStream): TokenType {
  // `'x'`, `'\n'`, `'A'`. We've consumed the opening quote.
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      if (!stream.eol()) stream.next();
      continue;
    }
    if (ch === "'") return "string";
  }
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F_]+(p[+-]?\d+)?i?/, true)) return "number";
  if (stream.match(/0[bB][01_]+i?/, true)) return "number";
  if (stream.match(/0[oO][0-7_]+i?/, true)) return "number";
  stream.match(
    /\d[\d_]*(\.[\d_]*)?([eE][+-]?\d+)?i?/,
    true,
  );
  return "number";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  const word = stream.current();
  if (GO_KEYWORDS.has(word)) return "keyword";
  if (GO_TYPES.has(word)) return "type";
  if (GO_BUILTINS.has(word)) return "function";
  // Go capitalisation is the visibility marker — exported = capitalised.
  // Capital words are types if followed by `{` or used in declarations,
  // otherwise variables. Use a `(` lookahead heuristic.
  const rest = stream.line.slice(stream.pos);
  if (/^[A-Z][A-Z0-9_]+$/.test(word) && word.length > 1) return "variable";
  if (/^[A-Z]/.test(word)) {
    if (/^\s*\(/.test(rest)) return "function";
    return "type";
  }
  if (/^\s*\(/.test(rest)) return "function";
  return "variable";
}

export function goLang(): Language<GoState> {
  return {
    name: "go",
    aliases: ["go", "golang"],
    startState(): GoState {
      return { inBlockComment: false, inRawString: false };
    },
    token(stream, state): TokenType | null {
      if (state.inBlockComment) return readBlockComment(stream, state);
      if (state.inRawString) return readRawString(stream, state);

      if (stream.eatSpace()) return null;
      const ch = stream.peek();
      if (!ch) return null;

      if (stream.match("//", true)) {
        stream.skipToEnd();
        return "comment";
      }
      if (stream.match("/*", true)) {
        state.inBlockComment = true;
        return readBlockComment(stream, state);
      }

      if (ch === '"') {
        stream.next();
        return readInterpretedString(stream);
      }
      if (ch === "`") {
        stream.next();
        state.inRawString = true;
        return readRawString(stream, state);
      }
      if (ch === "'") {
        stream.next();
        return readRune(stream);
      }

      if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
        return readNumber(stream);
      }

      if (/[A-Za-z_]/.test(ch)) {
        return readIdentifier(stream);
      }

      // Multi-char operators worth grouping.
      if (stream.match(":=", true)) return "operator";
      if (stream.match("<-", true)) return "operator";
      if (stream.match("...", true)) return "operator";

      if (/[+\-*/%=<>!&|^]/.test(ch)) {
        stream.next();
        stream.eatWhile(/[+\-*/%=<>!&|^]/);
        return "operator";
      }
      if (/[[\](){},.:;]/.test(ch)) {
        stream.next();
        return "punctuation";
      }

      stream.next();
      return null;
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
