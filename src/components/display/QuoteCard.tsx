import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "./Avatar";

export interface QuoteCardProps {
  quote: ReactNode;
  author?: { name: string; role?: ReactNode; avatar?: string };
  accent?: "fuchsia" | "sky" | "emerald" | "amber";
  className?: string;
}

const accents: Record<NonNullable<QuoteCardProps["accent"]>, string> = {
  fuchsia: "text-fuchsia-300/70",
  sky: "text-sky-300/70",
  emerald: "text-emerald-300/70",
  amber: "text-amber-300/70",
};

export function QuoteCard({
  quote,
  author,
  accent = "fuchsia",
  className,
}: QuoteCardProps) {
  return (
    <figure
      className={cn(
        "relative rounded-2xl bg-white/[0.03] border border-white/8 p-6",
        className,
      )}
    >
      <svg
        aria-hidden
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="currentColor"
        className={cn("absolute top-4 left-5 opacity-60", accents[accent])}
      >
        <path d="M9.352 10c-2.948 0-5.352 2.404-5.352 5.352V22h6.352v-6.648H6.648c0-1.5 1.204-2.704 2.704-2.704V10zm13 0c-2.948 0-5.352 2.404-5.352 5.352V22h6.352v-6.648h-3.704c0-1.5 1.204-2.704 2.704-2.704V10z" />
      </svg>
      <blockquote className="relative pl-10 text-white text-base md:text-lg leading-relaxed font-medium">
        {quote}
      </blockquote>
      {author ? (
        <figcaption className="mt-5 pl-10 flex items-center gap-3">
          <Avatar name={author.name} size="sm" />
          <div>
            <div className="text-sm text-white font-medium">{author.name}</div>
            {author.role ? (
              <div className="text-xs text-white/50">{author.role}</div>
            ) : null}
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}
