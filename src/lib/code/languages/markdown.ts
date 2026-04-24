import type { Language, StringStream, TokenType } from "../types";

interface MarkdownState {
  /** Inside a ```fenced code block```. Character tokenization is
   *  simplified — the fenced content is treated as `meta` text. */
  inFence: boolean;
  /** Fence marker (``` or ~~~) that opened the current block. */
  fenceMarker: string | null;
}

export function markdownLang(): Language<MarkdownState> {
  return {
    name: "markdown",
    aliases: ["md", "markdown"],
    startState(): MarkdownState {
      return { inFence: false, fenceMarker: null };
    },
    token(stream, state): TokenType | null {
      if (state.inFence) {
        if (stream.sol() && state.fenceMarker) {
          if (stream.match(state.fenceMarker, true)) {
            state.inFence = false;
            state.fenceMarker = null;
            stream.skipToEnd();
            return "meta";
          }
        }
        stream.skipToEnd();
        return "meta";
      }

      if (stream.sol()) {
        // Fenced code block opener
        const fence = stream.match(/^(```+|~~~+)/, true) as RegExpMatchArray | null;
        if (fence) {
          state.inFence = true;
          state.fenceMarker = fence[1];
          stream.skipToEnd();
          return "meta";
        }
        // Heading
        const head = stream.match(/^#{1,6}\s/, true);
        if (head) {
          stream.skipToEnd();
          return "heading";
        }
        // List marker
        if (stream.match(/^\s*([-*+]|\d+\.)\s/, true)) {
          return "punctuation";
        }
        // Blockquote
        if (stream.match(/^\s*>\s?/, true)) return "meta";
      }

      if (stream.eatSpace()) return null;

      const ch = stream.peek();
      if (!ch) return null;

      // Inline code
      if (ch === "`") {
        const count = runLen(stream, "`");
        readInlineCode(stream, count);
        return "meta";
      }

      // Bold **..**, __..__ or italic *..*, _.._
      if (ch === "*" || ch === "_") {
        const count = runLen(stream, ch);
        // Read until closing run of same length.
        readEmphasis(stream, ch, count);
        return count >= 2 ? "strong" : "emphasis";
      }

      // Link: [text](url)
      if (ch === "[") {
        stream.next();
        readUntil(stream, "]");
        stream.eat("]");
        if (stream.eat("(")) {
          readUntil(stream, ")");
          stream.eat(")");
        }
        return "link";
      }

      // Autolink <http://…>
      if (ch === "<") {
        const m = stream.match(/<(https?:\/\/[^>\s]+)>/, true);
        if (m) return "link";
      }

      // Plain run until the next special char.
      stream.eatWhile((c) => !"`*_[<".includes(c));
      return null;
    },
    lineComment: undefined,
    blockComment: undefined,
    bracketPairs: [
      ["[", "]"],
      ["(", ")"],
    ],
    autoCloseMap: {
      "(": ")",
      "[": "]",
      "\"": "\"",
      "'": "'",
    },
  };
}

function runLen(stream: StringStream, ch: string): number {
  let count = 0;
  while (stream.peek() === ch) {
    stream.next();
    count++;
  }
  return count;
}

function readInlineCode(stream: StringStream, openerLen: number): void {
  // Closes when we find a backtick run of the same length.
  while (!stream.eol()) {
    if (stream.peek() === "`") {
      const closerLen = runLen(stream, "`");
      if (closerLen === openerLen) return;
      continue;
    }
    stream.next();
  }
}

function readEmphasis(stream: StringStream, marker: string, openerLen: number): void {
  while (!stream.eol()) {
    if (stream.peek() === marker) {
      const closerLen = runLen(stream, marker);
      if (closerLen >= openerLen) return;
      continue;
    }
    stream.next();
  }
}

function readUntil(stream: StringStream, ch: string): void {
  while (!stream.eol()) {
    const c = stream.peek();
    if (c === ch) return;
    stream.next();
  }
}
