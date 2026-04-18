import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FeatureCardProps {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  href?: string;
  linkLabel?: string;
  accent?: "fuchsia" | "sky" | "emerald" | "amber" | "rose";
  className?: string;
}

const accents = {
  fuchsia: {
    bg: "bg-fuchsia-500/10 border-fuchsia-400/25",
    text: "text-fuchsia-300",
  },
  sky: { bg: "bg-sky-500/10 border-sky-400/25", text: "text-sky-300" },
  emerald: {
    bg: "bg-emerald-500/10 border-emerald-400/25",
    text: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-500/10 border-amber-400/25",
    text: "text-amber-300",
  },
  rose: { bg: "bg-rose-500/10 border-rose-400/25", text: "text-rose-300" },
};

export function FeatureCard({
  icon,
  title,
  description,
  href,
  linkLabel = "Learn more →",
  accent = "fuchsia",
  className,
}: FeatureCardProps) {
  const a = accents[accent];
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/[0.03] border border-white/8 p-5 flex flex-col gap-3 hover:border-white/20 transition-colors",
        className,
      )}
    >
      {icon ? (
        <div
          className={cn(
            "w-10 h-10 rounded-xl grid place-items-center border text-xl",
            a.bg,
            a.text,
          )}
        >
          {icon}
        </div>
      ) : null}
      <h4 className="text-white font-semibold text-base tracking-tight">
        {title}
      </h4>
      <p className="text-sm text-white/65 leading-relaxed flex-1">
        {description}
      </p>
      {href ? (
        <a
          href={href}
          data-cursor="button"
          className={cn(
            "text-sm font-medium mt-1",
            a.text,
            "hover:brightness-125",
          )}
        >
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
