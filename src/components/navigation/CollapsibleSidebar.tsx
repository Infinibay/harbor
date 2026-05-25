import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Tooltip } from "../overlays/Tooltip";

export interface CollapsibleSidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export interface CollapsibleSidebarSection {
  label?: string;
  items: CollapsibleSidebarItem[];
}

export interface CollapsibleSidebarProps {
  sections: CollapsibleSidebarSection[];
  value?: string;
  onChange?: (id: string) => void;
  defaultCollapsed?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Sidebar with an expand/collapse toggle.
 *
 * Collapsed state hides labels and shows icons only with tooltips. Width
 * animates between 56px and 240px. */
export function CollapsibleSidebar({
  sections,
  value,
  onChange,
  defaultCollapsed = false,
  header,
  footer,
  className,
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const width = collapsed ? 56 : 240;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: "spring", stiffness: 400, damping: 36 }}
      className={cn(
        "h-full flex flex-col gap-2 bg-[var(--harbor-surface-panel)] border-r border-[color:var(--harbor-border-default)] overflow-hidden",
        className,
      )}
    >
      <div className="px-2 py-3 flex items-center justify-between gap-2">
        {!collapsed && header ? (
          <div className="flex-1 min-w-0">{header}</div>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          data-cursor="button"
          className="w-8 h-8 grid place-items-center rounded-lg text-[rgb(var(--harbor-text-muted))] outline-none hover:text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)] focus-visible:shadow-[var(--harbor-focus-shadow)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              d={
                collapsed
                  ? "M6 4l4 4-4 4"
                  : "M10 4l-4 4 4 4"
              }
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 flex flex-col gap-3">
        {sections.map((s, si) => (
          <div key={si} className="flex flex-col gap-0.5">
            {s.label && !collapsed ? (
              <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--harbor-text-subtle))] px-2 pt-1 pb-1">
                {s.label}
              </div>
            ) : null}
            {s.items.map((it) => {
              const active = value === it.id;
              const btn = (
                <button
                  type="button"
                  onClick={() => onChange?.(it.id)}
                  aria-current={active ? "page" : undefined}
                  data-cursor="button"
                  className={cn(
                    "relative w-full flex items-center gap-3 rounded-lg text-left text-sm transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
                    collapsed ? "h-10 justify-center px-0" : "h-9 px-2",
                    active
                      ? "bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
                      : "text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
                  )}
                >
                  {active && !collapsed ? (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[var(--harbor-focus-ring)]" />
                  ) : null}
                  <span className="shrink-0">{it.icon}</span>
                  {!collapsed ? (
                    <>
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.badge ? <span>{it.badge}</span> : null}
                    </>
                  ) : null}
                </button>
              );
              return collapsed ? (
                <Tooltip key={it.id} content={it.label} side="right">
                  {btn}
                </Tooltip>
              ) : (
                <span key={it.id}>{btn}</span>
              );
            })}
          </div>
        ))}
      </div>

      {footer ? (
        <div className={cn("px-2 py-3 border-t border-[color:var(--harbor-border-subtle)]", collapsed && "flex justify-center")}>
          {footer}
        </div>
      ) : null}
    </motion.aside>
  );
}
