import { useCallback, useMemo, useRef, useState } from "react";
import { TokenCache } from "./cache";
import type { Diagnostic, Language, Token } from "./types";

export interface Selection {
  start: number;
  end: number;
}

export interface CodeEditorOptions<State = unknown> {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  language: Language<State>;
  tabSize?: number;
  insertSpaces?: boolean;
  readOnly?: boolean;
  diagnostics?: readonly Diagnostic[];
}

export interface CodeEditorInstance<State = unknown> {
  value: string;
  setValue: (next: string) => void;
  selection: Selection;
  setSelection: (next: Selection) => void;
  language: Language<State>;
  tabSize: number;
  insertSpaces: boolean;
  readOnly: boolean;
  diagnostics: readonly Diagnostic[];
  lines: readonly string[];
  lineCount: number;
  /** Token list for a given line, using the incremental cache. */
  tokensForLine: (line: number) => Token[];
  /** Warm the cache for a range of lines (pre-tokenize ahead of a
   *  viewport). */
  primeLines: (from: number, to: number) => void;
  /** Convert an absolute offset into (line, col) — both 0-based. */
  lineAt: (offset: number) => { line: number; col: number };
  /** Inverse of `lineAt`. */
  offsetAt: (line: number, col: number) => number;
  /** The textarea ref, provided so callers can attach programmatic
   *  focus / scroll handlers. */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Surface ref for scoping hotkeys. */
  surfaceRef: React.RefObject<HTMLDivElement | null>;
}

/** Headless state orchestrator for the CodeEditor. UI-free; the
 *  `<CodeEditor>` component is the default shell that consumes this. */
export function useCodeEditor<State = unknown>(
  opts: CodeEditorOptions<State>,
): CodeEditorInstance<State> {
  const {
    value: controlledValue,
    defaultValue = "",
    onChange,
    language,
    tabSize = 2,
    insertSpaces = true,
    readOnly = false,
    diagnostics = [],
  } = opts;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? (controlledValue as string) : internalValue;

  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  // Cache + invalidation must be synchronised DURING render: token
  // lookups happen in the same render that produces a new `lines`
  // array, so deferring invalidation to a useEffect would emit stale
  // tokens for one render — visible as a 1-character highlight lag
  // while typing.
  const cacheRef = useRef<TokenCache<State>>(null as unknown as TokenCache<State>);
  if (cacheRef.current === null || cacheRef.current === undefined) {
    cacheRef.current = new TokenCache(language, tabSize);
  } else {
    // Both setters early-out when the value matches, so this is cheap.
    cacheRef.current.setLanguage(language);
    cacheRef.current.setTabSize(tabSize);
  }

  const lines = useMemo(() => value.split("\n"), [value]);
  const lineCount = lines.length;

  // Invalidate from the first changed line synchronously, before any
  // `tokensForLine` call in this render reads the cache.
  const prevLinesRef = useRef<readonly string[] | null>(null);
  if (prevLinesRef.current !== lines) {
    const prev = prevLinesRef.current;
    if (prev) {
      let firstChange = 0;
      const minLen = Math.min(prev.length, lines.length);
      while (
        firstChange < minLen &&
        prev[firstChange] === lines[firstChange]
      ) {
        firstChange++;
      }
      cacheRef.current.invalidateFrom(firstChange);
    }
    prevLinesRef.current = lines;
  }

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const tokensForLine = useCallback(
    (line: number) => cacheRef.current.lineTokens(lines, line),
    [lines],
  );

  const primeLines = useCallback(
    (from: number, to: number) => cacheRef.current.prime(lines, from, to),
    [lines],
  );

  const lineOffsetsRef = useRef<number[] | null>(null);
  lineOffsetsRef.current = useMemo(() => {
    const offsets: number[] = [0];
    let acc = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      acc += lines[i].length + 1;
      offsets.push(acc);
    }
    return offsets;
  }, [lines]);

  const lineAt = useCallback(
    (offset: number) => {
      const offsets = lineOffsetsRef.current ?? [0];
      // binary search for greatest offsets[i] <= offset
      let lo = 0;
      let hi = offsets.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (offsets[mid] <= offset) lo = mid;
        else hi = mid - 1;
      }
      return { line: lo, col: offset - offsets[lo] };
    },
    [],
  );

  const offsetAt = useCallback(
    (line: number, col: number) => {
      const offsets = lineOffsetsRef.current ?? [0];
      const clampedLine = Math.max(0, Math.min(line, offsets.length - 1));
      const base = offsets[clampedLine];
      const maxCol = lines[clampedLine]?.length ?? 0;
      return base + Math.max(0, Math.min(col, maxCol));
    },
    [lines],
  );

  return {
    value,
    setValue,
    selection,
    setSelection,
    language,
    tabSize,
    insertSpaces,
    readOnly,
    diagnostics,
    lines,
    lineCount,
    tokensForLine,
    primeLines,
    lineAt,
    offsetAt,
    textareaRef,
    surfaceRef,
  };
}
