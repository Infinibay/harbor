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
        "flex flex-col w-60 shrink-0 rounded-2xl bg-surface-1/85 backdrop-blur-xl border border-white/10 p-3",
        sticky ? "sticky top-0 h-screen" : "h-full",
        className,
      )}
    >
      {header ? <div className="px-2 pb-3">{header}</div> : null}
      <nav className="flex-1 overflow-auto space-y-4">
        {sections.map((s, i) => (
          <div key={i}>
            {s.label ? (
              <div className="px-2 mb-1 text-[10px] uppercase tracking-wider font-semibold text-white/35">
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
                        if (!it.href) e.preventDefault();
                        onSelect?.(it.id);
                      }}
                      whileHover={{ x: 2 }}
                      data-cursor="button"
                      className={cn(
                        "relative flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                        active
                          ? "text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5",
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
                          className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                        />
                      ) : null}
                      <span className="relative text-white/70 grid place-items-center">
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
        <div className="pt-3 mt-3 border-t border-white/8">{footer}</div>
      ) : null}
    </aside>
  );
}
