import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: "purple" | "green" | "amber" | "rose" | "sky";
  shimmer?: boolean;
  indeterminate?: boolean;
  className?: string;
}

const tones = {
  purple: "linear-gradient(90deg,#a855f7,#38bdf8)",
  green: "linear-gradient(90deg,#10b981,#34d399)",
  amber: "linear-gradient(90deg,#f59e0b,#fbbf24)",
  rose: "linear-gradient(90deg,#f43f5e,#fb7185)",
  sky: "linear-gradient(90deg,#0ea5e9,#38bdf8)",
};

export function Progress({
  value = 0,
  max = 100,
  label,
  showValue,
  tone = "purple",
  shimmer,
  indeterminate,
  className,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline mb-1.5">
          {label ? (
            <span className="text-xs text-white/60">{label}</span>
          ) : null}
          {showValue ? (
            <span className="text-xs font-mono text-white tabular-nums">
              {Math.round(pct)}%
            </span>
          ) : null}
        </div>
      )}
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        {indeterminate ? (
          <motion.div
            animate={{ x: ["-60%", "160%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 h-full w-2/5 rounded-full"
            style={{ background: tones[tone] }}
          />
        ) : (
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="relative h-full rounded-full"
            style={{ background: tones[tone] }}
          >
            {shimmer && pct < 100 ? (
              <div className="absolute inset-0 shimmer rounded-full opacity-40" />
            ) : null}
          </motion.div>
        )}
      </div>
    </div>
  );
}
