import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Tooltip } from "../overlays/Tooltip";

export interface RailItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export interface RailSidebarProps {
  items: RailItem[];
  value?: string;
  onChange?: (id: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Narrow icon-only sidebar rail (VS Code activity bar / Discord server
 *  list). Hover shows labels via Tooltip. */
export function RailSidebar({
  items,
  value,
  onChange,
  header,
  footer,
  className,
}: RailSidebarProps) {
  return (
    <aside
      className={cn(
        "w-14 h-full flex flex-col items-center py-3 gap-1 rounded-2xl bg-[var(--harbor-surface-panel)] border border-[color:var(--harbor-border-default)]",
        className,
      )}
    >
      {header ? <div className="mb-2">{header}</div> : null}
      <div className="flex-1 flex flex-col gap-1">
        {items.map((it) => (
          <Tooltip key={it.id} content={it.label} side="right">
            <button
              onClick={() => onChange?.(it.id)}
              aria-label={it.label}
              data-cursor="button"
              className={cn(
                "relative w-10 h-10 rounded-xl grid place-items-center transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
                value === it.id
                  ? "bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
                  : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)]",
              )}
            >
              {value === it.id ? (
                <span className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[var(--harbor-focus-ring)]" />
              ) : null}
              {it.icon}
              {it.badge ? (
                <span className="absolute -top-0.5 -right-0.5">{it.badge}</span>
              ) : null}
            </button>
          </Tooltip>
        ))}
      </div>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </aside>
  );
}
