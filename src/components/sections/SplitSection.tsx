import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface SplitSectionProps {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  media: ReactNode;
  reverse?: boolean;
  className?: string;
}

/** Alternating media + text section — common for feature pages.
 *
 * Flip sides with `reverse`. Combine multiple SplitSections to build a
 * zigzag feature page. */
export function SplitSection({
  kicker,
  title,
  description,
  children,
  media,
  reverse,
  className,
}: SplitSectionProps) {
  return (
    <section
      className={cn(
        "py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center",
        reverse && "md:[&>:first-child]:order-2",
        className,
      )}
    >
      <div>
        {kicker ? (
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-fuchsia-300/70 mb-3">
            <span className="h-px w-6 bg-fuchsia-300/50" />
            {kicker}
          </div>
        ) : null}
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-white/65 mt-4 leading-relaxed max-w-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
      <div className="relative">{media}</div>
    </section>
  );
}
