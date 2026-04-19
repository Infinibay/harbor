import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatPercent } from "../../lib/format";

export interface QuotaSegment {
  /** Segment label shown in tooltip. */
  label: string;
  /** Segment size, same unit as `total`. */
  value: number;
  tone?: "used" | "reserved" | "free" | "warn" | "danger" | "info";
  color?: string;
}

export interface QuotaBarProps {
  segments: readonly QuotaSegment[];
  total: number;
  /** Soft limit indicator at this fraction (0..1). Dotted vertical line. */
  soft?: number;
  /** Hard limit at this fraction (0..1). Solid vertical line. Default 1. */
  hard?: number;
  /** Text label rendered above (e.g. "8.2 / 16 GB · 51%"). Default auto. */
  label?: string;
  /** Height in px. Default 14. */
  height?: number;
  formatValue?: (v: number) => string;
  className?: string;
}

const TONE_COLOR: Record<NonNullable<QuotaSegment["tone"]>, string> = {
  used: "rgb(168 85 247)",
  reserved: "rgb(56 189 248)",
  free: "rgba(255,255,255,0.1)",
  warn: "rgb(251 191 36)",
  danger: "rgb(244 63 94)",
  info: "rgb(56 189 248)",
};

/** Segmented horizontal bar: used / reserved / free / whatever.
 *  Supports soft + hard limit indicators (dotted + solid lines). */
export function QuotaBar({
  segments,
  total,
  soft,
  hard = 1,
  label,
  height = 14,
  formatValue = (v) => v.toFixed(1),
  className,
}: QuotaBarProps) {
  const [hover, setHover] = useState<number | null>(null);

  const consumed = segments.reduce((s, seg) => s + seg.value, 0);
  const pct = total > 0 ? consumed / total : 0;
  const displayLabel =
    label ?? `${formatValue(consumed)} / ${formatValue(total)} · ${formatPercent(pct, 0)}`;

  return (
    <div className={cn("w-full flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{displayLabel}</span>
        {hover !== null ? (
          <span className="text-white/50 tabular-nums font-mono">
            {segments[hover].label}: {formatValue(segments[hover].value)}
          </span>
        ) : null}
      </div>
      <div
        className="relative w-full rounded-full overflow-hidden bg-white/[0.06]"
        style={{ height }}
      >
        <div className="absolute inset-0 flex">
          {segments.map((seg, i) => {
            const frac = total > 0 ? seg.value / total : 0;
            const color = seg.color ?? TONE_COLOR[seg.tone ?? "used"];
            return (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${frac * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22, delay: i * 0.04 }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ background: color }}
                className="h-full"
                title={`${seg.label}: ${formatValue(seg.value)}`}
              />
            );
          })}
        </div>
        {soft !== undefined ? (
          <span
            className="absolute top-0 bottom-0 border-l border-dashed border-amber-300/60 pointer-events-none"
            style={{ left: `${soft * 100}%` }}
            title={`Soft limit · ${formatPercent(soft, 0)}`}
          />
        ) : null}
        {hard !== undefined && hard < 1.001 ? (
          <span
            className="absolute top-0 bottom-0 border-l border-rose-400/70 pointer-events-none"
            style={{ left: `${hard * 100}%` }}
            title={`Hard limit · ${formatPercent(hard, 0)}`}
          />
        ) : null}
      </div>
    </div>
  );
}
