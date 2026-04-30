import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatDuration } from "../../lib/format";

export type PipelineStageStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "skipped"
  | "canceled";

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStageStatus;
  startedAt?: Date | string | number;
  /** Duration ms; derived from `startedAt` when running if omitted. */
  duration?: number;
  /** Icon / emoji shown inside the stage node. */
  icon?: string;
  detail?: string;
}

export interface DeploymentPipelineProps {
  stages: readonly PipelineStage[];
  onStageClick?: (stage: PipelineStage) => void;
  /** Orientation — default horizontal, wraps at container edge. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const STATUS_META: Record<
  PipelineStageStatus,
  {
    ring: string;
    dot: string;
    text: string;
    bg: string;
    label: string;
  }
> = {
  pending: {
    ring: "border-white/15",
    dot: "bg-white/20",
    text: "text-white/50",
    bg: "bg-white/[0.02]",
    label: "Pending",
  },
  running: {
    ring: "border-sky-400/60",
    dot: "bg-sky-400",
    text: "text-sky-200",
    bg: "bg-sky-500/10",
    label: "Running",
  },
  success: {
    ring: "border-emerald-400/50",
    dot: "bg-emerald-400",
    text: "text-emerald-200",
    bg: "bg-emerald-500/10",
    label: "Success",
  },
  failed: {
    ring: "border-rose-400/60",
    dot: "bg-rose-400",
    text: "text-rose-200",
    bg: "bg-rose-500/10",
    label: "Failed",
  },
  skipped: {
    ring: "border-white/15",
    dot: "bg-white/20",
    text: "text-white/40",
    bg: "bg-white/[0.02]",
    label: "Skipped",
  },
  canceled: {
    ring: "border-amber-400/50",
    dot: "bg-amber-400",
    text: "text-amber-200",
    bg: "bg-amber-500/10",
    label: "Canceled",
  },
};

function stageDuration(s: PipelineStage): number | undefined {
  if (s.duration !== undefined) return s.duration;
  if (s.status === "running" && s.startedAt) {
    const t = s.startedAt instanceof Date ? s.startedAt.getTime() : new Date(s.startedAt).getTime();
    return Date.now() - t;
  }
  return undefined;
}

/** Horizontal (default) stage pipeline with animated running connectors.
 *  Clicking a stage emits `onStageClick`. */
export function DeploymentPipeline({
  stages,
  onStageClick,
  orientation = "horizontal",
  className,
}: DeploymentPipelineProps) {
  const vertical = orientation === "vertical";
  return (
    <div
      className={cn(
        "flex",
        vertical
          ? "flex-col gap-2"
          : "flex-nowrap items-stretch gap-0 overflow-x-auto pb-2",
        className,
      )}
    >
      {stages.map((s, i) => {
        const meta = STATUS_META[s.status];
        const d = stageDuration(s);
        const prev = stages[i - 1];
        const running = s.status === "running";
        return (
          <div
            key={s.id}
            className={cn(
              "flex",
              vertical ? "flex-row items-center gap-3" : "items-center shrink-0",
            )}
          >
            {i > 0 ? (
              <Connector
                vertical={vertical}
                active={running || prev?.status === "running"}
                tone={prev?.status === "failed" ? "danger" : running ? "info" : "ok"}
              />
            ) : null}
            <button
              onClick={() => onStageClick?.(s)}
              className={cn(
                "group relative px-3 py-2 rounded-lg border flex items-center gap-3 min-w-[140px] text-left",
                meta.ring,
                meta.bg,
                running && "animate-pulse",
              )}
            >
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0",
                  meta.dot,
                )}
              />
              <div className="flex flex-col gap-0 min-w-0">
                <div className="text-xs text-white truncate">{s.name}</div>
                <div
                  className={cn(
                    "text-[10px] uppercase tracking-widest font-semibold",
                    meta.text,
                  )}
                >
                  {meta.label}
                  {d !== undefined ? (
                    <span className="text-white/40 font-mono normal-case tracking-normal ml-1">
                      · {formatDuration(d)}
                    </span>
                  ) : null}
                </div>
                {s.detail ? (
                  <div className="text-[10px] text-white/50 truncate mt-0.5">
                    {s.detail}
                  </div>
                ) : null}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Connector({
  vertical,
  active,
  tone,
}: {
  vertical: boolean;
  active: boolean;
  tone: "ok" | "info" | "danger";
}) {
  const color =
    tone === "danger"
      ? "rgb(244 63 94)"
      : tone === "info"
        ? "rgb(56 189 248)"
        : "rgba(255,255,255,0.3)";
  if (vertical) {
    return (
      <div className="relative h-6 w-5 flex items-center justify-center">
        <span
          className="w-px h-full"
          style={{ background: color, opacity: active ? 1 : 0.4 }}
        />
        {active ? (
          <motion.span
            className="absolute w-px h-2"
            style={{ background: "white", opacity: 0.75 }}
            animate={{ y: ["-12px", "12px"] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <span
        className="h-px w-full"
        style={{ background: color, opacity: active ? 1 : 0.4 }}
      />
      {active ? (
        <motion.span
          className="absolute h-px w-2"
          style={{ background: "white", opacity: 0.75 }}
          animate={{ x: ["-12px", "12px"] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
    </div>
  );
}
