import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatDuration } from "../../lib/format";

export interface LiveMigrationIndicatorProps {
  sourceHost: ReactNode;
  destHost: ReactNode;
  /** Progress 0..1. */
  progress: number;
  /** Estimated time remaining, ms. */
  etaMs?: number;
  /** Arrow color. Default fuchsia. */
  color?: string;
  /** Extra metadata shown below ("memory copying…"). */
  detail?: ReactNode;
  className?: string;
}

/** Source → Destination migration progress with a pulsing dashed arrow,
 *  progress bar and ETA. Pure SVG + DOM — works as a sibling anywhere. */
export function LiveMigrationIndicator({
  sourceHost,
  destHost,
  progress,
  etaMs,
  color = "rgb(168 85 247)",
  detail,
  className,
}: LiveMigrationIndicatorProps) {
  const pct = Math.max(0, Math.min(1, progress));
  const [, tick] = useState(0);
  useEffect(() => {
    if (etaMs == null) return;
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [etaMs]);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3",
        className,
      )}
    >
      <div className="flex-1 text-right text-sm text-white/85 truncate">
        {sourceHost}
      </div>
      <div className="flex-[2] min-w-[200px]">
        <svg viewBox="0 0 300 40" className="w-full h-10">
          <defs>
            <marker
              id="lm-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          </defs>
          {/* Track */}
          <line
            x1={10}
            y1={20}
            x2={290}
            y2={20}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Progress */}
          <motion.line
            x1={10}
            y1={20}
            x2={10 + 280 * pct}
            y2={20}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#lm-arrow)"
          />
          {/* Flowing dash overlay */}
          <line
            x1={10}
            y1={20}
            x2={10 + 280 * pct}
            y2={20}
            stroke="white"
            strokeOpacity={0.5}
            strokeWidth={1}
            strokeDasharray="4 8"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from={0}
              to={-12}
              dur="0.6s"
              repeatCount="indefinite"
            />
          </line>
        </svg>
        <div className="text-xs text-white/50 flex items-center justify-between tabular-nums font-mono mt-0.5">
          <span>{(pct * 100).toFixed(0)}%</span>
          {etaMs != null ? <span>ETA {formatDuration(etaMs)}</span> : <span />}
        </div>
        {detail ? (
          <div className="text-[11px] text-white/40 mt-0.5 text-center">{detail}</div>
        ) : null}
      </div>
      <div className="flex-1 text-left text-sm text-white/85 truncate">
        {destHost}
      </div>
    </div>
  );
}
