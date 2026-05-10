import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn } from "../../lib/cn";

export type SpreadsheetCellSide = "top" | "right" | "bottom" | "left";
export type SpreadsheetCellBorderStyle = "solid" | "dashed" | "dotted" | "double" | "none";
export type SpreadsheetCellFontFamily = "mono" | "sans" | "serif";
export type SpreadsheetCellColor =
  | "default"
  | "muted"
  | "accent"
  | "cyan"
  | "purple"
  | "success"
  | "warning"
  | "danger"
  | "transparent"
  | (string & {});

export interface SpreadsheetCellBorder {
  color?: SpreadsheetCellColor;
  style?: SpreadsheetCellBorderStyle;
  width?: number | string;
}

export interface SpreadsheetCellStyle {
  fontSize?: number | string;
  fontFamily?: SpreadsheetCellFontFamily | (string & {});
  color?: SpreadsheetCellColor;
  backgroundColor?: SpreadsheetCellColor;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: "left" | "center" | "right";
  border?: SpreadsheetCellBorder;
  borders?: Partial<Record<SpreadsheetCellSide, SpreadsheetCellBorder>>;
  /** Backward-compatible aliases used by older demos. Prefer `textAlign`, `color`, and `backgroundColor`. */
  align?: "left" | "center" | "right";
  tone?: "default" | "muted" | "accent" | "success" | "warning" | "danger";
  fill?: "none" | "panel" | "accent" | "success" | "warning" | "danger";
}

export interface SpreadsheetCellSelectOptions {
  extend: boolean;
  edit: boolean;
}

export interface SpreadsheetCellNavigateOptions {
  shift: boolean;
}

export interface SpreadsheetCellProps {
  id: string;
  value: string;
  displayValue?: string;
  style?: SpreadsheetCellStyle;
  selected?: boolean;
  inSelection?: boolean;
  editing?: boolean;
  rangeSize?: number;
  numeric?: boolean;
  formula?: boolean;
  header?: boolean;
  className?: string;
  onSelect?: (id: string, options: SpreadsheetCellSelectOptions) => void;
  onRangeDragStart?: (id: string, extend: boolean) => void;
  onRangeDragEnter?: (id: string) => void;
  onEditStart?: (id: string) => void;
  onEditEnd?: (id: string) => void;
  onValueChange?: (id: string, value: string) => void;
  onNavigate?: (
    id: string,
    direction: "up" | "down" | "left" | "right",
    options: SpreadsheetCellNavigateOptions,
  ) => void;
  onClear?: (id: string) => void;
  onContextMenu?: (event: MouseEvent<HTMLInputElement>, id: string) => void;
}

export function SpreadsheetCell({
  id,
  value,
  displayValue = value,
  style,
  selected = false,
  inSelection = false,
  editing = false,
  rangeSize = 1,
  numeric = false,
  formula = false,
  header = false,
  className,
  onSelect,
  onRangeDragStart,
  onRangeDragEnter,
  onEditStart,
  onEditEnd,
  onValueChange,
  onNavigate,
  onClear,
  onContextMenu,
}: SpreadsheetCellProps) {
  const ignoreNextFocusSelectRef = useRef(false);

  function handleMouseDown(event: MouseEvent<HTMLInputElement>) {
    if (event.button !== 0) return;
    const extend = event.shiftKey;
    ignoreNextFocusSelectRef.current = true;
    if (!extend && selected && rangeSize === 1) {
      onSelect?.(id, { extend: false, edit: true });
      onEditStart?.(id);
      return;
    }
    onEditEnd?.(id);
    onSelect?.(id, { extend, edit: false });
    onRangeDragStart?.(id, extend);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!editing) {
      if (event.key === "Enter" || event.key === "F2") {
        event.preventDefault();
        onSelect?.(id, { extend: false, edit: true });
        onEditStart?.(id);
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        onClear?.(id);
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate?.(
          id,
          event.key === "ArrowDown" ? "down" : event.key === "ArrowUp" ? "up" : event.key === "ArrowLeft" ? "left" : "right",
          { shift: event.shiftKey },
        );
        return;
      }
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        onSelect?.(id, { extend: false, edit: true });
        onEditStart?.(id);
        onValueChange?.(id, event.key);
        return;
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onEditEnd?.(id);
      onNavigate?.(id, event.shiftKey ? "up" : "down", { shift: event.shiftKey });
    }
    if (event.key === "Tab") {
      event.preventDefault();
      onEditEnd?.(id);
      onNavigate?.(id, event.shiftKey ? "left" : "right", { shift: event.shiftKey });
    }
    if (event.key === "Escape") {
      event.currentTarget.blur();
      onEditEnd?.(id);
    }
  }

  return (
    <input
      value={editing ? value : displayValue}
      readOnly={!editing}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onRangeDragEnter?.(id)}
      onFocus={() => {
        if (ignoreNextFocusSelectRef.current) {
          ignoreNextFocusSelectRef.current = false;
          return;
        }
        if (selected || inSelection) return;
        if (!editing) onSelect?.(id, { extend: false, edit: false });
      }}
      onDoubleClick={() => onEditStart?.(id)}
      onKeyDown={handleKeyDown}
      onChange={(event) => {
        if (editing) onValueChange?.(id, event.target.value);
      }}
      onBlur={() => onEditEnd?.(id)}
      onContextMenu={(event) => onContextMenu?.(event, id)}
      aria-selected={selected || inSelection}
      data-spreadsheet-cell={id}
      data-editing={editing ? "true" : undefined}
      className={cn(
        "h-9 border-r border-[var(--harbor-workbench-border,var(--harbor-border))] bg-transparent px-2 font-mono text-xs text-[color:var(--harbor-workbench-fg,var(--harbor-fg))] outline-none",
        header && "font-semibold text-[color:var(--harbor-workbench-fg-muted,var(--harbor-fg-muted))]",
        style?.textAlign || style?.align ? alignClass(style.textAlign ?? style.align) : numeric ? "text-right" : "text-left",
        style?.bold && "font-bold",
        style?.italic && "italic",
        style?.underline && "underline underline-offset-2",
        !style?.color && !style?.tone && "text-[color:var(--harbor-workbench-fg,var(--harbor-fg))]",
        formula && !editing && "text-[color:var(--harbor-workbench-accent-hover,rgb(var(--harbor-accent)))]",
        inSelection ? "bg-[var(--harbor-workbench-selection-bg,rgb(var(--harbor-accent)/0.14))]" : "hover:bg-[var(--harbor-workbench-control-hover-bg,rgb(var(--harbor-fg-rgb,255_255_255)/0.06))]",
        selected && "ring-1 ring-inset ring-[var(--harbor-workbench-accent-border,rgb(var(--harbor-accent)))]",
        className,
      )}
      style={spreadsheetCellStyleToCss(style)}
    />
  );
}

