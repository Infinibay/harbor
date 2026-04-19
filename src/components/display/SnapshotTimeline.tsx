import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { formatBytes, formatRelative } from "../../lib/format";

export interface Snapshot {
  id: string;
  at: Date | string | number;
  /** Bytes. */
  size: number;
  label?: string;
  kind?: "manual" | "auto" | "pre-migration";
  locked?: boolean;
}

export interface SnapshotTimelineProps {
  snapshots: readonly Snapshot[];
  /** Dense mode collapses into a density bar when true (auto-on > 50). */
  dense?: boolean;
  onRestore?: (snap: Snapshot) => void;
  onDelete?: (snap: Snapshot) => void;
  onSelect?: (snap: Snapshot) => void;
  className?: string;
}

function toMs(v: Date | string | number): number {
  return v instanceof Date ? v.getTime() : new Date(v).getTime();
}

const KIND_TONE: Record<NonNullable<Snapshot["kind"]>, string> = {
  manual: "bg-fuchsia-400",
  auto: "bg-sky-400",
  "pre-migration": "bg-amber-400",
};

/** Horizontal strip of snapshots over time. Hover shows size + age;
 *  click emits `onSelect`. Restore / Delete buttons appear on hover. */
export function SnapshotTimeline({
  snapshots,
  dense,
  onRestore,
  onDelete,
  onSelect,
  className,
}: SnapshotTimelineProps) {
  const sorted = useMemo(
    () => [...snapshots].sort((a, b) => toMs(a.at) - toMs(b.at)),
    [snapshots],
  );

  const useDense = dense ?? sorted.length > 50;
  const [hover, setHover] = useState<string | null>(null);

  if (sorted.length === 0) {
    return (
      <div className={cn("text-sm text-white/40 py-4 text-center", className)}>
        No snapshots yet.
      </div>
    );
  }

  const first = toMs(sorted[0].at);
  const last = toMs(sorted[sorted.length - 1].at);
  const span = Math.max(1, last - first);

  if (useDense) {
    return (
      <div className={cn("w-full flex flex-col gap-2", className)}>
        <div className="text-xs text-white/50 flex justify-between">
          <span>{sorted.length} snapshots</span>
          <span className="tabular-nums font-mono">
            {formatRelative(first)} — {formatRelative(last)}
          </span>
        </div>
        <div className="relative h-6 rounded-full bg-white/[0.06] overflow-hidden">
          {sorted.map((s) => {
            const leftPct = ((toMs(s.at) - first) / span) * 100;
            return (
              <span
                key={s.id}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(s)}
                className={cn(
                  "absolute top-1 bottom-1 w-0.5 rounded cursor-pointer",
                  KIND_TONE[s.kind ?? "manual"],
                  hover === s.id && "scale-x-[3]",
                )}
                style={{ left: `${leftPct}%` }}
                title={`${formatRelative(s.at)} · ${formatBytes(s.size)}${s.label ? ` · ${s.label}` : ""}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="relative pt-4">
        <div className="absolute left-0 right-0 top-8 h-px bg-white/10" />
        <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-4">
          {sorted.map((s) => {
            const isHover = hover === s.id;
            return (
              <div
                key={s.id}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <button
                  onClick={() => onSelect?.(s)}
                  className={cn(
                    "w-3 h-3 rounded-full border-2 border-black hover:scale-125 transition-transform",
                    KIND_TONE[s.kind ?? "manual"],
                  )}
                  title={s.label}
                />
                <div className="text-[10px] text-white/55 tabular-nums font-mono whitespace-nowrap">
                  {formatRelative(s.at)}
                </div>
                <div className="text-[10px] text-white/40 tabular-nums font-mono whitespace-nowrap">
                  {formatBytes(s.size)}
                </div>
                {isHover && (onRestore || onDelete) ? (
                  <div className="flex gap-1 mt-1">
                    {onRestore ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestore(s);
                        }}
                        className="text-[10px] text-fuchsia-200 hover:text-white"
                      >
                        Restore
                      </button>
                    ) : null}
                    {onDelete && !s.locked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(s);
                        }}
                        className="text-[10px] text-rose-300 hover:text-rose-200"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
