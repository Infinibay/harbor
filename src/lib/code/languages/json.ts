import type { Language, TokenType } from "../types";

export interface JsonOptions {
  /** Allow JSON5 extensions: comments, trailing commas, single-quoted
   *  strings, unquoted keys. Default: strict JSON only. */
  json5?: boolean;
}

interface JsonState {
  /** True when the previous meaningful token signals "next identifier
   *  is a property key" (start of object, after a comma). Used to
   *  classify keys distinctly from string values. */
  expectKey: boolean;
  /** Track whether we're inside a block comment that spans lines. */
  inBlockComment: boolean;
}

const LITERAL_KEYWORDS = new Set(["true", "false", "null"]);

export function jsonLang(opts: JsonOptions = {}): Language<JsonState> {
  const allow5 = !!opts.json5;

  return {
    name: allow5 ? "json5" : "json",
    aliases: allow5 ? ["json5"] : ["json"],
    startState(): JsonState {
      return { expectKey: true, inBlockComment: false };
    },
    token(stream, state): TokenType | null {
      if (state.inBlockComment) {
        while (!stream.eol()) {
          if (stream.match("*/", true)) {
            state.inBlockComment = false;
            return "comment";
          }
          stream.next();
        }
        return "comment";
      }
      if (stream.eatSpace()) return null;

      if (allow5) {
        if (stream.match("//", true)) {
          stream.skipToEnd();
          return "comment";
        }
        if (stream.match("/*", true)) {
          state.inBlockComment = true;
          while (!stream.eol()) {
            if (stream.match("*/", true)) {
              state.inBlockComment = false;
              return "comment";
            }
            stream.next();
          }
          return "comment";
        }
      }

      const ch = stream.peek();
      if (!ch) return null;

      if (ch === '"' || (allow5 && ch === "'")) {
        const quote = stream.next();
        let escaped = false;
        while (!stream.eol()) {
          const c = stream.next();
          if (c === "\\" && !escaped) {
            escaped = true;
            continue;
          }
          if (c === quote && !escaped) break;
          escaped = false;
        }
        const wasKey = state.expectKey;
        state.expectKey = false;
        return wasKey ? "property" : "string";
      }

      if (/[-\d]/.test(ch)) {
        stream.match(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, true);
        state.expectKey = false;
        return "number";
      }

      if (/[A-Za-z_]/.test(ch)) {
        stream.eatWhile(/[A-Za-z0-9_$]/);
        const word = stream.current();
        if (LITERAL_KEYWORDS.has(word)) {
          state.expectKey = false;
          return "keyword";
        }
        if (allow5 && state.expectKey) {
          state.expectKey = false;
          return "property";
        }
        state.expectKey = false;
        return null;
      }

      stream.next();
      if (ch === "{" || ch === ",") state.expectKey = true;
      if (ch === ":") state.expectKey = false;
      if (ch === "[") state.expectKey = false;
      if (ch === "}" || ch === "]") state.expectKey = false;
      if (ch === "{" || ch === "}" || ch === "[" || ch === "]" || ch === "," || ch === ":") {
        return "punctuation";
      }
      return null;
    },
    lineComment: allow5 ? "//" : undefined,
    blockComment: allow5 ? { open: "/*", close: "*/" } : undefined,
    bracketPairs: [
      ["[", "]"],
      ["{", "}"],
    ],
    autoCloseMap: {
      "[": "]",
      "{": "}",
      "\"": "\"",
    },
  };
}
