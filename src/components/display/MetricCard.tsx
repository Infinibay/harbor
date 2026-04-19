import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Sparkline } from "../charts/Sparkline";
import { formatPercent } from "../../lib/format";

export interface MetricCardProps {
  label: string;
  /** Pre-formatted value (callers format how they want). */
  value: ReactNode;
  /** Unit label rendered muted next to the value. */
  unit?: string;
  /** Percent change vs some prior period — controls the up/down chip. */
  delta?: number;
  /** Sparkline data, if any. */
  series?: number[];
  icon?: ReactNode;
  /** [warning, danger] thresholds evaluated against `raw` (or `value`
   *  when it's a number). Drives the border/spark color. */
  threshold?: [number, number];
  /** Numeric value for threshold comparison (when `value` is a ReactNode). */
  raw?: number;
  /** Reverse threshold logic — lower is worse (e.g. cache hit rate). */
  inverseThreshold?: boolean;
  className?: string;
  onClick?: () => void;
}

type Tone = "normal" | "warn" | "danger";

function tone(raw: number | undefined, threshold: [number, number] | undefined, inverse: boolean): Tone {
  if (raw === undefined || !threshold) return "normal";
  const [w, d] = threshold;
  if (inverse) {
    if (raw <= d) return "danger";
    if (raw <= w) return "warn";
    return "normal";
  }
  if (raw >= d) return "danger";
  if (raw >= w) return "warn";
  return "normal";
}

/** Stat + sparkline + delta chip + threshold coloring.
 *
 * Designed for dashboards — pass a `series` for the mini trend and a
 * `threshold` to light the card up when the value crosses warning/danger
 * bands. */
export function MetricCard({
  label,
  value,
  unit,
  delta,
  series,
  icon,
  threshold,
  raw,
  inverseThreshold,
  className,
  onClick,
}: MetricCardProps) {
  const numericRaw =
    typeof raw === "number"
      ? raw
      : typeof value === "number"
        ? (value as number)
        : undefined;
  const t = tone(numericRaw, threshold, Boolean(inverseThreshold));
  const ring: Record<Tone, string> = {
    normal: "border-white/8",
    warn: "border-amber-400/40 shadow-[0_0_40px_-10px_rgba(251,191,36,0.35)]",
    danger: "border-rose-400/50 shadow-[0_0_40px_-10px_rgba(244,63,94,0.45)]",
  };
  const sparkStroke: Record<Tone, string> = {
    normal: "rgb(168 85 247)",
    warn: "rgb(251 191 36)",
    danger: "rgb(244 63 94)",
  };
  const sparkFill: Record<Tone, string> = {
    normal: "rgba(168,85,247,0.22)",
    warn: "rgba(251,191,36,0.22)",
    danger: "rgba(244,63,94,0.25)",
  };

  const positive = (delta ?? 0) >= 0;
  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <Wrapper
      onClick={onClick}
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white/[0.03] p-4 flex flex-col gap-2 text-left w-full",
        ring[t],
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/55">
          {icon ? <span className="text-white/70">{icon}</span> : null}
          {label}
        </div>
        {delta !== undefined ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded-md",
              positive
                ? "text-emerald-300 bg-emerald-500/10"
                : "text-rose-300 bg-rose-500/10",
            )}
          >
            {positive ? "↑" : "↓"} {formatPercent(Math.abs(delta) / 100, 1)}
          </motion.span>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold tabular-nums font-mono text-white leading-none">
          {value}
          {unit ? (
            <span className="text-white/40 text-base font-normal ml-1">
              {unit}
            </span>
          ) : null}
        </div>
        {series && series.length > 1 ? (
          <Sparkline
            data={series}
            width={96}
            height={36}
            stroke={sparkStroke[t]}
            fill={sparkFill[t]}
          />
        ) : null}
      </div>
    </Wrapper>
  );
}
