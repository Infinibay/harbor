import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ProgressRing } from "./ProgressRing";
import { formatPercent } from "../../lib/format";

export interface UsageRingProps {
  /** Current consumption (any unit). */
  value: number;
  /** Quota / cap. */
  max: number;
  /** Label inside the ring. Default: formatted percent. */
  label?: ReactNode;
  /** Resource name shown below ("CPU hours", "GB transfer"). */
  name?: string;
  /** Caption shown below — useful for "projected: 22 Apr". */
  caption?: ReactNode;
  /** Warning / danger thresholds as fractions 0..1. Default [0.75, 0.9]. */
  thresholds?: [number, number];
  size?: number;
  stroke?: number;
  className?: string;
}

/** Apple-Watch-ish consumption ring. Extends `ProgressRing` with
 *  Infinibay-semantics — tone shifts amber past 75 %, rose past 90 %. */
export function UsageRing({
  value,
  max,
  label,
  name,
  caption,
  thresholds = [0.75, 0.9],
  size = 112,
  stroke = 10,
  className,
}: UsageRingProps) {
  const fraction = max > 0 ? value / max : 0;
  const [warn, danger] = thresholds;
  const tone: "purple" | "amber" | "rose" =
    fraction >= danger ? "rose" : fraction >= warn ? "amber" : "purple";
  const content = label ?? (
    <span className="flex flex-col items-center gap-0 leading-tight">
      <span className="text-lg font-semibold text-white tabular-nums font-mono">
        {formatPercent(fraction, 0)}
      </span>
      {name ? (
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          {name}
        </span>
      ) : null}
    </span>
  );
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <ProgressRing
        value={fraction * 100}
        size={size}
        stroke={stroke}
        tone={tone}
        label={content}
      />
      {caption ? (
        <span className="text-[11px] text-white/50 text-center max-w-[12rem]">
          {caption}
        </span>
      ) : null}
    </div>
  );
}
