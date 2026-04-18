import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ErrorStateProps {
  title?: ReactNode;
  description?: ReactNode;
  code?: string;
  onRetry?: () => void;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete that request. Try again or report the issue if it persists.",
  code,
  onRetry,
  actions,
  icon = "✕",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] p-6 text-center flex flex-col items-center gap-3",
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-400/40 grid place-items-center text-rose-200 text-xl">
        {icon}
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-sm text-white/55 mt-0.5 max-w-sm mx-auto">{description}</div>
        {code ? (
          <div className="mt-2 inline-block px-2 py-0.5 rounded bg-white/5 border border-white/8 font-mono text-[11px] text-rose-200">
            {code}
          </div>
        ) : null}
      </div>
      <div className="flex gap-2 mt-1">
        {onRetry ? (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-sm"
          >
            Try again
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
