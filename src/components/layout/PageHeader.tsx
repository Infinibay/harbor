import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  align?: "start" | "center";
  className?: string;
}

/** App-page heading container for dashboards, admin screens, settings,
 *  and workspaces. Pair with `Page`, `AppShell`, and `ResponsiveGrid` so
 *  product pages do not need to hand-roll header flex layouts. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  align = "start",
  className,
}: PageHeaderProps) {
  const centered = align === "center";
  return (
    <header
      className={cn(
        "flex gap-4",
        centered
          ? "flex-col items-center text-center"
          : "items-start justify-between",
        className,
      )}
    >
      <div className={cn("min-w-0", centered && "max-w-2xl")}>
        {eyebrow ? (
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-300/70">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-white/60 md:text-base">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3">{meta}</div> : null}
      </div>
      {actions ? (
        <div className={cn("flex shrink-0 items-center gap-2", centered && "justify-center")}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
