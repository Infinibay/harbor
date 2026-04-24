import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { useCodeEditor, type Selection } from "../../lib/code/useCodeEditor";
import { matchBracket, type BracketMatch } from "../../lib/code/brackets";
import type { Diagnostic, Language, Token } from "../../lib/code/types";
import { useT } from "../../lib/i18n";

export interface CodeEditorProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange" | "readOnly"
  > {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  language: Language<unknown>;
  /** Required for screen readers — textareas without a label or
   *  aria-label are flagged by axe. */
  ariaLabel?: string;
  tabSize?: number;
  insertSpaces?: boolean;
  autoIndent?: boolean;
  autoClose?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  showLineNumbers?: boolean;
  diagnostics?: readonly Diagnostic[];
  className?: string;
}

const FONT_SIZE = 13;
const LINE_HEIGHT = 20;
const PADDING_X = 12;
const PADDING_Y = 10;
const GUTTER_PADDING_X = 10;

/** Monospace code editor built on a transparent `<textarea>` layered
 *  over a syntax-highlighted `<pre>`. Native textarea under the hood
 *  means IME, paste, undo/redo, spellcheck and OS-level selection all
 *  work without custom logic. */
export function CodeEditor({
  value,
  defaultValue,
  onChange,
  language,
  ariaLabel,
  tabSize = 2,
  insertSpaces = true,
  autoIndent = true,
  autoClose = true,
  readOnly = false,
  placeholder,
  height,
  minHeight = 180,
  maxHeight,
  showLineNumbers = true,
  diagnostics = [],
  className,
  onKeyDown: onKeyDownProp,
  spellCheck = false,
  ...rest
}: CodeEditorProps) {
  const autoId = useId();
  const diagnosticsListId = `${autoId}-diagnostics`;
  const { t } = useT();
  const editor = useCodeEditor({
    value,
    defaultValue,
    onChange,
    language,
    tabSize,
    insertSpaces,
    readOnly,
    diagnostics,
  });

  const textareaRef = editor.textareaRef;
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const composingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Programmatic value updates — keep textarea in sync when caller
  // controls `value`. React does this for us but we also propagate
  // selection state after inserts so the caret lands where we set it.
  const pendingSelectionRef = useRef<Selection | null>(null);
  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (pendingSelectionRef.current) {
      const { start, end } = pendingSelectionRef.current;
      ta.setSelectionRange(start, end);
      pendingSelectionRef.current = null;
    }
  }, [editor.value, textareaRef]);

  const readSelection = useCallback((): Selection => {
    const ta = textareaRef.current;
    if (!ta) return { start: 0, end: 0 };
    return { start: ta.selectionStart ?? 0, end: ta.selectionEnd ?? 0 };
  }, [textareaRef]);

  const replaceRange = useCallback(
    (from: number, to: number, text: string, nextSel?: Selection) => {
      const v = editor.value;
      const next = v.slice(0, from) + text + v.slice(to);
      if (nextSel) pendingSelectionRef.current = nextSel;
      editor.setValue(next);
    },
    [editor],
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      editor.setValue(e.target.value);
    },
    [editor],
  );

  const indentText = useMemo(
    () => (insertSpaces ? " ".repeat(tabSize) : "\t"),
    [insertSpaces, tabSize],
  );

  const indentSize = insertSpaces ? tabSize : 1;

  const extractLineRange = useCallback(
    (start: number, end: number) => {
      const v = editor.value;
      const lineStart = v.lastIndexOf("\n", start - 1) + 1;
      let lineEnd = v.indexOf("\n", end);
      if (lineEnd === -1) lineEnd = v.length;
      return { lineStart, lineEnd };
    },
    [editor.value],
  );

  const handleTab = useCallback(
    (shift: boolean): boolean => {
      if (readOnly) return false;
      const { start, end } = readSelection();
      if (start === end) {
        if (shift) {
          // dedent current line — strip leading whitespace from lineStart,
          // regardless of where the caret is on the line
          const { lineStart } = extractLineRange(start, end);
          const leading = editor.value.slice(lineStart);
          let removed = 0;
          while (
            removed < indentSize &&
            leading[removed] === (insertSpaces ? " " : "\t")
          ) {
            removed++;
          }
          if (removed === 0) return true;
          const nextCaret = Math.max(lineStart, start - removed);
          replaceRange(lineStart, lineStart + removed, "", {
            start: nextCaret,
            end: nextCaret,
          });
          return true;
        }
        replaceRange(start, end, indentText, {
          start: start + indentText.length,
          end: start + indentText.length,
        });
        return true;
      }
      // multi-line indent / dedent
      const { lineStart, lineEnd } = extractLineRange(start, end);
      const block = editor.value.slice(lineStart, lineEnd);
      const out = shift
        ? block
            .split("\n")
            .map((ln) => {
              let r = 0;
              while (r < indentSize && ln[r] === (insertSpaces ? " " : "\t")) r++;
              return ln.slice(r);
            })
            .join("\n")
        : block
            .split("\n")
            .map((ln) => indentText + ln)
            .join("\n");
      const delta = out.length - block.length;
      replaceRange(lineStart, lineEnd, out, {
        start: Math.max(lineStart, start + (shift ? -indentText.length : indentText.length)),
        end: end + delta,
      });
      return true;
    },
    [
      extractLineRange,
      editor.value,
      indentText,
      indentSize,
      insertSpaces,
      readOnly,
      readSelection,
      replaceRange,
    ],
  );

  const currentLineIndent = useCallback(
    (offset: number): string => {
      const v = editor.value;
      const lineStart = v.lastIndexOf("\n", offset - 1) + 1;
      const m = v.slice(lineStart).match(/^[\t ]*/);
      return m ? m[0] : "";
    },
    [editor.value],
  );

  const handleEnter = useCallback((): boolean => {
    if (!autoIndent || readOnly) return false;
    const { start, end } = readSelection();
    const indent = currentLineIndent(start);
    const prevChar = editor.value.charAt(start - 1);
    const nextChar = editor.value.charAt(end);
    const opens = prevChar.length === 1 && "{([".includes(prevChar);
    const closes = nextChar.length === 1 && "})]".includes(nextChar);
    if (opens && closes) {
      const insert = "\n" + indent + indentText + "\n" + indent;
      const caret = start + 1 + indent.length + indentText.length;
      replaceRange(start, end, insert, { start: caret, end: caret });
      return true;
    }
    if (opens || prevChar === ":" || prevChar === ",") {
      const insert = "\n" + indent + indentText;
      const caret = start + insert.length;
      replaceRange(start, end, insert, { start: caret, end: caret });
      return true;
    }
    const insert = "\n" + indent;
    const caret = start + insert.length;
    replaceRange(start, end, insert, { start: caret, end: caret });
    return true;
  }, [
    autoIndent,
    currentLineIndent,
    editor.value,
    indentText,
    readOnly,
    readSelection,
    replaceRange,
  ]);

  const handleAutoClose = useCallback(
    (open: string): boolean => {
      if (!autoClose || readOnly) return false;
      const close = editor.language.autoCloseMap?.[open];
      if (!close) return false;
      const { start, end } = readSelection();
      if (start !== end) {
        const selected = editor.value.slice(start, end);
        replaceRange(start, end, open + selected + close, {
          start: start + 1,
          end: end + 1,
        });
        return true;
      }
      replaceRange(start, end, open + close, {
        start: start + 1,
        end: start + 1,
      });
      return true;
    },
    [autoClose, editor.language, editor.value, readOnly, readSelection, replaceRange],
  );

  const handleSkipOver = useCallback(
    (ch: string): boolean => {
      if (!autoClose || readOnly) return false;
      const { start, end } = readSelection();
      if (start !== end) return false;
      if (editor.value.charAt(start) !== ch) return false;
      // only skip for actual close characters we might have inserted
      if (!/[)\]}"'`]/.test(ch)) return false;
      pendingSelectionRef.current = { start: start + 1, end: start + 1 };
      editor.setValue(editor.value); // no-op content change, triggers effect
      // Setting the selection manually — direct setSelectionRange avoids
      // flushing the pending selection through the React state roundtrip.
      const ta = textareaRef.current;
      if (ta) ta.setSelectionRange(start + 1, start + 1);
      pendingSelectionRef.current = null;
      return true;
    },
    [autoClose, editor, readOnly, readSelection, textareaRef],
  );

  const handleToggleLineComment = useCallback((): boolean => {
    if (readOnly) return false;
    const marker = editor.language.lineComment;
    if (!marker) return false;
    const { start, end } = readSelection();
    const { lineStart, lineEnd } = extractLineRange(start, end);
    const block = editor.value.slice(lineStart, lineEnd);
    const blockLines = block.split("\n");
    // Toggle logic: if every non-empty line starts with the marker, strip
    // it; otherwise prepend it at the minimum indentation level.
    const nonEmpty = blockLines.filter((ln) => ln.trim().length > 0);
    const allCommented =
      nonEmpty.length > 0 &&
      nonEmpty.every((ln) => ln.trimStart().startsWith(marker));
    let out: string;
    if (allCommented) {
      out = blockLines
        .map((ln) => {
          const idx = ln.indexOf(marker);
          if (idx === -1) return ln;
          const after = ln.slice(idx + marker.length);
          // Strip a single space that we might have inserted.
          return ln.slice(0, idx) + (after.startsWith(" ") ? after.slice(1) : after);
        })
        .join("\n");
    } else {
      const minIndent = nonEmpty.reduce((acc, ln) => {
        const m = ln.match(/^[\t ]*/);
        return Math.min(acc, m ? m[0].length : 0);
      }, Infinity);
      const pad = Number.isFinite(minIndent) ? minIndent : 0;
      out = blockLines
        .map((ln) =>
          ln.trim().length === 0
            ? ln
            : ln.slice(0, pad) + marker + " " + ln.slice(pad),
        )
        .join("\n");
    }
    const delta = out.length - block.length;
    replaceRange(lineStart, lineEnd, out, {
      start,
      end: end + delta,
    });
    return true;
  }, [
    editor.language,
    editor.value,
    extractLineRange,
    readOnly,
    readSelection,
    replaceRange,
  ]);

  const handleMoveLines = useCallback(
    (direction: "up" | "down"): boolean => {
      if (readOnly) return false;
      const { start, end } = readSelection();
      const { lineStart, lineEnd } = extractLineRange(start, end);
      const v = editor.value;
      if (direction === "up") {
        if (lineStart === 0) return true;
        const prevStart = v.lastIndexOf("\n", lineStart - 2) + 1;
        const prevLine = v.slice(prevStart, lineStart); // includes trailing \n
        const block = v.slice(lineStart, lineEnd);
        const suffix = lineEnd < v.length && v.charAt(lineEnd) === "\n" ? "\n" : "";
        const next =
          v.slice(0, prevStart) +
          block +
          (suffix || "\n") +
          prevLine.replace(/\n$/, "") +
          v.slice(lineEnd + suffix.length);
        const shift = -(prevLine.length);
        pendingSelectionRef.current = {
          start: start + shift,
          end: end + shift,
        };
        editor.setValue(next);
        return true;
      }
      // down
      if (lineEnd >= v.length) return true;
      const nextEnd = v.indexOf("\n", lineEnd + 1);
      const nextLineEnd = nextEnd === -1 ? v.length : nextEnd;
      const nextLine = v.slice(lineEnd + 1, nextLineEnd);
      const block = v.slice(lineStart, lineEnd);
      const out =
        v.slice(0, lineStart) +
        nextLine +
        "\n" +
        block +
        v.slice(nextLineEnd);
      const shift = nextLine.length + 1;
      pendingSelectionRef.current = {
        start: start + shift,
        end: end + shift,
      };
      editor.setValue(out);
      return true;
    },
    [editor, extractLineRange, readOnly, readSelection],
  );

  const handleDuplicateLines = useCallback(
    (direction: "up" | "down"): boolean => {
      if (readOnly) return false;
      const { start, end } = readSelection();
      const { lineStart, lineEnd } = extractLineRange(start, end);
      const block = editor.value.slice(lineStart, lineEnd);
      const insert = block + "\n";
      const at = direction === "down" ? lineEnd + 1 : lineStart;
      // When duplicating down, block already has no trailing newline;
      // we insert after lineEnd+1 but need to avoid missing newline at
      // file end.
      const target = direction === "down" ? lineEnd : lineStart;
      const v = editor.value;
      const sep = direction === "down" ? "\n" : "";
      const out =
        v.slice(0, target) +
        sep +
        block +
        (direction === "up" ? "\n" : "") +
        v.slice(target);
      const shift =
        direction === "down" ? insert.length : 0;
      pendingSelectionRef.current = {
        start: start + shift + (direction === "up" ? 0 : 0),
        end: end + shift + (direction === "up" ? 0 : 0),
      };
      void at;
      editor.setValue(out);
      return true;
    },
    [editor, extractLineRange, readOnly, readSelection],
  );

  const handleDeleteLine = useCallback((): boolean => {
    if (readOnly) return false;
    const { start, end } = readSelection();
    const { lineStart, lineEnd } = extractLineRange(start, end);
    const v = editor.value;
    const hasTrailing = lineEnd < v.length && v.charAt(lineEnd) === "\n";
    const cut = hasTrailing ? lineEnd + 1 : lineEnd;
    const nextStart =
      lineStart >= v.length - (cut - lineStart)
        ? Math.max(0, v.lastIndexOf("\n", lineStart - 1) + 1)
        : lineStart;
    replaceRange(lineStart, cut, "", { start: nextStart, end: nextStart });
    return true;
  }, [editor.value, extractLineRange, readOnly, readSelection, replaceRange]);

  const handleSelectLine = useCallback((): boolean => {
    const ta = textareaRef.current;
    if (!ta) return false;
    const { start, end } = readSelection();
    const v = editor.value;
    const lineStart = v.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = v.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = v.length;
    // Include the trailing newline on subsequent presses so repeated
    // Ctrl+L extends by one line.
    const extendedEnd =
      start !== end && end === lineEnd
        ? Math.min(v.length, v.indexOf("\n", end + 1) === -1 ? v.length : v.indexOf("\n", end + 1))
        : lineEnd;
    ta.setSelectionRange(lineStart, extendedEnd);
    return true;
  }, [editor.value, readSelection, textareaRef]);

  const selectNextAnchorRef = useRef<{ word: string } | null>(null);

  interface FindState {
    open: boolean;
    withReplace: boolean;
    query: string;
    replace: string;
    caseSensitive: boolean;
    wholeWord: boolean;
    regex: boolean;
  }
  const [find, setFind] = useState<FindState>({
    open: false,
    withReplace: false,
    query: "",
    replace: "",
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });

  const findMatches = useMemo((): Array<{ from: number; to: number }> => {
    if (!find.open || !find.query) return [];
    const v = editor.value;
    const out: Array<{ from: number; to: number }> = [];
    let pattern: RegExp;
    try {
      const flags = find.caseSensitive ? "g" : "gi";
      const src = find.regex
        ? find.query
        : escapeRegex(find.query);
      const wrapped = find.wholeWord ? `\\b(?:${src})\\b` : src;
      pattern = new RegExp(wrapped, flags);
    } catch {
      return [];
    }
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(v)) !== null) {
      if (m.index === pattern.lastIndex) pattern.lastIndex++;
      out.push({ from: m.index, to: m.index + m[0].length });
      if (out.length >= 10_000) break;
    }
    return out;
  }, [find.open, find.query, find.caseSensitive, find.wholeWord, find.regex, editor.value]);

  const [findIndex, setFindIndex] = useState(0);

  const openFind = useCallback((withReplace = false) => {
    setFind((s) => ({ ...s, open: true, withReplace }));
  }, []);
  const closeFind = useCallback(() => {
    setFind((s) => ({ ...s, open: false }));
    textareaRef.current?.focus();
  }, [textareaRef]);

  const findNext = useCallback(
    (delta: 1 | -1) => {
      if (findMatches.length === 0) return;
      const idx = (findIndex + delta + findMatches.length) % findMatches.length;
      setFindIndex(idx);
      const m = findMatches[idx];
      const ta = textareaRef.current;
      if (ta) {
        ta.setSelectionRange(m.from, m.to);
        // Scroll the match into view
        const { line } = editor.lineAt(m.from);
        const y = line * LINE_HEIGHT;
        if (scrollRef.current) {
          if (y < scrollRef.current.scrollTop) {
            scrollRef.current.scrollTop = y - LINE_HEIGHT * 2;
          } else if (
            y >
            scrollRef.current.scrollTop + scrollRef.current.clientHeight - LINE_HEIGHT
          ) {
            scrollRef.current.scrollTop =
              y - scrollRef.current.clientHeight + LINE_HEIGHT * 3;
          }
        }
      }
    },
    [editor, findIndex, findMatches, textareaRef],
  );

  const replaceCurrent = useCallback(() => {
    if (readOnly || findMatches.length === 0) return;
    const m = findMatches[Math.min(findIndex, findMatches.length - 1)];
    if (!m) return;
    const next =
      editor.value.slice(0, m.from) +
      find.replace +
      editor.value.slice(m.to);
    pendingSelectionRef.current = {
      start: m.from + find.replace.length,
      end: m.from + find.replace.length,
    };
    editor.setValue(next);
  }, [editor, find.replace, findIndex, findMatches, readOnly]);

  const replaceAll = useCallback(() => {
    if (readOnly || findMatches.length === 0) return;
    let out = "";
    let cursor = 0;
    for (const m of findMatches) {
      out += editor.value.slice(cursor, m.from) + find.replace;
      cursor = m.to;
    }
    out += editor.value.slice(cursor);
    editor.setValue(out);
  }, [editor, find.replace, findMatches, readOnly]);

  const handleSelectNextMatch = useCallback((): boolean => {
    const ta = textareaRef.current;
    if (!ta) return false;
    const { start, end } = readSelection();
    const v = editor.value;
    // First press: select the word under the caret.
    if (start === end) {
      const before = v.slice(0, start).match(/[A-Za-z0-9_$]*$/)?.[0] ?? "";
      const after = v.slice(start).match(/^[A-Za-z0-9_$]*/)?.[0] ?? "";
      const word = before + after;
      if (!word) return true;
      const wStart = start - before.length;
      const wEnd = start + after.length;
      ta.setSelectionRange(wStart, wEnd);
      selectNextAnchorRef.current = { word };
      return true;
    }
    // Subsequent presses: find the next occurrence after current end.
    const word = v.slice(start, end);
    if (!word) return true;
    selectNextAnchorRef.current = { word };
    const idx = v.indexOf(word, end);
    if (idx !== -1) {
      ta.setSelectionRange(idx, idx + word.length);
      return true;
    }
    // Wrap around
    const wrap = v.indexOf(word);
    if (wrap !== -1 && wrap !== start) {
      ta.setSelectionRange(wrap, wrap + word.length);
    }
    return true;
  }, [editor.value, readSelection, textareaRef]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented) return;
      if (composingRef.current) return;

      const mod = e.ctrlKey || e.metaKey;

      if (e.key === "Tab") {
        if (handleTab(e.shiftKey)) e.preventDefault();
        return;
      }
      if (e.key === "Enter") {
        if (handleEnter()) e.preventDefault();
        return;
      }
      if (mod && (e.key === "d" || e.key === "D")) {
        if (handleSelectNextMatch()) e.preventDefault();
        return;
      }
      if (mod && (e.key === "l" || e.key === "L")) {
        if (handleSelectLine()) e.preventDefault();
        return;
      }
      if (mod && e.key === "/") {
        if (handleToggleLineComment()) e.preventDefault();
        return;
      }
      if (mod && e.key === "]") {
        if (handleTab(false)) e.preventDefault();
        return;
      }
      if (mod && e.key === "[") {
        if (handleTab(true)) e.preventDefault();
        return;
      }
      if (mod && e.shiftKey && (e.key === "k" || e.key === "K")) {
        if (handleDeleteLine()) e.preventDefault();
        return;
      }
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const dir = e.key === "ArrowUp" ? "up" : "down";
        if (e.shiftKey) {
          if (handleDuplicateLines(dir)) e.preventDefault();
        } else {
          if (handleMoveLines(dir)) e.preventDefault();
        }
        return;
      }
      if (mod && (e.key === "f" || e.key === "F")) {
        openFind(false);
        e.preventDefault();
        return;
      }
      if (mod && (e.key === "h" || e.key === "H")) {
        openFind(true);
        e.preventDefault();
        return;
      }
      if (autoClose && !readOnly) {
        if (e.key === "(" || e.key === "[" || e.key === "{" || e.key === '"' || e.key === "'" || e.key === "`") {
          if (handleAutoClose(e.key)) e.preventDefault();
          return;
        }
        if (e.key === ")" || e.key === "]" || e.key === "}") {
          if (handleSkipOver(e.key)) e.preventDefault();
          return;
        }
      }
    },
    [
      autoClose,
      handleAutoClose,
      handleDeleteLine,
      handleDuplicateLines,
      handleEnter,
      handleMoveLines,
      handleSelectLine,
      handleSelectNextMatch,
      handleSkipOver,
      handleTab,
      handleToggleLineComment,
      onKeyDownProp,
      openFind,
      readOnly,
    ],
  );

  const gutterWidth = useMemo(() => {
    if (!showLineNumbers) return 0;
    const digits = Math.max(2, String(editor.lineCount).length);
    return digits * (FONT_SIZE * 0.62) + GUTTER_PADDING_X * 2;
  }, [editor.lineCount, showLineNumbers]);

  // Bracket matching — recompute when the selection or value changes.
  // Uses a document-level `selectionchange` listener because textarea
  // doesn't reliably emit scoped selection events across browsers.
  const [bracketMatch, setBracketMatch] = useState<BracketMatch | null>(null);

  // Capture the current editor snapshot in a ref so the effect does not
  // depend on object identity (which would re-fire every render and
  // thrash the document listener).
  const editorRef = useRef(editor);
  editorRef.current = editor;

  useEffect(() => {
    const compute = () => {
      const ta = textareaRef.current;
      const ed = editorRef.current;
      if (!ta || document.activeElement !== ta) {
        setBracketMatch((prev) => (prev ? null : prev));
        return;
      }
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? 0;
      if (start !== end) {
        setBracketMatch((prev) => (prev ? null : prev));
        return;
      }
      const { line, col } = ed.lineAt(start);
      const m = matchBracket(
        ed.lines,
        ed.language,
        ed.tokensForLine,
        { line, col },
      );
      setBracketMatch(m);
    };
    compute();
    document.addEventListener("selectionchange", compute);
    return () => document.removeEventListener("selectionchange", compute);
  }, [editor.value, textareaRef]);

  const charWidth = FONT_SIZE * 0.6;

  // ResizeObserver tracks the scroll viewport's visible height so the
  // virtualized line range can be computed deterministically.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setViewportHeight(el.clientHeight);
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const overscan = 8;
  // When the viewport hasn't been measured yet (first paint / jsdom /
  // hidden containers), fall back to an approx window large enough to
  // cover the provided `height` prop; if none, default to ~40 lines.
  const fallbackVisible = (() => {
    if (typeof height === "number") return Math.ceil(height / LINE_HEIGHT);
    if (typeof minHeight === "number") return Math.ceil(minHeight / LINE_HEIGHT);
    return 40;
  })();
  const approxVisible = viewportHeight > 0
    ? Math.max(1, Math.ceil(viewportHeight / LINE_HEIGHT))
    : fallbackVisible;
  const startLine = Math.max(
    0,
    Math.floor(scrollTop / LINE_HEIGHT) - overscan,
  );
  const endLine = Math.min(
    editor.lineCount,
    startLine + approxVisible + overscan * 2,
  );

  // Warm the token cache for the rendered range + a small idle prefetch.
  useEffect(() => {
    editor.primeLines(startLine, endLine - 1);
    if (typeof requestIdleCallback === "function" && endLine < editor.lineCount) {
      const id = requestIdleCallback(() => {
        editor.primeLines(endLine, Math.min(endLine + 200, editor.lineCount - 1));
      });
      return () => cancelIdleCallback(id);
    }
  }, [editor, startLine, endLine]);


  const containerStyle: CSSProperties = {
    height,
    minHeight,
    maxHeight,
  };

  const textStyle: CSSProperties = {
    fontFamily: "var(--harbor-font-mono)",
    fontSize: FONT_SIZE,
    lineHeight: `${LINE_HEIGHT}px`,
    tabSize,
  };

  return (
    <div
      ref={editor.surfaceRef}
      className={cn(
        "harbor-code-editor relative flex rounded-xl border border-white/10 bg-[rgb(var(--harbor-bg-elev-1))] overflow-hidden",
        readOnly && "opacity-90",
        className,
      )}
      data-readonly={readOnly || undefined}
      style={containerStyle}
    >
      {showLineNumbers && (
        <div
          aria-hidden
          className="shrink-0 select-none text-right text-[rgb(var(--harbor-text-subtle))] border-r border-white/5 bg-[rgb(var(--harbor-bg))]/40 relative"
          style={{
            ...textStyle,
            width: gutterWidth,
            paddingTop: PADDING_Y,
            paddingLeft: GUTTER_PADDING_X,
            paddingRight: GUTTER_PADDING_X,
            overflow: "hidden",
          }}
        >
          <div style={{ transform: `translateY(${-scrollTop}px)` }}>
            <div style={{ height: startLine * LINE_HEIGHT }} />
            {Array.from({ length: endLine - startLine }, (_, i) => {
              const lineNum = startLine + i + 1;
              const worstSeverity = worstDiagnosticOnLine(diagnostics, lineNum);
              return (
                <div
                  key={startLine + i}
                  style={{ height: LINE_HEIGHT }}
                  className="relative"
                >
                  {worstSeverity && (
                    <span
                      className={cn(
                        "absolute top-1.5 left-0 w-1.5 h-1.5 rounded-full",
                        worstSeverity === "error" &&
                          "bg-[rgb(var(--harbor-danger))]",
                        worstSeverity === "warning" &&
                          "bg-[rgb(var(--harbor-warning))]",
                        (worstSeverity === "info" ||
                          worstSeverity === "hint") &&
                          "bg-[rgb(var(--harbor-info))]",
                      )}
                    />
                  )}
                  {lineNum}
                </div>
              );
            })}
            <div
              style={{
                height: Math.max(0, (editor.lineCount - endLine) * LINE_HEIGHT),
              }}
            />
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        className="relative flex-1 min-w-0 overflow-auto"
        onScroll={(e) => {
          setScrollTop(e.currentTarget.scrollTop);
        }}
        dir="ltr"
      >
        <HighlightLayer
          lines={editor.lines}
          tokensForLine={editor.tokensForLine}
          startLine={startLine}
          endLine={endLine}
          lineHeight={LINE_HEIGHT}
          totalLines={editor.lineCount}
          style={textStyle}
          paddingX={PADDING_X}
          paddingY={PADDING_Y}
        />
        {bracketMatch && !bracketMatch.unmatched && (
          <>
            <BracketMarker
              line={bracketMatch.from.line}
              col={bracketMatch.from.col}
              charWidth={charWidth}
            />
            <BracketMarker
              line={bracketMatch.to.line}
              col={bracketMatch.to.col}
              charWidth={charWidth}
            />
          </>
        )}
        {diagnostics.map((d, i) => {
          const ln = d.line - 1;
          const col0 = (d.column ?? 1) - 1;
          const endLn = (d.endLine ?? d.line) - 1;
          const endCol = d.endColumn ?? (editor.lines[endLn]?.length ?? col0 + 1) + 1;
          // Only render on the first line when diagnostic spans multiple —
          // keeps the overlay simple for the 99% case.
          const top = PADDING_Y + ln * LINE_HEIGHT + LINE_HEIGHT - 3;
          const left = PADDING_X + col0 * charWidth;
          const width = Math.max(
            charWidth,
            (endLn === ln ? endCol - 1 - col0 : editor.lines[ln].length - col0) * charWidth,
          );
          const color =
            d.severity === "error"
              ? "rgb(var(--harbor-danger))"
              : d.severity === "warning"
              ? "rgb(var(--harbor-warning))"
              : "rgb(var(--harbor-info))";
          return (
            <span
              key={`diag-${i}`}
              aria-hidden
              title={d.message}
              style={{
                position: "absolute",
                top,
                left,
                width,
                height: 3,
                backgroundImage: `repeating-linear-gradient(135deg, ${color} 0 2px, transparent 2px 4px)`,
                pointerEvents: "none",
              }}
            />
          );
        })}
        {find.open &&
          findMatches.map((m, i) => {
            const { line: ln, col: c0 } = editor.lineAt(m.from);
            const { col: c1 } = editor.lineAt(m.to);
            const isCurrent = i === findIndex % Math.max(1, findMatches.length);
            return (
              <span
                key={`${m.from}-${m.to}`}
                aria-hidden
                className={cn(
                  "absolute pointer-events-none rounded-[2px]",
                  isCurrent
                    ? "bg-[rgb(var(--harbor-accent)/0.45)] ring-1 ring-[rgb(var(--harbor-accent))]"
                    : "bg-[rgb(var(--harbor-accent)/0.18)]",
                )}
                style={{
                  top: PADDING_Y + ln * LINE_HEIGHT,
                  left: PADDING_X + c0 * charWidth,
                  width: Math.max(1, (c1 - c0) * charWidth),
                  height: LINE_HEIGHT,
                }}
              />
            );
          })}
        <textarea
          {...rest}
          ref={textareaRef}
          id={rest.id ?? autoId}
          aria-label={ariaLabel}
          aria-multiline="true"
          aria-readonly={readOnly || undefined}
          aria-errormessage={
            diagnostics.some((d) => d.severity === "error")
              ? diagnosticsListId
              : undefined
          }
          aria-invalid={
            diagnostics.some((d) => d.severity === "error") ? true : undefined
          }
          data-cursor="text"
          value={editor.value}
          readOnly={readOnly}
          spellCheck={spellCheck}
          placeholder={placeholder}
          onChange={handleTextareaChange}
          onKeyDown={onKeyDown}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          className={cn(
            "absolute inset-0 w-full h-full bg-transparent outline-none resize-none",
            "text-transparent caret-[rgb(var(--harbor-text))]",
            "selection:bg-[rgb(var(--harbor-accent)/0.35)]",
          )}
          style={{
            ...textStyle,
            padding: `${PADDING_Y}px ${PADDING_X}px`,
            whiteSpace: "pre",
            overflowWrap: "normal",
          }}
        />
      </div>
      {diagnostics.length > 0 && (
        <ul
          id={diagnosticsListId}
          className="sr-only"
          aria-live="polite"
        >
          {diagnostics.map((d, i) => {
            const label =
              d.severity === "error"
                ? t("harbor.codeeditor.diagnosticError")
                : d.severity === "warning"
                ? t("harbor.codeeditor.diagnosticWarning")
                : d.severity === "info"
                ? t("harbor.codeeditor.diagnosticInfo")
                : t("harbor.codeeditor.diagnosticHint");
            return (
              <li key={i}>
                {label}: {d.message} (line {d.line}
                {d.column !== undefined ? `, col ${d.column}` : ""})
              </li>
            );
          })}
        </ul>
      )}
      {find.open && (
        <FindPanel
          state={find}
          setState={setFind}
          matchCount={findMatches.length}
          currentIndex={findIndex}
          onNext={() => findNext(1)}
          onPrev={() => findNext(-1)}
          onReplace={replaceCurrent}
          onReplaceAll={replaceAll}
          onClose={closeFind}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

interface FindPanelProps {
  state: {
    open: boolean;
    withReplace: boolean;
    query: string;
    replace: string;
    caseSensitive: boolean;
    wholeWord: boolean;
    regex: boolean;
  };
  setState: React.Dispatch<React.SetStateAction<FindPanelProps["state"]>>;
  matchCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  onClose: () => void;
  readOnly: boolean;
}

function FindPanel({
  state,
  setState,
  matchCount,
  currentIndex,
  onNext,
  onPrev,
  onReplace,
  onReplaceAll,
  onClose,
  readOnly,
}: FindPanelProps) {
  const { t } = useT();
  const queryRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    queryRef.current?.focus();
    queryRef.current?.select();
  }, [state.withReplace]);
  const currentHuman = matchCount === 0 ? 0 : (currentIndex % matchCount) + 1;
  return (
    <div
      role="region"
      aria-label={t("harbor.codeeditor.regionLabel")}
      className="absolute top-2 right-2 z-10 rounded-md border border-white/10 bg-[rgb(var(--harbor-bg-elev-2))] shadow-md p-2 flex flex-col gap-1 text-xs"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div className="flex items-center gap-1">
        <input
          ref={queryRef}
          aria-label={t("harbor.codeeditor.searchLabel")}
          className="w-48 bg-black/20 border border-white/10 rounded px-2 py-1 outline-none focus:border-[rgb(var(--harbor-accent))]"
          placeholder={t("harbor.codeeditor.findPlaceholder")}
          value={state.query}
          onChange={(e) => setState((s) => ({ ...s, query: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) onPrev();
              else onNext();
            }
          }}
        />
        <button
          type="button"
          aria-label={t("harbor.codeeditor.prev")}
          className="px-1.5 py-1 rounded hover:bg-white/5"
          onClick={onPrev}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={t("harbor.codeeditor.next")}
          className="px-1.5 py-1 rounded hover:bg-white/5"
          onClick={onNext}
        >
          ↓
        </button>
        <span className="text-[10px] text-[rgb(var(--harbor-text-muted))] tabular-nums min-w-[56px] text-right">
          {matchCount === 0
            ? t("harbor.codeeditor.noMatches")
            : `${currentHuman}/${matchCount}`}
        </span>
        <button
          type="button"
          aria-label={t("harbor.codeeditor.close")}
          className="px-1.5 py-1 rounded hover:bg-white/5"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="flex items-center gap-1">
        <FindToggle
          label="Aa"
          title={t("harbor.codeeditor.caseSensitive")}
          active={state.caseSensitive}
          onClick={() => setState((s) => ({ ...s, caseSensitive: !s.caseSensitive }))}
        />
        <FindToggle
          label="W"
          title={t("harbor.codeeditor.wholeWord")}
          active={state.wholeWord}
          onClick={() => setState((s) => ({ ...s, wholeWord: !s.wholeWord }))}
        />
        <FindToggle
          label=".*"
          title={t("harbor.codeeditor.regex")}
          active={state.regex}
          onClick={() => setState((s) => ({ ...s, regex: !s.regex }))}
        />
        {!state.withReplace && !readOnly && (
          <button
            type="button"
            className="ml-auto text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]"
            onClick={() => setState((s) => ({ ...s, withReplace: true }))}
          >
            {t("harbor.codeeditor.replace")}…
          </button>
        )}
      </div>
      {state.withReplace && !readOnly && (
        <div className="flex items-center gap-1">
          <input
            aria-label={t("harbor.codeeditor.replaceLabel")}
            className="w-48 bg-black/20 border border-white/10 rounded px-2 py-1 outline-none focus:border-[rgb(var(--harbor-accent))]"
            placeholder={t("harbor.codeeditor.replacePlaceholder")}
            value={state.replace}
            onChange={(e) => setState((s) => ({ ...s, replace: e.target.value }))}
          />
          <button
            type="button"
            className="px-2 py-1 rounded border border-white/10 hover:bg-white/5"
            onClick={onReplace}
          >
            {t("harbor.codeeditor.replaceOne")}
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded border border-white/10 hover:bg-white/5"
            onClick={onReplaceAll}
          >
            {t("harbor.codeeditor.replaceAll")}
          </button>
        </div>
      )}
    </div>
  );
}

function FindToggle({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "px-1.5 py-0.5 rounded border border-white/10 font-mono text-[11px]",
        active
          ? "bg-[rgb(var(--harbor-accent)/0.2)] border-[rgb(var(--harbor-accent))] text-[rgb(var(--harbor-text))]"
          : "text-[rgb(var(--harbor-text-muted))] hover:bg-white/5",
      )}
    >
      {label}
    </button>
  );
}

interface HighlightLayerProps {
  lines: readonly string[];
  tokensForLine: (line: number) => Token[];
  startLine: number;
  endLine: number;
  lineHeight: number;
  totalLines: number;
  style: CSSProperties;
  paddingX: number;
  paddingY: number;
}

interface BracketMarkerProps {
  line: number;
  col: number;
  charWidth: number;
}

function BracketMarker({ line, col, charWidth }: BracketMarkerProps) {
  return (
    <span
      aria-hidden
      className="absolute pointer-events-none rounded-sm border border-[rgb(var(--harbor-accent)/0.5)] bg-[rgb(var(--harbor-accent)/0.12)]"
      style={{
        top: PADDING_Y + line * LINE_HEIGHT,
        left: PADDING_X + col * charWidth,
        width: charWidth,
        height: LINE_HEIGHT,
      }}
    />
  );
}

function HighlightLayer({
  lines,
  tokensForLine,
  startLine,
  endLine,
  lineHeight,
  totalLines,
  style,
  paddingX,
  paddingY,
}: HighlightLayerProps) {
  const topSpacer = startLine * lineHeight;
  const bottomSpacer = Math.max(0, (totalLines - endLine) * lineHeight);
  return (
    <pre
      aria-hidden
      className="m-0 pointer-events-none text-[rgb(var(--harbor-text))]"
      style={{
        ...style,
        padding: `${paddingY}px ${paddingX}px`,
        whiteSpace: "pre",
        minHeight: "100%",
      }}
    >
      <code>
        {topSpacer > 0 && <div style={{ height: topSpacer }} />}
        {Array.from({ length: endLine - startLine }, (_, i) => {
          const idx = startLine + i;
          return (
            <HighlightLine
              key={idx}
              line={lines[idx] ?? ""}
              tokens={tokensForLine(idx)}
            />
          );
        })}
        {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
      </code>
    </pre>
  );
}

interface HighlightLineProps {
  line: string;
  tokens: Token[];
}

function HighlightLine({ line, tokens }: HighlightLineProps) {
  if (tokens.length === 0) {
    // Empty line still needs a placeholder so the highlight layer
    // keeps the correct number of visual rows. `\n` doesn't render
    // without a leading span so we use a zero-width space.
    return (
      <div data-line>
        {line || "​"}
        {"\n"}
      </div>
    );
  }
  return (
    <div data-line>
      {tokens.map((tok, i) => (
        <span key={i} className={tokenClass(tok.type)}>
          {tok.text}
        </span>
      ))}
      {"\n"}
    </div>
  );
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function worstDiagnosticOnLine(
  diagnostics: readonly Diagnostic[],
  line: number,
): Diagnostic["severity"] | null {
  let worst: Diagnostic["severity"] | null = null;
  const rank: Record<Diagnostic["severity"], number> = {
    error: 4,
    warning: 3,
    info: 2,
    hint: 1,
  };
  for (const d of diagnostics) {
    if (d.line === line) {
      if (!worst || rank[d.severity] > rank[worst]) worst = d.severity;
    }
  }
  return worst;
}

function tokenClass(type: Token["type"]): string {
  switch (type) {
    case "keyword":
      return "text-[rgb(var(--harbor-syntax-keyword))]";
    case "string":
      return "text-[rgb(var(--harbor-syntax-string))]";
    case "comment":
      return "text-[rgb(var(--harbor-syntax-comment))] italic";
    case "number":
      return "text-[rgb(var(--harbor-syntax-number))]";
    case "function":
      return "text-[rgb(var(--harbor-syntax-function))]";
    case "type":
      return "text-[rgb(var(--harbor-syntax-type))]";
    case "operator":
      return "text-[rgb(var(--harbor-syntax-operator))]";
    case "property":
      return "text-[rgb(var(--harbor-syntax-property))]";
    case "attribute":
      return "text-[rgb(var(--harbor-syntax-attribute))]";
    case "tag":
      return "text-[rgb(var(--harbor-syntax-tag))]";
    case "regex":
      return "text-[rgb(var(--harbor-syntax-regex))]";
    case "meta":
      return "text-[rgb(var(--harbor-syntax-meta))]";
    case "error":
      return "text-[rgb(var(--harbor-syntax-error))] underline decoration-wavy";
    case "variable":
    case "identifier":
    case "punctuation":
    case "escape":
    case "heading":
    case "link":
    case "emphasis":
    case "strong":
    default:
      return "text-[rgb(var(--harbor-text))]";
  }
}
