import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TimelineEvent {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time: string;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const toneColors = {
  neutral: "bg-white/10 text-white/70",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  info: "bg-sky-500/15 text-sky-300 border-sky-400/30",
};

export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      <span className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/10 to-transparent" />
      {events.map((e, i) => (
        <motion.li
          key={e.id}
          layout
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          <div
            className={cn(
              "relative z-[1] w-8 h-8 rounded-full border grid place-items-center shrink-0",
              toneColors[e.tone ?? "neutral"],
            )}
          >
            {e.icon ?? (
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-white font-medium">{e.title}</div>
              <div className="text-xs text-white/40 whitespace-nowrap">
                {e.time}
              </div>
            </div>
            {e.description ? (
              <div className="text-xs text-white/55 mt-0.5">
                {e.description}
              </div>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
