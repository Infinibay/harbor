import type { Language, StringStream, TokenType } from "../types";

interface HtmlState {
  ctx: HtmlContext[];
  /** Name of the current tag — used to switch into `<script>` or
   *  `<style>` sub-modes without a nested Language reference (the
   *  raw text is just tokenized as `string`/`comment` until the
   *  closing tag). */
  openTag: string | null;
}

type HtmlContext =
  | { kind: "text" }
  | { kind: "tag"; closing: boolean }
  | { kind: "comment" }
  | { kind: "rawText"; terminator: string };

function readString(stream: StringStream, quote: string): void {
  while (!stream.eol()) {
    const ch = stream.next();
    if (ch === quote) return;
  }
}

export function htmlLang(): Language<HtmlState> {
  return {
    name: "html",
    aliases: ["html", "htm"],
    startState(): HtmlState {
      return { ctx: [{ kind: "text" }], openTag: null };
    },
    token(stream, state): TokenType | null {
      const top = state.ctx[state.ctx.length - 1];
      if (!top) {
        state.ctx.push({ kind: "text" });
        return null;
      }

      if (top.kind === "comment") {
        while (!stream.eol()) {
          if (stream.match("-->", true)) {
            state.ctx.pop();
            return "comment";
          }
          stream.next();
        }
        return "comment";
      }

      if (top.kind === "rawText") {
        const end = top.terminator;
        while (!stream.eol()) {
          if (stream.match(end, true, true)) {
            state.ctx.pop();
            state.ctx.push({ kind: "tag", closing: true });
            // Re-enter tag context to classify `</script>` parts.
            stream.backUp(end.length);
            return "string";
          }
          stream.next();
        }
        return "string";
      }

      if (top.kind === "tag") {
        stream.eatSpace();
        if (stream.pos > stream.start) return null;
        const ch = stream.peek();
        if (!ch) return null;
        if (ch === ">") {
          stream.next();
          const closing = top.closing;
          state.ctx.pop();
          if (!closing && (state.openTag === "script" || state.openTag === "style")) {
            const term = "</" + state.openTag;
            state.ctx.push({ kind: "rawText", terminator: term });
          } else {
            state.ctx.push({ kind: "text" });
            if (closing) state.openTag = null;
          }
          return "punctuation";
        }
        if (ch === "/") {
          stream.next();
          top.closing = true;
          return "punctuation";
        }
        if (ch === "=") {
          stream.next();
          return "operator";
        }
        if (ch === '"' || ch === "'") {
          stream.next();
          readString(stream, ch);
          return "string";
        }
        if (/[A-Za-z_]/.test(ch)) {
          stream.eatWhile(/[A-Za-z0-9_\-:]/);
          const word = stream.current().toLowerCase();
          // The first identifier after `<` is the tag name.
          if (state.openTag === null && !top.closing) {
            state.openTag = word;
            return "tag";
          }
          if (top.closing && state.openTag === null) {
            state.openTag = word;
            return "tag";
          }
          return "attribute";
        }
        stream.next();
        return null;
      }

      // text ctx
      if (stream.match("<!--", true)) {
        state.ctx.push({ kind: "comment" });
        while (!stream.eol()) {
          if (stream.match("-->", true)) {
            state.ctx.pop();
            return "comment";
          }
          stream.next();
        }
        return "comment";
      }
      if (stream.match("<!", true)) {
        // doctype
        stream.eatWhile((c) => c !== ">");
        stream.eat(">");
        return "meta";
      }
      if (stream.peek() === "<") {
        stream.next();
        state.ctx.push({ kind: "tag", closing: false });
        state.openTag = null;
        return "punctuation";
      }
      if (stream.peek() === "&") {
        stream.next();
        stream.eatWhile(/[a-zA-Z0-9#]/);
        stream.eat(";");
        return "escape";
      }
      stream.eatWhile((c) => c !== "<" && c !== "&");
      return null;
    },
    lineComment: undefined,
    blockComment: { open: "<!--", close: "-->" },
    bracketPairs: [["<", ">"]],
    autoCloseMap: {
      "\"": "\"",
      "'": "'",
      "(": ")",
      "[": "]",
      "{": "}",
    },
  };
}
