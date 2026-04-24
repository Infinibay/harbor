import type { Language, Token } from "./types";

export interface BracketMatch {
  /** Offset of the bracket at/adjacent to the caret. */
  from: { line: number; col: number; offset: number };
  /** Offset of its matching partner. */
  to: { line: number; col: number; offset: number };
  /** True when the partner was not found within the search window. */
  unmatched?: boolean;
}

/** Given (line, col) + access to lines and their tokens, find the
 *  matching bracket to the bracket at-or-before the caret. Tokens are
 *  consulted to skip brackets inside strings and comments. */
export function matchBracket(
  lines: readonly string[],
  language: Language,
  tokensForLine: (line: number) => Token[],
  caret: { line: number; col: number },
  maxScan = 10_000,
): BracketMatch | null {
  const pairs = language.bracketPairs ?? [
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ];
  const opens = new Map<string, string>();
  const closes = new Map<string, string>();
  for (const [o, c] of pairs) {
    opens.set(o, c);
    closes.set(c, o);
  }

  // Try char at caret, then char just before caret.
  const candidates: Array<{ ch: string; col: number }> = [];
  const line = lines[caret.line] ?? "";
  if (line[caret.col]) candidates.push({ ch: line[caret.col], col: caret.col });
  if (caret.col > 0 && line[caret.col - 1]) {
    candidates.push({ ch: line[caret.col - 1], col: caret.col - 1 });
  }

  for (const cand of candidates) {
    if (opens.has(cand.ch)) {
      const partner = opens.get(cand.ch) as string;
      const res = scanForward(
        lines,
        tokensForLine,
        caret.line,
        cand.col,
        cand.ch,
        partner,
        maxScan,
      );
      if (res) {
        return {
          from: offsetify(lines, caret.line, cand.col),
          to: res,
          unmatched: false,
        };
      }
      return {
        from: offsetify(lines, caret.line, cand.col),
        to: offsetify(lines, caret.line, cand.col),
        unmatched: true,
      };
    }
    if (closes.has(cand.ch)) {
      const partner = closes.get(cand.ch) as string;
      const res = scanBackward(
        lines,
        tokensForLine,
        caret.line,
        cand.col,
        cand.ch,
        partner,
        maxScan,
      );
      if (res) {
        return {
          from: offsetify(lines, caret.line, cand.col),
          to: res,
          unmatched: false,
        };
      }
      return {
        from: offsetify(lines, caret.line, cand.col),
        to: offsetify(lines, caret.line, cand.col),
        unmatched: true,
      };
    }
  }
  return null;
}

function scanForward(
  lines: readonly string[],
  tokensForLine: (line: number) => Token[],
  startLine: number,
  startCol: number,
  open: string,
  close: string,
  maxScan: number,
): { line: number; col: number; offset: number } | null {
  let depth = 1;
  let scanned = 0;
  for (let ln = startLine; ln < lines.length; ln++) {
    const line = lines[ln];
    const tokens = tokensForLine(ln);
    const fromCol = ln === startLine ? startCol + 1 : 0;
    for (let col = fromCol; col < line.length; col++) {
      if (++scanned > maxScan) return null;
      if (isSkippedAt(tokens, col)) continue;
      const ch = line[col];
      if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) return offsetify(lines, ln, col);
      }
    }
  }
  return null;
}

function scanBackward(
  lines: readonly string[],
  tokensForLine: (line: number) => Token[],
  startLine: number,
  startCol: number,
  close: string,
  open: string,
  maxScan: number,
): { line: number; col: number; offset: number } | null {
  let depth = 1;
  let scanned = 0;
  for (let ln = startLine; ln >= 0; ln--) {
    const line = lines[ln];
    const tokens = tokensForLine(ln);
    const fromCol = ln === startLine ? startCol - 1 : line.length - 1;
    for (let col = fromCol; col >= 0; col--) {
      if (++scanned > maxScan) return null;
      if (isSkippedAt(tokens, col)) continue;
      const ch = line[col];
      if (ch === close) depth++;
      else if (ch === open) {
        depth--;
        if (depth === 0) return offsetify(lines, ln, col);
      }
    }
  }
  return null;
}

function isSkippedAt(tokens: readonly Token[], col: number): boolean {
  for (const t of tokens) {
    if (col >= t.from && col < t.to) {
      return t.type === "string" || t.type === "comment" || t.type === "regex";
    }
  }
  return false;
}

function offsetify(
  lines: readonly string[],
  line: number,
  col: number,
): { line: number; col: number; offset: number } {
  let offset = col;
  for (let i = 0; i < line; i++) offset += lines[i].length + 1;
  return { line, col, offset };
}
