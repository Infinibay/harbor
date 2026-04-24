import { tokenizeLine } from "./highlight";
import type { Language, Token } from "./types";

/** Per-line incremental tokenization cache. Given a language and a
 *  source (split by `\n`), it memoizes both the parser state at the
 *  start of each line and the token list for that line. Editing a
 *  line invalidates entries for every subsequent line lazily — they
 *  get retokenized on the next `lineTokens(n)` call. */
export class TokenCache<State = unknown> {
  private states: (State | undefined)[] = [];
  private cached: (Token[] | undefined)[] = [];
  private tabSize: number;
  private language: Language<State>;

  constructor(language: Language<State>, tabSize = 2) {
    this.language = language;
    this.tabSize = tabSize;
    this.states[0] = language.startState();
  }

  setLanguage(language: Language<State>): void {
    if (language === this.language) return;
    this.language = language;
    this.states = [language.startState()];
    this.cached = [];
  }

  setTabSize(n: number): void {
    if (n === this.tabSize) return;
    this.tabSize = n;
    this.invalidateFrom(0);
  }

  /** Drop cached tokens/state from line `k` forward. Call this after
   *  any edit that touches line `k`. */
  invalidateFrom(k: number): void {
    const line = Math.max(0, k);
    if (line === 0) {
      this.states = [this.language.startState()];
      this.cached = [];
      return;
    }
    this.states.length = line;
    this.cached.length = line;
  }

  /** Token list for line `n` (0-based). Tokenizes lines `[0..n]` as
   *  needed to recover a valid start-state for `n`. */
  lineTokens(lines: readonly string[], n: number): Token[] {
    if (n < 0 || n >= lines.length) return [];
    const existing = this.cached[n];
    if (existing) return existing;

    let anchor = Math.min(this.states.length - 1, n);
    while (anchor > 0 && this.states[anchor] === undefined) anchor--;
    if (anchor < 0 || this.states[anchor] === undefined) {
      this.states[0] = this.language.startState();
      anchor = 0;
    }
    let state = this.states[anchor] as State;
    for (let i = anchor; i <= n; i++) {
      const { tokens, endState } = tokenizeLine(
        lines[i],
        this.language,
        state,
        this.tabSize,
      );
      this.cached[i] = tokens;
      this.states[i + 1] = endState;
      state = endState;
    }
    return this.cached[n] ?? [];
  }

  /** Pre-tokenize a range without forcing callers to iterate. Used
   *  for ahead-of-viewport warm-up. */
  prime(lines: readonly string[], from: number, to: number): void {
    for (let i = from; i <= to && i < lines.length; i++) {
      if (!this.cached[i]) this.lineTokens(lines, i);
    }
  }

  /** Dev helper — visible in tests to verify the cache did not
   *  re-tokenize untouched lines. */
  size(): number {
    return this.cached.filter(Boolean).length;
  }
}
