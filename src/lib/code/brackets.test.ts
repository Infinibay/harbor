import { describe, it, expect } from "vitest";
import { matchBracket } from "./brackets";
import { TokenCache } from "./cache";
import { jsLang } from "./languages/javascript";

function setup(source: string) {
  const lines = source.split("\n");
  const lang = jsLang();
  const cache = new TokenCache(lang);
  const tokensForLine = (i: number) => cache.lineTokens(lines, i);
  return { lines, lang, tokensForLine };
}

describe("matchBracket", () => {
  it("matches `(` forward to `)`", () => {
    const { lines, lang, tokensForLine } = setup("fn(a, b)");
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 2 });
    expect(m?.from.col).toBe(2);
    expect(m?.to.col).toBe(7);
  });

  it("matches `}` backward to `{`", () => {
    const { lines, lang, tokensForLine } = setup("{ hi }");
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 5 });
    expect(m?.from.col).toBe(5);
    expect(m?.to.col).toBe(0);
  });

  it("skips brackets inside strings", () => {
    const { lines, lang, tokensForLine } = setup('("a)b")');
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 0 });
    // The first `(` should match the final `)`, not the one inside "a)b".
    expect(m?.to.col).toBe(6);
  });

  it("returns unmatched when no partner exists", () => {
    const { lines, lang, tokensForLine } = setup("(unbalanced");
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 0 });
    expect(m?.unmatched).toBe(true);
  });

  it("matches across line boundaries", () => {
    const { lines, lang, tokensForLine } = setup("fn(\n  a,\n)");
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 2 });
    expect(m?.to.line).toBe(2);
    expect(m?.to.col).toBe(0);
  });

  it("returns null for non-bracket positions", () => {
    const { lines, lang, tokensForLine } = setup("hello world");
    const m = matchBracket(lines, lang, tokensForLine, { line: 0, col: 3 });
    expect(m).toBeNull();
  });
});
