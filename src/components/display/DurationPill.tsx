import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { formatDuration, type FormatDurationOptions } from "../../lib/format";

export interface DurationPillProps {
  /** Start of the interval. Required. */
  from: Date | string | number;
  /** End of the interval. Omit + set `auto` to render live elapsed time. */
  to?: Date | string | number;
  /** Re-render every N ms to keep "uptime 2h 34m" live. Default off (0). */
  auto?: number | boolean;
  /** Passed through to `formatDuration`. */
  options?: FormatDurationOptions;
  /** Label in front of the duration ("uptime", "ran for", etc.). */
  prefix?: string;
  className?: string;
  /** Tone hint — affects the chip color. */
  tone?: "default" | "success" | "warn" | "danger" | "info";
}

const TONE_CLASSES: Record<NonNullable<DurationPillProps["tone"]>, string> = {
  default: "bg-white/[0.05] border-white/10 text-white/75",
  success: "bg-emerald-500/10 border-emerald-400/30 text-emerald-200",
  warn: "bg-amber-500/10 border-amber-400/30 text-amber-200",
  danger: "bg-rose-500/10 border-rose-400/30 text-rose-200",
  info: "bg-sky-500/10 border-sky-400/30 text-sky-200",
};

function toMs(v: Date | string | number): number {
  return v instanceof Date ? v.getTime() : new Date(v).getTime();
}

/** A small pill that renders an elapsed duration. When `auto` is set,
 *  it ticks to stay live — useful for uptime / "running for X" badges. */
export function DurationPill({
  from,
  to,
  auto = false,
  options,
  prefix,
  tone = "default",
  className,
}: DurationPillProps) {
  const [, tick] = useState(0);

  useEffect(() => {
    if (!auto) return;
    const interval = typeof auto === "number" ? auto : 30_000;
    const id = window.setInterval(() => tick((n) => n + 1), interval);
    return () => window.clearInterval(id);
  }, [auto]);

  const endMs = to !== undefined ? toMs(to) : Date.now();
  const duration = endMs - toMs(from);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs tabular-nums font-mono",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {prefix ? (
        <span className="uppercase tracking-wider text-[10px] opacity-60 font-sans">
          {prefix}
        </span>
      ) : null}
      {formatDuration(duration, options)}
    </span>
  );
}
