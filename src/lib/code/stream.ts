import type { StringStream } from "./types";

/** Concrete `StringStream` for a single line. Designed to be reused
 *  across tokenization calls within a line — language modes advance
 *  `pos`; the runner resets `start = pos` between tokens. */
export class Stream implements StringStream {
  readonly line: string;
  pos = 0;
  start = 0;
  private tabSize: number;

  constructor(line: string, tabSize = 2) {
    this.line = line;
    this.tabSize = tabSize;
  }

  sol(): boolean {
    return this.pos === 0;
  }

  eol(): boolean {
    return this.pos >= this.line.length;
  }

  peek(): string | undefined {
    return this.line.charAt(this.pos) || undefined;
  }

  next(): string | undefined {
    if (this.eol()) return undefined;
    return this.line.charAt(this.pos++);
  }

  eat(
    match: string | RegExp | ((ch: string) => boolean),
  ): string | undefined {
    const ch = this.line.charAt(this.pos);
    if (!ch) return undefined;
    const ok =
      typeof match === "string"
        ? ch === match
        : match instanceof RegExp
        ? match.test(ch)
        : match(ch);
    if (ok) {
      this.pos++;
      return ch;
    }
    return undefined;
  }

  eatWhile(match: string | RegExp | ((ch: string) => boolean)): boolean {
    const before = this.pos;
    while (!this.eol() && this.eat(match)) {
      /* advance */
    }
    return this.pos > before;
  }

  eatSpace(): boolean {
    return this.eatWhile(/[\s ]/);
  }

  match(
    pattern: string | RegExp,
    consume = true,
    caseInsensitive = false,
  ): boolean | RegExpMatchArray | null {
    if (typeof pattern === "string") {
      const slice = this.line.substr(this.pos, pattern.length);
      const hit = caseInsensitive
        ? slice.toLowerCase() === pattern.toLowerCase()
        : slice === pattern;
      if (hit && consume) this.pos += pattern.length;
      return hit;
    }
    const src = this.line.slice(this.pos);
    const flags = caseInsensitive
      ? pattern.flags.replace(/i?/, "i")
      : pattern.flags;
    const anchored = new RegExp(
      pattern.source.startsWith("^") ? pattern.source : "^(?:" + pattern.source + ")",
      flags,
    );
    const m = src.match(anchored);
    if (!m) return null;
    if (consume) this.pos += m[0].length;
    return m;
  }

  skipTo(ch: string): boolean {
    const found = this.line.indexOf(ch, this.pos);
    if (found === -1) return false;
    this.pos = found;
    return true;
  }

  skipToEnd(): void {
    this.pos = this.line.length;
  }

  current(): string {
    return this.line.slice(this.start, this.pos);
  }

  column(): number {
    return countColumns(this.line, this.start, this.tabSize);
  }

  indentation(): number {
    let col = 0;
    for (let i = 0; i < this.line.length; i++) {
      const ch = this.line.charAt(i);
      if (ch === " ") col++;
      else if (ch === "\t") col += this.tabSize - (col % this.tabSize);
      else break;
    }
    return col;
  }

  backUp(n: number): void {
    this.pos -= n;
  }

  /** Reset the stream to just-after-consuming for the next token. */
  resetStart(): void {
    this.start = this.pos;
  }
}

function countColumns(line: string, upTo: number, tabSize: number): number {
  let col = 0;
  for (let i = 0; i < upTo; i++) {
    col += line.charAt(i) === "\t" ? tabSize - (col % tabSize) : 1;
  }
  return col;
}
