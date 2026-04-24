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
  const composingRef = useRef(false);

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
      handleEnter,
      handleSelectLine,
      handleSelectNextMatch,
      handleSkipOver,
      handleTab,
      onKeyDownProp,
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
          className="shrink-0 select-none text-right text-[rgb(var(--harbor-text-subtle))] border-r border-white/5 bg-[rgb(var(--harbor-bg))]/40"
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
            {editor.lines.map((_, i) => (
              <div key={i} style={{ height: LINE_HEIGHT }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className="relative flex-1 min-w-0 overflow-auto"
        onScroll={(e) => {
          setScrollTop(e.currentTarget.scrollTop);
        }}
        dir="ltr"
      >
        <HighlightLayer
          lines={editor.lines}
          tokensForLine={editor.tokensForLine}
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
        <textarea
          {...rest}
          ref={textareaRef}
          id={rest.id ?? autoId}
          aria-label={ariaLabel}
          aria-multiline="true"
          aria-readonly={readOnly || undefined}
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
    </div>
  );
}

interface HighlightLayerProps {
  lines: readonly string[];
  tokensForLine: (line: number) => Token[];
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
  style,
  paddingX,
  paddingY,
}: HighlightLayerProps) {
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
        {lines.map((line, i) => (
          <HighlightLine
            key={i}
            line={line}
            tokens={tokensForLine(i)}
          />
        ))}
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
