import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../display/Spinner";

export interface LoadingOverlayProps {
  label?: ReactNode;
  /** Determinate progress. When provided, renders `done / total` and a
   *  proportional bar beneath the label. */
  progress?: { done: number; total: number };
  /** Stretch to fill the parent and center content. Useful when placed
   *  as the sole child of a Card body during a long operation. */
  fill?: boolean;
  size?: number;
  className?: string;
}

/** Centered spinner + label + optional progress bar. Use as a single
 *  child during bulk operations (template apply, batch delete, long
 *  fetches) to avoid mid-flight re-renders of the real content.
 *
 *   <LoadingOverlay label="Applying profile…" progress={{done:3,total:12}} />
 */
export function LoadingOverlay({
  label,
  progress,
  fill,
  size = 24,
  className,
}: LoadingOverlayProps) {
  const pct =
    progress && progress.total > 0
      ? Math.min(100, Math.max(0, (progress.done / progress.total) * 100))
      : null;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 px-4",
        fill && "min-h-[200px] w-full",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} />
      {label ? <div className="text-sm text-white/70">{label}</div> : null}
      {progress ? (
        <div className="flex flex-col items-center gap-1.5 w-full max-w-xs">
          <div className="text-xs text-white/45 tabular-nums font-mono">
            {progress.done} / {progress.total}
          </div>
          <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${pct ?? 0}%`,
                background: "linear-gradient(90deg,#a855f7,#38bdf8)",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
