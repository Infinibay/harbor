import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface NoteCardProps {
  children: ReactNode;
  title?: ReactNode;
  color?: "yellow" | "pink" | "sky" | "green" | "purple";
  author?: ReactNode;
  date?: ReactNode;
  tilt?: number;
  className?: string;
}

const palettes = {
  yellow: {
    bg: "bg-[#3a330f]",
    border: "border-amber-400/30",
    accent: "text-amber-200",
  },
  pink: {
    bg: "bg-[#3a1230]",
    border: "border-fuchsia-400/30",
    accent: "text-fuchsia-200",
  },
  sky: {
    bg: "bg-[#0f2a3a]",
    border: "border-sky-400/30",
    accent: "text-sky-200",
  },
  green: {
    bg: "bg-[#0f3025]",
    border: "border-emerald-400/30",
    accent: "text-emerald-200",
  },
  purple: {
    bg: "bg-[#25163a]",
    border: "border-violet-400/30",
    accent: "text-violet-200",
  },
};

export function NoteCard({
  children,
  title,
  color = "yellow",
  author,
  date,
  tilt = 0,
  className,
}: NoteCardProps) {
  const p = palettes[color];
  return (
    <div
      className={cn(
        "rounded-xl p-4 border shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] relative",
        p.bg,
        p.border,
        className,
      )}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      {title ? (
        <div className={cn("text-xs uppercase tracking-wider mb-2", p.accent)}>
          {title}
        </div>
      ) : null}
      <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
      {author || date ? (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          {author ? <span>{author}</span> : <span />}
          {date ? <span>{date}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