function spreadsheetCellStyleToCss(style?: SpreadsheetCellStyle): CSSProperties | undefined {
  if (!style) return undefined;
  const css: CSSProperties = {};
  const fontFamily = resolveFontFamily(style.fontFamily);
  const color = resolveSpreadsheetColor(style.color ?? style.tone);
  const background = resolveSpreadsheetFill(style.backgroundColor ?? style.fill);
  if (style.fontSize) css.fontSize = typeof style.fontSize === "number" ? `${style.fontSize}px` : style.fontSize;
  if (fontFamily) css.fontFamily = fontFamily;
  if (color) css.color = color;
  if (background) css.backgroundColor = background;
  if (style.bold) css.fontWeight = 700;
  if (style.italic) css.fontStyle = "italic";
  if (style.underline) css.textDecoration = "underline";

  applyBorder(css, "borderTop", style.borders?.top ?? style.border);
  applyBorder(css, "borderRight", style.borders?.right ?? style.border);
  applyBorder(css, "borderBottom", style.borders?.bottom ?? style.border);
  applyBorder(css, "borderLeft", style.borders?.left ?? style.border);
  return css;
}

function applyBorder(
  css: CSSProperties,
  property: "borderTop" | "borderRight" | "borderBottom" | "borderLeft",
  border?: SpreadsheetCellBorder,
) {
  if (!border) return;
  const width = typeof border.width === "number" ? `${border.width}px` : border.width ?? "1px";
  const style = border.style ?? "solid";
  const color = resolveSpreadsheetColor(border.color) ?? "var(--harbor-workbench-border-strong,var(--harbor-border-strong))";
  css[property] = `${width} ${style} ${color}`;
}

function resolveFontFamily(fontFamily?: SpreadsheetCellStyle["fontFamily"]) {
  if (!fontFamily) return undefined;
  if (fontFamily === "mono") return "var(--harbor-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";
  if (fontFamily === "sans") return "var(--harbor-font-sans, Inter, ui-sans-serif, system-ui, sans-serif)";
  if (fontFamily === "serif") return "ui-serif, Georgia, Cambria, serif";
  return fontFamily;
}

function resolveSpreadsheetColor(color?: SpreadsheetCellColor | "none" | "panel") {
  if (!color || color === "none") return undefined;
  if (color === "transparent") return "transparent";
  if (color === "default") return "var(--harbor-workbench-fg,var(--harbor-fg))";
  if (color === "muted") return "var(--harbor-workbench-fg-muted,var(--harbor-fg-muted))";
  if (color === "accent") return "rgb(var(--harbor-accent))";
  if (color === "cyan") return "rgb(var(--harbor-accent-2,34 211 238))";
  if (color === "purple") return "rgb(var(--harbor-accent))";
  if (color === "success") return "rgb(var(--harbor-success))";
  if (color === "warning") return "rgb(var(--harbor-warning))";
  if (color === "danger") return "rgb(var(--harbor-danger))";
  return color;
}

function resolveSpreadsheetFill(color?: SpreadsheetCellColor | "none" | "panel") {
  if (!color || color === "none") return undefined;
  if (color === "panel") return "var(--harbor-workbench-panel-bg,var(--harbor-surface-2))";
  if (color === "default") return "var(--harbor-workbench-bg,var(--harbor-surface-1))";
  if (color === "muted") return "rgb(var(--harbor-fg-rgb,255 255 255)/0.05)";
  if (color === "accent") return "rgb(var(--harbor-accent)/0.18)";
  if (color === "cyan") return "rgb(var(--harbor-accent-2,34 211 238)/0.16)";
  if (color === "purple") return "rgb(var(--harbor-accent)/0.16)";
  if (color === "success") return "rgb(var(--harbor-success)/0.14)";
  if (color === "warning") return "rgb(var(--harbor-warning)/0.14)";
  if (color === "danger") return "rgb(var(--harbor-danger)/0.14)";
  return resolveSpreadsheetColor(color);
}

function alignClass(align?: SpreadsheetCellStyle["textAlign"] | SpreadsheetCellStyle["align"]) {
  return {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align ?? "left"];
}
