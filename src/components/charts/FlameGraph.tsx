import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";

export interface FlameFrame {
  id: string;
  /** Parent frame id (null/undefined = root). */
  parent?: string | null;
  label: string;
  /** Self-inclusive cost (typically time in ms). */
  value: number;
  color?: string;
}

export interface FlameGraphProps {
  frames: readonly FlameFrame[];
  /** Vertical slot height in px. Default 22. */
  rowHeight?: number;
  /** Minimum render width (px) below which frames are skipped (perf). */
  minPixelWidth?: number;
  /** Called when user clicks a frame. */
  onFrameClick?: (frame: FlameFrame) => void;
  /** `v` formatter (ms, bytes, etc.). */
  formatValue?: (v: number) => string;
  className?: string;
}

interface LaidFrame {
  frame: FlameFrame;
  depth: number;
  xFrac: number;
  widthFrac: number;
  children: LaidFrame[];
}

const DEFAULT_COLORS = [
  "#a855f7", "#38bdf8", "#f472b6", "#34d399",
  "#fbbf24", "#fb7185", "#818cf8", "#22d3ee",
];

function colorFor(frame: FlameFrame, idx: number): string {
  return frame.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
}

/** Flame graph for perf profiles and call stacks.
 *
 *  Click a frame → it becomes the new root (zooms in). Breadcrumbs
 *  above let you zoom back out. Hover shows full-path tooltip. */
export function FlameGraph({
  frames,
  rowHeight = 22,
  minPixelWidth = 1,
  onFrameClick,
  formatValue = (v) => `${v}`,
  className,
}: FlameGraphProps) {
  const [rootId, setRootId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const byId = useMemo(() => {
    const m = new Map<string, FlameFrame>();
    for (const f of frames) m.set(f.id, f);
    return m;
  }, [frames]);

  const childrenOf = useMemo(() => {
    const m = new Map<string | null, FlameFrame[]>();
    for (const f of frames) {
      const key = f.parent ?? null;
      const list = m.get(key) ?? [];
      list.push(f);
      m.set(key, list);
    }
    return m;
  }, [frames]);

  // Compute sum of children under a node (sum-subtree value) — fallback
  // when parent's own value is inconsistent with children.
  const tree = useMemo<LaidFrame | null>(() => {
    // Find root(s). If explicit rootId, use it. Otherwise: single root
    // or synthetic "<all>" wrapping multiple.
    let rootFrame: FlameFrame | null = null;
    if (rootId) {
      rootFrame = byId.get(rootId) ?? null;
    } else {
      const roots = childrenOf.get(null) ?? [];
      if (roots.length === 1) rootFrame = roots[0];
      else if (roots.length > 1) {
        const totalValue = roots.reduce((s, r) => s + r.value, 0);
        rootFrame = { id: "<root>", label: "<all>", value: totalValue };
      }
    }
    if (!rootFrame) return null;

    const layout = (f: FlameFrame, depth: number, xFrac: number, widthFrac: number): LaidFrame => {
      let kids: FlameFrame[];
      if (f.id === "<root>") kids = childrenOf.get(null) ?? [];
      else kids = childrenOf.get(f.id) ?? [];
      const totalKidValue = kids.reduce((s, k) => s + k.value, 0);
      const denom = Math.max(totalKidValue, f.value) || 1;
      let cursor = 0;
      const laidChildren: LaidFrame[] = [];
      for (const k of kids) {
        const kFrac = (k.value / denom) * widthFrac;
        laidChildren.push(layout(k, depth + 1, xFrac + cursor, kFrac));
        cursor += kFrac;
      }
      return { frame: f, depth, xFrac, widthFrac, children: laidChildren };
    };

    return layout(rootFrame, 0, 0, 1);
  }, [byId, childrenOf, rootId]);

  // Flatten for rendering.
  const laid = useMemo<LaidFrame[]>(() => {
    if (!tree) return [];
    const out: LaidFrame[] = [];
    const walk = (n: LaidFrame) => {
      out.push(n);
      for (const c of n.children) walk(c);
    };
    walk(tree);
    return out;
  }, [tree]);

  const maxDepth = laid.reduce((m, n) => Math.max(m, n.depth), 0);
  const totalHeight = (maxDepth + 1) * rowHeight;

  // Breadcrumbs: ancestors of rootId (for zoom-out UI).
  const breadcrumbs = useMemo<FlameFrame[]>(() => {
    if (!rootId) return [];
    const chain: FlameFrame[] = [];
    let cur: FlameFrame | undefined = byId.get(rootId);
    while (cur) {
      chain.unshift(cur);
      cur = cur.parent ? byId.get(cur.parent) : undefined;
    }
    return chain;
  }, [rootId, byId]);

  // Hover ancestors for highlighting.
  const ancestorSet = useMemo(() => {
    const s = new Set<string>();
    if (!hoverId) return s;
    let cur: FlameFrame | undefined = byId.get(hoverId);
    while (cur) {
      s.add(cur.id);
      cur = cur.parent ? byId.get(cur.parent) : undefined;
    }
    return s;
  }, [hoverId, byId]);

  if (!tree) {
    return (
      <div className={cn("text-white/40 text-sm p-4", className)}>
        No frames to render.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-1 text-xs text-white/60 mb-2">
        <button
          onClick={() => setRootId(null)}
          disabled={rootId === null}
          className="px-1.5 py-0.5 rounded hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          root
        </button>
        {breadcrumbs.map((b, i) => (
          <span key={b.id} className="inline-flex items-center gap-1">
            <span className="text-white/30">›</span>
            <button
              onClick={() => setRootId(i === breadcrumbs.length - 1 ? null : b.id)}
              className={cn(
                "px-1.5 py-0.5 rounded hover:bg-white/5",
                i === breadcrumbs.length - 1 && "text-white font-medium",
              )}
            >
              {b.label}
            </button>
          </span>
        ))}
      </div>
      <div
        className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/30"
        style={{ height: totalHeight }}
      >
        {laid.map((n, i) => {
          const left = `${n.xFrac * 100}%`;
          const width = `${n.widthFrac * 100}%`;
          const top = n.depth * rowHeight;
          const skip = false; // percentage-based; browser handles
          void skip;
          return (
            <div
              key={n.frame.id}
              onMouseEnter={() => setHoverId(n.frame.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => {
                onFrameClick?.(n.frame);
                if (n.children.length > 0 && n.frame.id !== "<root>") {
                  setRootId(n.frame.id);
                }
              }}
              style={{
                position: "absolute",
                left,
                top,
                width,
                height: rowHeight - 1,
                background: colorFor(n.frame, i),
                opacity:
                  hoverId === null ? 0.85 : ancestorSet.has(n.frame.id) ? 1 : 0.3,
                minWidth: minPixelWidth,
              }}
              className="text-[10px] text-white/95 font-mono truncate px-1 cursor-pointer border-r border-black/20 hover:brightness-110 transition-opacity"
              title={`${n.frame.label} · ${formatValue(n.frame.value)}`}
            >
              {n.frame.label}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-white/60 min-h-[1.25rem]">
        {hoverId ? (
          <>
            <span className="font-mono">{byId.get(hoverId)?.label}</span>
            <span className="text-white/40 ml-2">
              {formatValue(byId.get(hoverId)?.value ?? 0)}
            </span>
          </>
        ) : (
          <span className="text-white/40">Hover a frame · click to zoom</span>
        )}
      </div>
    </div>
  );
}
