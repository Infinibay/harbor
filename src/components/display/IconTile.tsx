import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "sky" | "green" | "purple" | "amber" | "rose";
type Size = "sm" | "md" | "lg";

export interface IconTileProps {
  icon: ReactNode;
  tone?: Tone;
  size?: Size;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "bg-white/8 text-white/70 border-white/10",
  sky: "bg-sky-500/15 text-sky-200 border-sky-400/25",
  green: "bg-emerald-500/15 text-emerald-200 border-emerald-400/25",
  purple: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/25",
  amber: "bg-amber-500/15 text-amber-200 border-amber-400/25",
  rose: "bg-rose-500/15 text-rose-200 border-rose-400/25",
};

const sizeStyles: Record<Size, string> = {
  sm: "w-8 h-8 rounded-md text-base",
  md: "w-10 h-10 rounded-lg text-lg",
  lg: "w-12 h-12 rounded-xl text-xl",
};

export function IconTile({
  icon,
  tone = "neutral",
  size = "md",
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center border shrink-0",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
      aria-hidden
    >
      {icon}
    </span>
  );
}
