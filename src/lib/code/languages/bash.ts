import type { Language, TokenType } from "../types";

const BASH_KEYWORDS = new Set([
  "if", "then", "else", "elif", "fi", "for", "while", "do", "done",
  "case", "esac", "in", "function", "return", "break", "continue",
  "exit", "local", "export", "readonly", "declare", "let", "trap",
  "source", "echo", "true", "false",
]);

interface BashState {
  /** Inside a heredoc body? If so, content until the terminator is a
   *  single `string` block. We don't track terminator name precisely
   *  — any standalone line matching the opener terminates. */
  heredoc: string | null;
}

export function bashLang(): Language<BashState> {
  return {
    name: "bash",
    aliases: ["bash", "sh", "shell", "zsh"],
    startState(): BashState {
      return { heredoc: null };
    },
    token(stream, state): TokenType | null {
      if (state.heredoc !== null) {
        if (stream.sol() && stream.match(state.heredoc, true)) {
          state.heredoc = null;
          return "meta";
        }
        stream.skipToEnd();
        return "string";
      }

      if (stream.eatSpace()) return null;

      const ch = stream.peek();
      if (!ch) return null;

      if (ch === "#") {
        stream.skipToEnd();
        return "comment";
      }

      if (ch === '"' || ch === "'") {
        const quote = stream.next();
        while (!stream.eol()) {
          const c = stream.next();
          if (c === "\\") {
            stream.next();
            continue;
          }
          if (c === quote) break;
        }
        return "string";
      }

      // Variable reference
      if (ch === "$") {
        stream.next();
        if (stream.eat("{")) {
          while (!stream.eol() && stream.next() !== "}") {
            /* consume */
          }
          return "variable";
        }
        stream.eatWhile(/[A-Za-z0-9_]/);
        return "variable";
      }

      // Heredoc marker `<<EOF` or `<<-EOF`
      if (stream.match(/<<-?\s*'?([A-Za-z_][A-Za-z0-9_]*)'?/, true)) {
        const m = stream.current().match(/<<-?\s*'?([A-Za-z_][A-Za-z0-9_]*)'?/);
        if (m) state.heredoc = m[1];
        return "operator";
      }

      if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        return "number";
      }

      if (/[A-Za-z_]/.test(ch)) {
        stream.eatWhile(/[A-Za-z0-9_\-.]/);
        const word = stream.current();
        if (BASH_KEYWORDS.has(word)) return "keyword";
        // Heuristic: first identifier on a line with following args is a command.
        if (/^\s*$/.test(stream.line.slice(0, stream.start))) return "function";
        return "variable";
      }

      if (/[|&;<>=!]/.test(ch)) {
        stream.next();
        stream.eatWhile(/[|&;<>=!]/);
        return "operator";
      }

      stream.next();
      return "punctuation";
    },
    lineComment: "#",
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
