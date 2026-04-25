import type { Language, StringStream, TokenType } from "../types";

const CPP_KEYWORDS = new Set([
  "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor",
  "break", "case", "catch", "class", "co_await", "co_return", "co_yield",
  "compl", "concept", "const", "consteval", "constexpr", "constinit",
  "const_cast", "continue", "decltype", "default", "delete", "do",
  "dynamic_cast", "else", "enum", "explicit", "export", "extern", "for",
  "friend", "goto", "if", "inline", "mutable", "namespace", "new",
  "noexcept", "not", "not_eq", "operator", "or", "or_eq", "private",
  "protected", "public", "register", "reinterpret_cast", "requires",
  "return", "sizeof", "static", "static_assert", "static_cast", "struct",
  "switch", "template", "this", "thread_local", "throw", "try", "typedef",
  "typeid", "typename", "union", "using", "virtual", "volatile", "while",
  "xor", "xor_eq", "override", "final", "import", "module",
]);

const CPP_TYPES = new Set([
  "bool", "char", "char8_t", "char16_t", "char32_t", "double", "float",
  "int", "long", "short", "signed", "unsigned", "void", "wchar_t",
  "size_t", "ssize_t", "ptrdiff_t", "intptr_t", "uintptr_t",
  "int8_t", "int16_t", "int32_t", "int64_t",
  "uint8_t", "uint16_t", "uint32_t", "uint64_t",
  "string", "wstring", "string_view", "span",
  "vector", "array", "deque", "list", "forward_list",
  "map", "unordered_map", "multimap", "unordered_multimap",
  "set", "unordered_set", "multiset", "unordered_multiset",
  "stack", "queue", "priority_queue",
  "pair", "tuple", "optional", "variant", "any",
  "shared_ptr", "unique_ptr", "weak_ptr",
  "function", "thread", "future", "promise", "atomic", "mutex",
]);

const CPP_BUILTINS = new Set([
  "true", "false", "nullptr", "NULL",
  "std", "cout", "cin", "cerr", "clog", "endl",
  "make_shared", "make_unique", "move", "forward", "begin", "end",
  "size", "data", "swap",
]);

interface CppState {
  inBlockComment: boolean;
  /** Active raw-string delimiter, e.g. ")delim\"" — the line tokenizer
   *  reads until that exact sequence. C++ raw strings cross newlines. */
  rawStringClose: string | null;
  inPpContinuation: boolean;
}

