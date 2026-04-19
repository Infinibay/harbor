import { useMemo, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { formatDuration } from "../../lib/format";

export type SpanStatus = "ok" | "error" | "pending";

export interface Span {
  id: string;
  name: string;
  /** Relative start, ms. */
  start: number;
  /** Duration, ms. */
  duration: number;
  status?: SpanStatus;
  /** Nest under this span id (omit for root). */
  parent?: string;
  tags?: Record<string, string | number | boolean>;
  color?: string;
}

// =====================================================================
// SpanBar — one row
// =====================================================================

export interface SpanBarProps {
  name: string;
  /** Start / duration in same unit as `totalMs`. */
  start: number;
  duration: number;
  /** Time window the bar is painted against. Controls where the bar sits. */
  totalMs: number;
  status?: SpanStatus;
  tags?: Record<string, string | number | boolean>;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const STATUS_COLOR: Record<SpanStatus, string> = {
  ok: "#34d399",
  error: "#f43f5e",
  pending: "#fbbf24",
};

export function SpanBar({
  name,
  start,
  duration,
  totalMs,
  status = "ok",
  tags,
  color,
  onClick,
  className,
}: SpanBarProps) {
  const leftPct = (start / totalMs) * 100;
  const widthPct = Math.max(0.3, (duration / totalMs) * 100);
  const fill = color ?? STATUS_COLOR[status];
  return (
    <div
      className={cn(
        "relative h-5 rounded cursor-pointer group",
        className,
      )}
      onClick={onClick}
      title={`${name} · ${formatDuration(duration, { includeMs: true })}${
        tags ? "\n" + JSON.stringify(tags, null, 2) : ""
      }`}
    >
      <div className="absolute inset-0 rounded bg-white/[0.03]" />
      <div
        className="absolute top-0 bottom-0 rounded"
        style={{
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          background: fill,
          opacity: 0.85,
        }}
      />
      <div
        className="absolute top-0 bottom-0 flex items-center text-[10px] font-mono text-white/90 whitespace-nowrap px-1.5 pointer-events-none"
        style={{ left: `${leftPct}%`, maxWidth: `${Math.max(widthPct, 40)}%` }}
      >
        <span className="truncate">{name}</span>
        <span className="text-white/70 ml-2 shrink-0">
          {formatDuration(duration, { includeMs: true })}
        </span>
      </div>
    </div>
  );
}

// =====================================================================
// TraceWaterfall — nested stack of SpanBars
// =====================================================================

export interface TraceWaterfallProps {
  spans: readonly Span[];
  /** Override total duration; default = max(span.start + span.duration). */
  totalMs?: number;
  onSpanClick?: (span: Span) => void;
  /** Slot above the waterfall — typically a title / summary / filters. */
  header?: ReactNode;
  className?: string;
}

interface TreeNode {
  span: Span;
  children: TreeNode[];
  depth: number;
}

/** Nested span waterfall — Jaeger / Lightstep style. Indents children
 *  under their parent and draws a connecting tree guide on the left. */
export function TraceWaterfall({
  spans,
  totalMs,
  onSpanClick,
  header,
  className,
}: TraceWaterfallProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const sp of spans) s.add(sp.id);
    return s;
  });

  const total = useMemo(() => {
    if (totalMs !== undefined) return totalMs;
    let max = 0;
    for (const s of spans) max = Math.max(max, s.start + s.duration);
    return max || 1;
  }, [spans, totalMs]);

  const tree = useMemo<TreeNode[]>(() => {
    const byId = new Map(spans.map((s) => [s.id, s]));
    const children = new Map<string | undefined, Span[]>();
    for (const s of spans) {
      const list = children.get(s.parent) ?? [];
      list.push(s);
      children.set(s.parent, list);
    }
    const build = (s: Span, depth: number): TreeNode => ({
      span: s,
      depth,
      children: (children.get(s.id) ?? [])
        .sort((a, b) => a.start - b.start)
        .map((c) => build(c, depth + 1)),
    });
    const roots = (children.get(undefined) ?? [])
      .sort((a, b) => a.start - b.start)
      .map((r) => build(r, 0));
    void byId;
    return roots;
  }, [spans]);

  // Flatten for render, respecting expanded state.
  const rows: TreeNode[] = [];
  const walk = (n: TreeNode) => {
    rows.push(n);
    if (expanded.has(n.span.id)) {
      for (const c of n.children) walk(c);
    }
  };
  tree.forEach(walk);

  function toggle(id: string) {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <div className={cn("w-full", className)}>
      {header}
      <div className="flex items-center gap-3 text-[10px] text-white/40 tabular-nums font-mono px-2 py-1 border-b border-white/8">
        <span className="w-64 shrink-0">Span</span>
        <span className="flex-1 flex items-center justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <span key={f}>{formatDuration(f * total, { includeMs: true })}</span>
          ))}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 py-1">
        {rows.map((row) => {
          const hasChildren = row.children.length > 0;
          const open = expanded.has(row.span.id);
          return (
            <div key={row.span.id} className="flex items-center gap-3 px-2">
              <div
                className="w-64 shrink-0 flex items-center gap-1.5 text-xs text-white/85"
                style={{ paddingLeft: row.depth * 12 }}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggle(row.span.id)}
                    className="w-3 text-[10px] text-white/50 hover:text-white text-left"
                  >
                    {open ? "▾" : "▸"}
                  </button>
                ) : (
                  <span className="w-3" />
                )}
                <span className="truncate">{row.span.name}</span>
              </div>
              <div className="flex-1">
                <SpanBar
                  name=""
                  start={row.span.start}
                  duration={row.span.duration}
                  totalMs={total}
                  status={row.span.status}
                  tags={row.span.tags}
                  color={row.span.color}
                  onClick={() => onSpanClick?.(row.span)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
