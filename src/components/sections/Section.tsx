import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface SectionProps {
  id?: string;
  kicker?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  spacing?: "compact" | "default" | "loose";
  children?: ReactNode;
  className?: string;
}

const spacings = {
  compact: "py-6",
  default: "py-12",
  loose: "py-20",
};

/** A titled content block — use as the building block of a page.
 *
 * Kicker (small label) → title (large) → description (muted) → children.
 * Actions slot on the right (on the left if `align="center"`). */
export function Section({
  id,
  kicker,
  title,
  description,
  actions,
  align = "left",
  spacing = "default",
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn(spacings[spacing], className)}>
      {(kicker || title || description || actions) && (
        <header
          className={cn(
            "flex gap-4 mb-8",
            align === "center"
              ? "flex-col items-center text-center"
              : "items-start justify-between flex-wrap",
          )}
        >
          <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
            {kicker ? (
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-fuchsia-300/70 mb-3">
                <span className="h-px w-6 bg-fuchsia-300/50" />
                {kicker}
              </div>
            ) : null}
            {title ? (
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white leading-tight">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-white/60 mt-2 leading-relaxed">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className={cn("flex gap-2", align === "center" && "justify-center")}>
              {actions}
            </div>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