function readBlockComment(stream: StringStream, state: CppState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.inBlockComment = false;
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

/** Reads from the start of the body of a C++ raw string. The delimiter
 *  is everything between `R"` and the opening `(`; its closing form is
 *  `)delim"`. We've already consumed the prefix + opening up to `(`. */
function readRawStringBody(
  stream: StringStream,
  state: CppState,
  close: string,
): TokenType {
  while (!stream.eol()) {
    if (stream.match(close, true)) {
      state.rawStringClose = null;
      return "string";
    }
    stream.next();
  }
  state.rawStringClose = close;
  return "string";
}

/** Detects an *opening* C++ raw string at the current stream position.
 *  Expects to be called with peek() === one of: 'R', 'u', 'U', 'L'. The
 *  optional encoding prefix (`u8R`, `LR`, etc.) plus the `R"delim(` part
 *  are consumed; returns the closing token (`)delim"`) the body reader
 *  should look for, or null if it isn't a raw string. */
function tryRawStringOpener(stream: StringStream): string | null {
  const start = stream.pos;
  const m = stream.match(
    /(?:u8|u|U|L)?R"([^()\\\s]{0,16})\(/,
    true,
  ) as RegExpMatchArray | boolean | null;
  if (!m || typeof m === "boolean") return null;
  // Group 1 is the delimiter — `m[1]` from the array form.
  if (Array.isArray(m)) {
    return ")" + (m[1] ?? "") + '"';
  }
  // Belt + braces: rewind if we somehow got a truthy non-array.
  while (stream.pos > start) stream.backUp(1);
  return null;
}

/** Detects a regular encoded string opener: `u8"..."`, `u"..."`, `U"..."`,
 *  `L"..."`. Consumes the prefix + opening quote. */
function tryEncodedStringOpener(stream: StringStream): boolean {
  return Boolean(stream.match(/(?:u8|u|U|L)?"/, true));
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F']+/, true)) {
    stream.match(/[uUlLzZ]+/, true);
    return "number";
  }
  if (stream.match(/0[bB][01']+/, true)) {
    stream.match(/[uUlL]+/, true);
    return "number";
  }
  stream.match(/\d[\d']*(\.[\d']*)?([eE][+-]?\d+)?[fFlLuUiI]*/, true);
  // C++23 user-defined literals: `42_km`, `3.14_pi`. Treat the suffix as
  // an operator-ish identifier for visibility.
  if (stream.match(/_[A-Za-z_][A-Za-z0-9_]*/, true)) return "number";
  return "number";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  const word = stream.current();
  if (CPP_KEYWORDS.has(word)) return "keyword";
  if (CPP_TYPES.has(word)) return "type";
  if (CPP_BUILTINS.has(word)) return "variable";
  if (/_t$/.test(word) && /^[a-z]/.test(word)) return "type";
  if (/^[A-Z][A-Z0-9_]+$/.test(word)) return "variable";
  if (/^[A-Z]/.test(word)) return "type";
  const rest = stream.line.slice(stream.pos);
  // `Foo<…>` template instantiation — heuristic.
  if (/^\s*</.test(rest) && /^[A-Z]/.test(word)) return "type";
  if (/^\s*::/.test(rest)) return "type";
  if (/^\s*\(/.test(rest)) return "function";
  return "variable";
}

function readPreprocessor(stream: StringStream, state: CppState): TokenType {
  const trailing = /\\\s*$/.test(stream.line);
  if (stream.peek() === "#") {
    stream.next();
    stream.eatSpace();
  }
  if (stream.match(/[A-Za-z_]+/, true)) {
    if (trailing) state.inPpContinuation = true;
    return "keyword";
  }
  if (trailing) state.inPpContinuation = true;
  return "meta";
}

function readPpHeaderName(stream: StringStream): TokenType {
  stream.next();
  while (!stream.eol() && stream.next() !== ">") { /* consume */ }
  return "string";
}

function tokenCode(
  stream: StringStream,
  state: CppState,
  inPp: boolean,
): TokenType | null {
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

  // Encoded / raw string literal openers (must precede plain identifier).
  if (ch === "R" || ch === "u" || ch === "U" || ch === "L") {
    const close = tryRawStringOpener(stream);
    if (close) return readRawStringBody(stream, state, close);
    if (tryEncodedStringOpener(stream)) {
      return readSimpleString(stream, '"');
    }
    // Fall through to identifier.
  }

  if (ch === '"') {
    stream.next();
    return readSimpleString(stream, '"');
  }
  if (ch === "'") {
    stream.next();
    return readSimpleString(stream, "'");
  }

  if (inPp && ch === "<") {
    return readPpHeaderName(stream);
  }

  // C++11 attribute syntax: `[[nodiscard]]`. Treat the `[[` as meta and
  // let the body tokenize normally — we re-enter via `]]`.
  if (stream.match("[[", true)) return "meta";
  if (stream.match("]]", true)) return "meta";

  if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
    return readNumber(stream);
  }

  if (/[A-Za-z_]/.test(ch)) {
    return readIdentifier(stream);
  }

  // `::` scope is a punctuation pair.
  if (stream.match("::", true)) return "punctuation";

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

export function cppLang(): Language<CppState> {
  return {
    name: "cpp",
    aliases: ["cpp", "c++", "cxx", "cc", "hpp", "hh", "hxx"],
    startState(): CppState {
      return {
        inBlockComment: false,
        rawStringClose: null,
        inPpContinuation: false,
      };
    },
    token(stream, state): TokenType | null {
      if (state.inBlockComment) {
        return readBlockComment(stream, state);
      }
      if (state.rawStringClose !== null) {
        return readRawStringBody(stream, state, state.rawStringClose);
      }
      if (state.inPpContinuation) {
        const trailing = /\\\s*$/.test(stream.line);
        if (!trailing) state.inPpContinuation = false;
        return tokenCode(stream, state, true);
      }

      if (stream.sol()) {
        const probe = stream.line.replace(/^\s+/, "");
        if (probe.startsWith("#")) {
          if (stream.eatSpace()) return null;
          return readPreprocessor(stream, state);
        }
      }

      return tokenCode(stream, state, false);
    },
    lineComment: "//",
    blockComment: { open: "/*", close: "*/" },
    bracketPairs: [["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"]],
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
