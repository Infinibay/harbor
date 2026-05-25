import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  selected?: string;
  onSelect?: (id: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function Sidebar({
  sections,
  selected,
  onSelect,
  header,
  footer,
  sticky = false,
  className,
}: SidebarProps) {
  const layoutId = useId();
  return (
    <aside
      className={cn(
        "flex flex-col w-60 shrink-0 bg-[var(--harbor-surface-panel)] text-[rgb(var(--harbor-text))] backdrop-blur-xl border-r border-[color:var(--harbor-border-default)] p-3",
        sticky ? "sticky top-0 h-screen" : "h-full",
        className,
      )}
    >
      {header ? <div className="px-2 pb-3">{header}</div> : null}
      <nav className="flex-1 overflow-auto space-y-4">
        {sections.map((s, i) => (
          <div key={i}>
            {s.label ? (
              <div className="px-2 mb-1 text-[10px] uppercase tracking-wider font-semibold text-[rgb(var(--harbor-text-subtle))]">
                {s.label}
              </div>
            ) : null}
            <ul className="space-y-0.5">
              {s.items.map((it) => {
                const active = selected === it.id;
                return (
                  <li key={it.id}>
                    <motion.a
                      href={it.href}
                      onClick={(e) => {
                        // When a consumer wires onSelect (SPA router.push
                        // etc.), intercept normal left-clicks so the
                        // browser doesn't also trigger a full-page nav on
                        // top of the programmatic route change. Keep
                        // modifier-clicks (ctrl/cmd/middle/shift) alone so
                        // "open in new tab" and "copy link" still work.
                        const isPlainLeftClick =
                          e.button === 0 &&
                          !e.ctrlKey &&
                          !e.metaKey &&
                          !e.shiftKey &&
                          !e.altKey;
                        if (onSelect && isPlainLeftClick) {
                          e.preventDefault();
                        } else if (!it.href) {
                          e.preventDefault();
                        }
                        onSelect?.(it.id);
                      }}
                      whileHover={{ x: 2 }}
                      aria-current={active ? "page" : undefined}
                      data-cursor="button"
                      className={cn(
                        "relative flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
                        active
                          ? "text-[var(--harbor-state-selected-fg)]"
                          : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)]",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId={`${layoutId}-sidebar-active`}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                          className="absolute inset-0 rounded-lg bg-[var(--harbor-state-selected)] border border-[color:var(--harbor-border-default)]"
                        />
                      ) : null}
                      <span className="relative text-[rgb(var(--harbor-text-muted))] grid place-items-center">
                        {it.icon}
                      </span>
                      <span className="relative flex-1 truncate">
                        {it.label}
                      </span>
                      {it.badge ? (
                        <span className="relative">{it.badge}</span>
                      ) : null}
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer ? (
        <div className="pt-3 mt-3 border-t border-[color:var(--harbor-border-subtle)]">{footer}</div>
      ) : null}
    </aside>
  );
}
