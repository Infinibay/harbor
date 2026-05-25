import { Fragment, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface Crumb {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 text-sm text-[rgb(var(--harbor-text-muted))] min-w-0",
        className,
      )}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            <a
              href={c.href}
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[var(--harbor-state-hover)] transition-colors min-w-0 truncate outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
                last
                  ? "text-[rgb(var(--harbor-text))]"
                  : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]",
              )}
            >
              {c.icon}
              <span className="truncate">{c.label}</span>
            </a>
            {!last ? (
              <span className="text-[rgb(var(--harbor-text-subtle))] select-none shrink-0">›</span>
            ) : null}
          </Fragment>
        );
      })}
    </nav>
  );
}
