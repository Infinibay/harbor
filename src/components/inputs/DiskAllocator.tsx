import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatBytes } from "../../lib/format";

export type SlabTone = "used" | "reserved" | "backup" | "warn" | "custom";

export interface DiskAllocation {
  id: string;
  label?: string;
  /** Bytes. */
  size: number;
  tone?: SlabTone;
  color?: string;
}

export interface DiskAllocatorProps {
  /** Total capacity in bytes. */
  total: number;
  allocations: readonly DiskAllocation[];
  onChange?: (allocations: DiskAllocation[]) => void;
  /** When the user drags on free space, call this to request a new
   *  allocation with the given size. Default: creates a local "new" slab. */
  onCreate?: (size: number) => DiskAllocation;
  /** Minimum chunk size in bytes. Default 1 GB. */
  minSize?: number;
  height?: number;
  /** Optional header slot (title + total). */
  header?: ReactNode;
  className?: string;
}

const TONE_COLOR: Record<SlabTone, string> = {
  used: "rgb(168 85 247)",
  reserved: "rgb(56 189 248)",
  backup: "rgb(52 211 153)",
  warn: "rgb(251 191 36)",
  custom: "rgb(244 114 182)",
};

/** Horizontal slab allocator bar. Drag across free space to reserve a
 *  new chunk; click a chunk to inspect / delete. */
export function DiskAllocator({
  total,
  allocations,
  onChange,
  onCreate,
  minSize = 1024 ** 3,
  height = 32,
  header,
  className,
}: DiskAllocatorProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [dragRect, setDragRect] = useState<{ left: number; width: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const consumed = allocations.reduce((s, a) => s + a.size, 0);
  const free = Math.max(0, total - consumed);

  function bytesAt(el: HTMLDivElement, clientX: number): number {
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    return Math.max(0, Math.min(total, (x / r.width) * total));
  }

  function onDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-slab]")) return; // let slabs handle click
    const el = wrapRef.current;
    if (!el) return;
    const startBytes = bytesAt(el, e.clientX);
    const r = el.getBoundingClientRect();
    const startX = ((startBytes / total) * r.width);
    setDragRect({ left: startX, width: 0 });
    function onMove(ev: MouseEvent) {
      const rr = el!.getBoundingClientRect();
      const x = Math.max(0, Math.min(rr.width, ev.clientX - rr.left));
      const left = Math.min(startX, x);
      const width = Math.abs(x - startX);
      setDragRect({ left, width });
    }
    function onUp(ev: MouseEvent) {
      const endBytes = bytesAt(el!, ev.clientX);
      const a = Math.min(startBytes, endBytes);
      const b = Math.max(startBytes, endBytes);
      const size = Math.min(free, b - a);
      if (size >= minSize) {
        const newAlloc =
          onCreate?.(size) ?? {
            id: `alloc-${Date.now()}`,
            label: "New",
            size,
            tone: "custom" as SlabTone,
          };
        onChange?.([...allocations, newAlloc]);
      }
      setDragRect(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    e.preventDefault();
  }

  function removeAlloc(id: string) {
    onChange?.(allocations.filter((a) => a.id !== id));
  }

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {header ? (
        <div className="flex items-baseline justify-between">
          {header}
          <span className="text-xs text-white/50 tabular-nums font-mono">
            {formatBytes(consumed)} / {formatBytes(total)} ·{" "}
            <span className={cn(free < minSize ? "text-rose-300" : "text-emerald-300")}>
              {formatBytes(free)} free
            </span>
          </span>
        </div>
      ) : null}
      <div
        ref={wrapRef}
        onMouseDown={onDown}
        className="relative w-full rounded-lg overflow-hidden bg-white/[0.04] border border-white/10 cursor-crosshair"
        style={{ height }}
      >
        <div className="absolute inset-0 flex">
          {allocations.map((a) => {
            const frac = total > 0 ? a.size / total : 0;
            const color = a.color ?? TONE_COLOR[a.tone ?? "custom"];
            const active = hover === a.id;
            return (
              <motion.div
                key={a.id}
                data-slab
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                initial={{ width: 0 }}
                animate={{ width: `${frac * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                style={{ background: color }}
                className="h-full group/slab relative"
                title={`${a.label ?? a.id}: ${formatBytes(a.size)}`}
              >
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/95",
                    "pointer-events-none",
                  )}
                >
                  {frac > 0.06 ? (a.label ?? formatBytes(a.size)) : null}
                </div>
                {active && onChange ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAlloc(a.id);
                    }}
                    className="absolute top-1/2 right-1 -translate-y-1/2 text-[10px] text-white/90 bg-black/50 rounded px-1"
                    data-slab
                  >
                    ×
                  </button>
                ) : null}
              </motion.div>
            );
          })}
          {free > 0 ? (
            <div
              className="h-full relative"
              style={{ width: `${(free / total) * 100}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/40 pointer-events-none">
                {formatBytes(free)} free — drag to reserve
              </div>
            </div>
          ) : null}
        </div>
        {dragRect ? (
          <div
            className="absolute top-0 bottom-0 bg-fuchsia-400/25 border border-fuchsia-400/70 pointer-events-none"
            style={{ left: dragRect.left, width: dragRect.width }}
          />
        ) : null}
      </div>
    </div>
  );
}
