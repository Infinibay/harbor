import type { Language, StringStream, TokenType } from "../types";

/** ISO C keywords through C23. Type-name keywords (`int`, `void`, …)
 *  live in `C_TYPES` below so consumers can colour them differently. */
const C_KEYWORDS = new Set([
  "auto", "break", "case", "const", "continue", "default", "do", "else",
  "enum", "extern", "for", "goto", "if", "inline", "register", "restrict",
  "return", "sizeof", "static", "struct", "switch", "typedef", "union",
  "volatile", "while",
  "_Alignas", "_Alignof", "_Atomic", "_Bool", "_Complex", "_Generic",
  "_Imaginary", "_Noreturn", "_Static_assert", "_Thread_local",
  "alignas", "alignof", "static_assert", "thread_local",
]);

const C_TYPES = new Set([
  "char", "double", "float", "int", "long", "short", "signed", "unsigned",
  "void", "bool",
  "size_t", "ssize_t", "ptrdiff_t", "intptr_t", "uintptr_t",
  "int8_t", "int16_t", "int32_t", "int64_t",
  "uint8_t", "uint16_t", "uint32_t", "uint64_t",
  "FILE", "wchar_t", "char16_t", "char32_t",
  "intmax_t", "uintmax_t", "clock_t", "time_t",
]);

const C_BUILTINS = new Set([
  "true", "false", "NULL", "nullptr", "stdin", "stdout", "stderr",
  "EOF", "__func__",
]);

interface CState {
  /** Inside a `/​* … *​/` that crossed a line boundary. */
  inBlockComment: boolean;
  /** Inside a preprocessor directive that ended with a `\` continuation. */
  inPpContinuation: boolean;
  /** Inside a string literal (`"..."`) that ended with `\` continuation. */
  inStringContinuation: boolean;
}

function readBlockComment(stream: StringStream, state: CState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.inBlockComment = false;
      return "comment";
    }
    stream.next();
  }
  return "comment";
}

/** Reads a `"..."` or `'...'`. C allows `\` line-continuation: a backslash
 *  immediately before the newline keeps the literal open on the next line. */
function readString(stream: StringStream, quote: string, state: CState): TokenType {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === "\\") {
      if (stream.eol()) {
        state.inStringContinuation = true;
        return "string";
      }
      stream.next();
      continue;
    }
    if (ch === quote) return "string";
  }
  // Unterminated single-line string: not a continuation, just stop.
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  // Hex (with optional bit-precise / size suffixes)
  if (stream.match(/0[xX][0-9a-fA-F']+/, true)) {
    stream.match(/[uUlLzZ]+/, true);
    return "number";
  }
  if (stream.match(/0[bB][01']+/, true)) {
    stream.match(/[uUlL]+/, true);
    return "number";
  }
  // Octal: 0[0-7]*
  if (stream.match(/0[0-7']*[uUlL]*/, true) && /\D/.test(stream.peek() ?? "")) {
    return "number";
  }
  // Decimal / float
  stream.match(/\d[\d']*(\.[\d']*)?([eE][+-]?\d+)?[fFlLuU]*/, true);
  return "number";
}

/** Preprocessor line. Consumed in chunks so the directive name (`include`,
 *  `define`, …) is highlighted as `keyword`, headers as `string`, etc. */
function readPreprocessor(stream: StringStream, state: CState): TokenType {
  // Line continuation? Mark state and let the body run again next line.
  const trailing = /\\\s*$/.test(stream.line);
  // Skip the leading `#` and optional whitespace.
  if (stream.peek() === "#") {
    stream.next();
    stream.eatSpace();
  }
  // Directive name.
  if (stream.match(/[A-Za-z_]+/, true)) {
    if (trailing) state.inPpContinuation = true;
    return "keyword";
  }
  if (trailing) state.inPpContinuation = true;
  return "meta";
}

function readPpHeaderName(stream: StringStream): TokenType {
  // <stdio.h>
  stream.next(); // consume `<`
  while (!stream.eol() && stream.next() !== ">") { /* consume */ }
  return "string";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  const word = stream.current();
  if (C_KEYWORDS.has(word)) return "keyword";
  if (C_TYPES.has(word)) return "type";
  if (C_BUILTINS.has(word)) return "variable";
  // Trailing `_t` is a strong type-name convention in C codebases.
  if (/_t$/.test(word) && /^[a-z]/.test(word)) return "type";
  if (/^[A-Z][A-Z0-9_]*$/.test(word)) return "variable";
  // PascalCase is uncommon in C but used for typedef'd structs.
  if (/^[A-Z]/.test(word)) return "type";
  // Followed by `(` → function call site.
  if (/^\s*\(/.test(stream.line.slice(stream.pos))) return "function";
  return "variable";
}

function tokenCode(
  stream: StringStream,
  state: CState,
  /** True if we're still inside a #-line that started on a previous line. */
  inPp: boolean,
): TokenType | null {
  if (stream.eatSpace()) return null;
  const ch = stream.peek();
  if (!ch) return null;

  // Comments
  if (stream.match("//", true)) {
    stream.skipToEnd();
    return "comment";
  }
  if (stream.match("/*", true)) {
    state.inBlockComment = true;
    return readBlockComment(stream, state);
  }

  // String / char literal.
  if (ch === '"') {
    stream.next();
    return readString(stream, '"', state);
  }
  if (ch === "'") {
    stream.next();
    return readString(stream, "'", state);
  }

  // Inside `#include`, `<...>` is a header path.
  if (inPp && ch === "<") {
    return readPpHeaderName(stream);
  }

  if (/\d/.test(ch) || (ch === "." && /\d/.test(stream.line.charAt(stream.pos + 1) ?? ""))) {
    return readNumber(stream);
  }

  if (/[A-Za-z_]/.test(ch)) {
    return readIdentifier(stream);
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

export function cLang(): Language<CState> {
  return {
    name: "c",
    aliases: ["c", "h"],
    startState(): CState {
      return {
        inBlockComment: false,
        inPpContinuation: false,
        inStringContinuation: false,
      };
    },
    token(stream, state): TokenType | null {
      // Continuations consume the whole line as the current mode.
      if (state.inBlockComment) {
        return readBlockComment(stream, state);
      }
      if (state.inStringContinuation) {
        // Continue reading until the original quote closes. We don't track
        // which quote — line-continuation strings are vanishingly rare and
        // the next "/' will close it.
        while (!stream.eol()) {
          const c = stream.next();
          if (c === "\\") {
            if (stream.eol()) return "string";
            stream.next();
            continue;
          }
          if (c === '"' || c === "'") {
            state.inStringContinuation = false;
            return "string";
          }
        }
        return "string";
      }

      if (state.inPpContinuation) {
        const trailing = /\\\s*$/.test(stream.line);
        if (!trailing) state.inPpContinuation = false;
        // Body of a continued preprocessor line — tokenise as code, but the
        // backslash itself is meta.
        return tokenCode(stream, state, true);
      }

      // Detect a fresh preprocessor line at SOL.
      if (stream.sol()) {
        const probe = stream.line.replace(/^\s+/, "");
        if (probe.startsWith("#")) {
          // Eat any leading whitespace as null, then `#directive`.
          if (stream.eatSpace()) return null;
          return readPreprocessor(stream, state);
        }
      }

      return tokenCode(stream, state, false);
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
