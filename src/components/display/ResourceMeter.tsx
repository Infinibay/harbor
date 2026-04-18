import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface Resource {
  label: string;
  /** 0..100 (percent). */
  value: number;
  /** e.g. "4.2 / 8 GB" — shown on the right in rows layout. */
  detail?: string;
  icon?: ReactNode;
  /** [warning, danger]. Default [70, 90]. */
  threshold?: [number, number];
}

export interface ResourceMeterProps {
  resources: Resource[];
  /** `rows` (default) = stacked full-width bars. `compact` = one-line inline chips. */
  layout?: "rows" | "compact";
  className?: string;
}

type Tone = "normal" | "warn" | "danger";

function tone(value: number, threshold?: [number, number]): Tone {
  const [w, d] = threshold ?? [70, 90];
  if (value >= d) return "danger";
  if (value >= w) return "warn";
  return "normal";
}

const barGrad: Record<Tone, string> = {
  normal: "from-emerald-400 to-emerald-300",
  warn: "from-amber-400 to-amber-300",
  danger: "from-rose-400 to-rose-300",
};
const compactBar: Record<Tone, string> = {
  normal: "bg-emerald-400",
  warn: "bg-amber-400",
  danger: "bg-rose-400",
};
const textTone: Record<Tone, string> = {
  normal: "text-white/80",
  warn: "text-amber-300",
  danger: "text-rose-300",
};

/** Stacked bars for CPU / RAM / Disk (or anything else). Thresholds
 *  recolor each bar into amber/rose as usage climbs. */
export function ResourceMeter({
  resources,
  layout = "rows",
  className,
}: ResourceMeterProps) {
  if (layout === "compact") {
    return (
      <div className={cn("flex items-center gap-4 flex-wrap", className)}>
        {resources.map((r) => {
          const t = tone(r.value, r.threshold);
          const pct = Math.min(100, Math.max(0, r.value));
          return (
            <div key={r.label} className="flex items-center gap-2 min-w-0">
              {r.icon ? (
                <span className="text-white/60 shrink-0">{r.icon}</span>
              ) : null}
              <span className="text-xs text-white/60 shrink-0">{r.label}</span>
              <div className="w-16 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  className={cn("h-full rounded-full", compactBar[t])}
                />
              </div>
              <span
                className={cn(
                  "text-xs tabular-nums font-mono shrink-0",
                  textTone[t],
                )}
              >
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {resources.map((r) => {
        const t = tone(r.value, r.threshold);
        const pct = Math.min(100, Math.max(0, r.value));
        return (
          <div key={r.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/70">
                {r.icon}
                <span>{r.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {r.detail ? (
                  <span className="text-white/40 tabular-nums font-mono">
                    {r.detail}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "tabular-nums font-mono w-12 text-right",
                    textTone[t],
                  )}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  barGrad[t],
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
