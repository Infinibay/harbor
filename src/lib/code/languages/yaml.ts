import type { Language, TokenType } from "../types";

interface YamlState {
  /** Current line is a value continuation (we saw `:` earlier). */
  inValue: boolean;
  /** Indentation level of the current block scalar (`|`, `>`). */
  blockScalarIndent: number | null;
}

export function yamlLang(): Language<YamlState> {
  return {
    name: "yaml",
    aliases: ["yaml", "yml"],
    startState(): YamlState {
      return { inValue: false, blockScalarIndent: null };
    },
    token(stream, state): TokenType | null {
      if (stream.sol()) {
        state.inValue = false;
        if (state.blockScalarIndent !== null) {
          const indent = stream.indentation();
          if (stream.eol() || indent > state.blockScalarIndent) {
            stream.skipToEnd();
            return "string";
          }
          state.blockScalarIndent = null;
        }
      }

      if (stream.eatSpace()) return null;

      const ch = stream.peek();
      if (!ch) return null;

      if (ch === "#") {
        stream.skipToEnd();
        return "comment";
      }

      if (ch === "-" && /\s/.test(stream.line.charAt(stream.pos + 1) ?? "")) {
        stream.next();
        return "punctuation";
      }

      if (!state.inValue && /[A-Za-z0-9_]/.test(ch)) {
        const saved = stream.pos;
        stream.eatWhile(/[A-Za-z0-9_.\-]/);
        if (stream.peek() === ":") {
          return "property";
        }
        // Roll back — that identifier was actually part of a value.
        stream.pos = saved;
      }

      if (ch === ":") {
        stream.next();
        state.inValue = true;
        return "operator";
      }

      if (ch === '"' || ch === "'") {
        const quote = stream.next();
        while (!stream.eol() && stream.next() !== quote) {
          /* consume */
        }
        return "string";
      }

      if (ch === "|" || ch === ">") {
        stream.next();
        state.blockScalarIndent = stream.indentation();
        stream.skipToEnd();
        return "operator";
      }

      if (ch === "&" || ch === "*") {
        stream.next();
        stream.eatWhile(/[A-Za-z0-9_]/);
        return "meta";
      }

      if (/\d/.test(ch)) {
        stream.eatWhile(/[\d.]/);
        return "number";
      }

      if (state.inValue) {
        stream.eatWhile((c) => c !== "#" && c !== "\n");
        return "string";
      }

      stream.next();
      return "punctuation";
    },
    lineComment: "#",
    bracketPairs: [
      ["[", "]"],
      ["{", "}"],
    ],
    autoCloseMap: {
      "\"": "\"",
      "'": "'",
      "[": "]",
      "{": "}",
    },
  };
}
