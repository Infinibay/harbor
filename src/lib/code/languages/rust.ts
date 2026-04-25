import type { Language, StringStream, TokenType } from "../types";

const RUST_KEYWORDS = new Set([
  "as", "async", "await", "break", "const", "continue", "crate", "dyn",
  "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in",
  "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return",
  "self", "Self", "static", "struct", "super", "trait", "true", "type",
  "unsafe", "use", "where", "while", "union",
  // Reserved (currently unused).
  "abstract", "become", "box", "do", "final", "macro", "override", "priv",
  "try", "typeof", "unsized", "virtual", "yield",
]);

const RUST_TYPES = new Set([
  "bool", "char", "str", "String",
  "i8", "i16", "i32", "i64", "i128", "isize",
  "u8", "u16", "u32", "u64", "u128", "usize",
  "f32", "f64",
  "Vec", "Option", "Result", "Box", "Rc", "Arc", "Cell", "RefCell",
  "Mutex", "RwLock",
  "HashMap", "HashSet", "BTreeMap", "BTreeSet", "VecDeque", "LinkedList",
  "Iterator", "IntoIterator", "FromIterator",
  "Send", "Sync", "Sized", "Copy", "Clone", "Drop",
  "Debug", "Display", "Default",
  "Fn", "FnMut", "FnOnce", "PhantomData",
  "Cow", "Path", "PathBuf", "OsStr", "OsString",
]);

const RUST_BUILTINS = new Set([
  "Some", "None", "Ok", "Err", "true", "false",
]);

interface RustState {
  /** Block comments in Rust nest — track depth, not boolean. */
  blockCommentDepth: number;
  /** Active raw-string close marker (e.g. '"##') and whether we're in a
   *  byte raw string (no UTF-8 implication for highlighting, kept for
   *  future extension). */
  rawStringClose: string | null;
}

