import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatDuration } from "../../lib/format";

export type BootStageStatus = "pending" | "running" | "done" | "failed" | "skipped";

export interface BootStage {
  id: string;
  label: string;
  status: BootStageStatus;
  /** Duration in ms (for done/failed). */
  duration?: number;
  detail?: string;
}

export interface BootSequenceProps {
  stages: readonly BootStage[];
  className?: string;
}

const STATUS_META: Record<
  BootStageStatus,
  { color: string; dot: string; label: string }
> = {
  pending: { color: "text-white/35", dot: "bg-white/20", label: "pending" },
  running: { color: "text-sky-300", dot: "bg-sky-400", label: "running" },
  done: { color: "text-emerald-300", dot: "bg-emerald-400", label: "done" },
  failed: { color: "text-rose-300", dot: "bg-rose-400", label: "failed" },
  skipped: { color: "text-white/40", dot: "bg-white/30", label: "skipped" },
};

/** Vertical timeline of boot stages (BIOS → kernel → init → services).
 *  Running stages pulse; failed stages get a clear red accent. */
export function BootSequence({ stages, className }: BootSequenceProps) {
  return (
    <ol className={cn("flex flex-col gap-0 relative pl-6", className)}>
      {stages.map((s, i) => {
        const meta = STATUS_META[s.status];
        return (
          <li key={s.id} className="relative py-2">
            {i < stages.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[-13.5px] top-5 bottom-0 w-px bg-white/10"
              />
            ) : null}
            <motion.span
              aria-hidden
              className={cn(
                "absolute left-[-18px] top-3 w-3 h-3 rounded-full",
                meta.dot,
              )}
              animate={s.status === "running" ? { scale: [1, 1.3, 1] } : undefined}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-white">{s.label}</span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest font-semibold",
                  meta.color,
                )}
              >
                {meta.label}
              </span>
              {s.duration !== undefined ? (
                <span className="text-xs text-white/40 tabular-nums font-mono">
                  {formatDuration(s.duration, { includeMs: true })}
                </span>
              ) : null}
            </div>
            {s.detail ? (
              <div className="text-xs text-white/55 mt-0.5 font-mono">
                {s.detail}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
