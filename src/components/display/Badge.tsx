import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "purple";

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  pulse?: boolean;
  icon?: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: "bg-white/10 text-white/80 border-white/10",
  success: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  danger: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  info: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  purple: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30",
};

const dotColors: Record<Tone, string> = {
  neutral: "bg-white/60",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-rose-400",
  info: "bg-sky-400",
  purple: "bg-fuchsia-400",
};

export function Badge({
  children,
  tone = "neutral",
  pulse,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        tones[tone],
        className,
      )}
    >
      {pulse ? (
        <span className="relative inline-flex w-1.5 h-1.5">
          <motion.span
            className={cn("absolute inset-0 rounded-full", dotColors[tone])}
            animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <span
            className={cn("relative w-1.5 h-1.5 rounded-full", dotColors[tone])}
          />
        </span>
      ) : null}
      {icon}
      {children}
    </span>
  );
}