function readNestedBlockComment(stream: StringStream, state: RustState): TokenType {
  while (!stream.eol()) {
    if (stream.match("*/", true)) {
      state.blockCommentDepth--;
      if (state.blockCommentDepth === 0) return "comment";
      continue;
    }
    if (stream.match("/*", true)) {
      state.blockCommentDepth++;
      continue;
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

function readRawStringBody(
  stream: StringStream,
  state: RustState,
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

/** Try to consume a raw-string opener at the current position. Stream
 *  must be peek() === 'r' or 'b' (with optional 'r' after). On success,
 *  consumes the prefix + opening quote and returns the close marker. */
function tryRawStringOpener(stream: StringStream): string | null {
  // `b` byte prefix is optional, then `r`, then `#*`, then `"`.
  const m = stream.match(/b?r(#*)"/, true) as RegExpMatchArray | boolean | null;
  if (!m || m === true) return null;
  const hashes = (m as RegExpMatchArray)[1] ?? "";
  return '"' + hashes;
}

/** Distinguishes `'a` (lifetime / label) from `'a'` (char literal) by
 *  peeking ahead. Rust grammar resolves this purely lexically. Returns
 *  the token type after consuming the appropriate span. */
function readQuoteOrLifetime(stream: StringStream): TokenType {
  // Position is on the leading `'`.
  stream.next();
  const first = stream.peek();
  if (!first) return "string";
  // Escaped char: `'\n'`, `'\u{...}'`, `'\\'`, etc.
  if (first === "\\") {
    stream.next();
    // Eat escape sequence body until closing `'` or end.
    while (!stream.eol()) {
      const c = stream.next();
      if (c === "'") return "string";
    }
    return "string";
  }
  // Lifetime label: `'foo` where the ident is NOT immediately followed
  // by another `'`. Char literals are exactly one char between quotes.
  if (/[A-Za-z_]/.test(first)) {
    const second = stream.line.charAt(stream.pos + 1);
    if (second === "'") {
      // Single-char literal.
      stream.next(); // the char
      stream.next(); // closing quote
      return "string";
    }
    // Lifetime.
    stream.eatWhile(/[A-Za-z0-9_]/);
    return "variable";
  }
  // Single-char literal of any other kind (`' '`, `'@'`, etc.).
  stream.next();
  if (stream.peek() === "'") {
    stream.next();
  }
  return "string";
}

function readNumber(stream: StringStream): TokenType {
  if (stream.match(/0[xX][0-9a-fA-F_]+/, true)) {
    stream.match(/[iuUfF](?:8|16|32|64|128|size)?/, true);
    return "number";
  }
  if (stream.match(/0[bB][01_]+/, true)) {
    stream.match(/[iuUfF](?:8|16|32|64|128|size)?/, true);
    return "number";
  }
  if (stream.match(/0[oO][0-7_]+/, true)) {
    stream.match(/[iuUfF](?:8|16|32|64|128|size)?/, true);
    return "number";
  }
  stream.match(
    /\d[\d_]*(\.[\d_]+)?([eE][+-]?\d+)?(?:[iuf](?:8|16|32|64|128|size)?)?/,
    true,
  );
  return "number";
}

function readIdentifier(stream: StringStream): TokenType {
  stream.eatWhile(/[A-Za-z0-9_]/);
  // Macro invocation: `println!`, `vec!`.
  if (stream.eat("!")) return "function";
  const word = stream.current();
  if (RUST_KEYWORDS.has(word)) return "keyword";
  if (RUST_TYPES.has(word)) return "type";
  if (RUST_BUILTINS.has(word)) return "variable";
  // Snake_case is the variable / fn convention; anything starting capital
  // is a type, struct, enum variant, or trait.
  if (/^[A-Z]/.test(word)) {
    if (/^[A-Z][A-Z0-9_]+$/.test(word)) return "variable"; // SCREAMING_CONST
    return "type";
  }
  const rest = stream.line.slice(stream.pos);
  if (/^\s*::/.test(rest)) return "type";
  if (/^\s*\(/.test(rest)) return "function";
  if (/^\s*</.test(rest)) {
    // `fn name<T>` or `Type<T>` — already handled above for capitalised.
  }
  return "variable";
}

/** `r"…"` raw identifier (`r#type`, `r#fn`) — keyword escape. */
function readRawIdent(stream: StringStream): TokenType {
  // Already consumed `r#` in caller? We're called when we've decided this
  // isn't a raw string — caller restores position. Here we just eat the
  // ident.
  stream.eatWhile(/[A-Za-z0-9_]/);
  return "variable";
}

export function rustLang(): Language<RustState> {
  return {
    name: "rust",
    aliases: ["rust", "rs"],
    startState(): RustState {
      return { blockCommentDepth: 0, rawStringClose: null };
    },
    token(stream, state): TokenType | null {
      if (state.blockCommentDepth > 0) {
        return readNestedBlockComment(stream, state);
      }
      if (state.rawStringClose !== null) {
        return readRawStringBody(stream, state, state.rawStringClose);
      }

      if (stream.eatSpace()) return null;
      const ch = stream.peek();
      if (!ch) return null;

      // Comments (block comment is nested-aware).
      if (stream.match("//", true)) {
        // `//!` is inner doc, `///` outer doc — still comments.
        stream.skipToEnd();
        return "comment";
      }
      if (stream.match("/*", true)) {
        state.blockCommentDepth = 1;
        return readNestedBlockComment(stream, state);
      }

      // Attribute openers: `#[…]` outer, `#![…]` inner. We tag the opener
      // and closer as `meta` so the body still receives proper tokens.
      if (stream.match("#![", true)) return "meta";
      if (stream.match("#[", true)) return "meta";

      // Raw and byte string openers. Must precede plain identifier read.
      if (ch === "r" || ch === "b") {
        const close = tryRawStringOpener(stream);
        if (close) return readRawStringBody(stream, state, close);
        // Byte string: `b"..."`, byte char: `b'...'`.
        if (ch === "b") {
          if (stream.match('b"', true)) return readSimpleString(stream, '"');
          if (stream.match("b'", true)) return readSimpleString(stream, "'");
        }
        // Raw identifier: `r#keyword`.
        if (stream.match(/r#(?=[A-Za-z_])/, true)) {
          return readRawIdent(stream);
        }
        // Fall through to identifier handling.
      }

      if (ch === '"') {
        stream.next();
        return readSimpleString(stream, '"');
      }
      if (ch === "'") {
        return readQuoteOrLifetime(stream);
      }

      if (/\d/.test(ch)) {
        return readNumber(stream);
      }

      if (/[A-Za-z_]/.test(ch)) {
        return readIdentifier(stream);
      }

      // `::` is the only multi-char punctuation worth grouping.
      if (stream.match("::", true)) return "punctuation";
      // `->` `=>` are operators.
      if (stream.match("->", true)) return "operator";
      if (stream.match("=>", true)) return "operator";

      if (/[+\-*/%=<>!&|^~?]/.test(ch)) {
        stream.next();
        stream.eatWhile(/[+\-*/%=<>!&|^~?]/);
        return "operator";
      }
      if (/[[\](){},.:;]/.test(ch)) {
        stream.next();
        return "punctuation";
      }
      // Closing attribute brackets get tagged meta only when the opener
      // produced one — kept simple via punctuation otherwise.
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
    },
    electricInput: /[{}()[\]]/,
  };
}
