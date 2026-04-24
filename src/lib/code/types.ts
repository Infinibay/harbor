/** Token types emitted by `Language.token()`. Named after common editor
 *  conventions (VS Code / CodeMirror / TextMate) so consumers with prior
 *  context find the familiar bucket. `null` signals "no classification"
 *  (usually whitespace or a run of plain text). */
export type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "punctuation"
  | "identifier"
  | "type"
  | "function"
  | "variable"
  | "property"
  | "attribute"
  | "tag"
  | "regex"
  | "escape"
  | "heading"
  | "link"
  | "emphasis"
  | "strong"
  | "meta"
  | "error";

/** Reader abstraction over a single source line. A language's `token()`
 *  consumes characters via these methods and returns a classification.
 *  Position + start are reset by the tokenizer between calls; languages
 *  only read. The shape intentionally mirrors CodeMirror 5's interface
 *  — decades of language modes already use this vocabulary. */
export interface StringStream {
  readonly line: string;
  pos: number;
  start: number;
  sol(): boolean;
  eol(): boolean;
  peek(): string | undefined;
  next(): string | undefined;
  eat(
    match: string | RegExp | ((ch: string) => boolean),
  ): string | undefined;
  eatWhile(match: string | RegExp | ((ch: string) => boolean)): boolean;
  eatSpace(): boolean;
  match(
    pattern: string | RegExp,
    consume?: boolean,
    caseInsensitive?: boolean,
  ): boolean | RegExpMatchArray | null;
  skipTo(ch: string): boolean;
  skipToEnd(): void;
  current(): string;
  column(): number;
  indentation(): number;
  backUp(n: number): void;
}

/** A `Language<State>` is a stream tokenizer + a small amount of
 *  metadata for editor features (comments, brackets, auto-close). */
export interface Language<State = unknown> {
  readonly name: string;
  readonly aliases?: readonly string[];
  startState(): State;
  /** Reads zero-or-more characters from the stream and returns its
   *  classification. Must advance the stream on every call (otherwise
   *  the runner throws to prevent infinite loops). */
  token(stream: StringStream, state: State): TokenType | null;
  /** Deep copy of state, used by incremental caching. Default is
   *  `structuredClone` which handles the common shapes. */
  copyState?(state: State): State;
  /** Suggested indent (in columns) for the line following `state`. */
  indent?(state: State, textAfter: string): number | null;
  readonly lineComment?: string;
  readonly blockComment?: { open: string; close: string };
  readonly bracketPairs?: readonly (readonly [string, string])[];
  readonly autoCloseMap?: Readonly<Record<string, string>>;
  readonly electricInput?: RegExp;
}

export interface Token {
  /** Start column in the source line. */
  from: number;
  /** End column in the source line (exclusive). */
  to: number;
  type: TokenType | null;
  text: string;
}

export interface Diagnostic {
  /** 1-based line number. */
  line: number;
  /** 1-based column. Optional — omit for line-level messages. */
  column?: number;
  /** 1-based end line. Defaults to `line`. */
  endLine?: number;
  /** 1-based end column. Defaults to line length. */
  endColumn?: number;
  severity: "error" | "warning" | "info" | "hint";
  message: string;
  /** Origin of the diagnostic (e.g. `"typescript"`, `"eslint"`). */
  source?: string;
}
