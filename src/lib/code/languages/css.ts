import type { Language, TokenType } from "../types";

interface CssState {
  inBlockComment: boolean;
  /** Depth of `{` blocks. Used to classify identifiers as selectors
   *  (depth 0) vs property keys (depth > 0). */
  braceDepth: number;
  /** True right after a `:` — the following tokens are values, not
   *  properties. Reset on `;` or `}`. */
  afterColon: boolean;
}

export function cssLang(): Language<CssState> {
  return {
    name: "css",
    aliases: ["css", "scss", "less"],
    startState(): CssState {
      return { inBlockComment: false, braceDepth: 0, afterColon: false };
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

      if (stream.match("//", true)) {
        // SCSS / LESS line comment — keep it permissive.
        stream.skipToEnd();
        return "comment";
      }

      const ch = stream.peek();
      if (!ch) return null;

      if (ch === '"' || ch === "'") {
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
        return "string";
      }

      if (ch === "@") {
        stream.next();
        stream.eatWhile(/[a-zA-Z-]/);
        return "keyword";
      }

      if (ch === "#") {
        stream.next();
        // Color literals `#abc123` or ID selector.
        if (/[0-9a-fA-F]/.test(stream.peek() ?? "")) {
          stream.eatWhile(/[0-9a-fA-F]/);
          return "number";
        }
        stream.eatWhile(/[a-zA-Z0-9_-]/);
        return "type";
      }

      if (ch === ".") {
        stream.next();
        if (/[a-zA-Z_-]/.test(stream.peek() ?? "")) {
          stream.eatWhile(/[a-zA-Z0-9_-]/);
          return "type";
        }
        return "punctuation";
      }

      if (/\d/.test(ch)) {
        stream.match(/\d+(\.\d+)?(px|em|rem|vh|vw|%|s|ms|deg)?/, true);
        return "number";
      }

      if (/[a-zA-Z_-]/.test(ch)) {
        stream.eatWhile(/[a-zA-Z0-9_-]/);
        // `property:` at top of a rule.
        const rest = stream.line.slice(stream.pos);
        if (state.braceDepth > 0 && !state.afterColon && /^\s*:/.test(rest)) {
          return "property";
        }
        if (state.afterColon) return "variable";
        return "tag";
      }

      if (ch === "{") {
        stream.next();
        state.braceDepth++;
        state.afterColon = false;
        return "punctuation";
      }
      if (ch === "}") {
        stream.next();
        state.braceDepth = Math.max(0, state.braceDepth - 1);
        state.afterColon = false;
        return "punctuation";
      }
      if (ch === ":") {
        stream.next();
        if (state.braceDepth > 0) state.afterColon = true;
        return "operator";
      }
      if (ch === ";") {
        stream.next();
        state.afterColon = false;
        return "punctuation";
      }

      stream.next();
      return "punctuation";
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
    },
  };
}
