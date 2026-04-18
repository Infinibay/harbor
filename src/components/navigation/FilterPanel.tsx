import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type?: "checkbox" | "radio";
  options: FilterOption[];
  defaultExpanded?: boolean;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  value: Record<string, string[]>;
  onChange: (v: Record<string, string[]>) => void;
  onClear?: () => void;
  title?: ReactNode;
  className?: string;
}

/** Faceted filter panel — typical for search results, catalog pages. */
export function FilterPanel({
  groups,
  value,
  onChange,
  onClear,
  title = "Filters",
  className,
}: FilterPanelProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(groups.filter((g) => g.defaultExpanded !== false).map((g) => g.id)),
  );

  function toggleGroup(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleOption(group: FilterGroup, option: string) {
    const current = value[group.id] ?? [];
    const isActive = current.includes(option);
    let next: string[];
    if (group.type === "radio") {
      next = isActive ? [] : [option];
    } else {
      next = isActive ? current.filter((v) => v !== option) : [...current, option];
    }
    onChange({ ...value, [group.id]: next });
  }

  const totalApplied = Object.values(value).reduce((s, arr) => s + arr.length, 0);

  return (
    <aside
      className={cn(
        "w-64 rounded-2xl bg-white/[0.02] border border-white/8 p-4 flex flex-col gap-1 h-full",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-white">{title}</div>
        {totalApplied > 0 && onClear ? (
          <button
            onClick={onClear}
            className="text-xs text-fuchsia-300 hover:text-fuchsia-200"
          >
            Clear ({totalApplied})
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {groups.map((g) => {
          const selected = value[g.id] ?? [];
          const open = expanded.has(g.id);
          return (
            <div key={g.id} className="border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
              <button
                onClick={() => toggleGroup(g.id)}
                className="w-full flex items-center justify-between text-sm text-white/80 hover:text-white py-1"
              >
                <span className="inline-flex items-center gap-2">
                  {g.label}
                  {selected.length ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 font-mono">
                      {selected.length}
                    </span>
                  ) : null}
                </span>
                <motion.span
                  animate={{ rotate: open ? 0 : -90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="text-white/40 text-xs"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-1 flex flex-col gap-1">
                      {g.options.map((o) => {
                        const isOn = selected.includes(o.value);
                        return (
                          <label
                            key={o.value}
                            className="flex items-center gap-2 py-0.5 cursor-pointer text-sm group"
                          >
                            <input
                              type={g.type === "radio" ? "radio" : "checkbox"}
                              name={g.id}
                              checked={isOn}
                              onChange={() => toggleOption(g, o.value)}
                              className="accent-fuchsia-500 w-3.5 h-3.5"
                            />
                            <span
                              className={cn(
                                "flex-1 truncate",
                                isOn ? "text-white" : "text-white/70",
                                "group-hover:text-white",
                              )}
                            >
                              {o.label}
                            </span>
                            {o.count !== undefined ? (
                              <span className="text-[11px] text-white/40 font-mono tabular-nums">
                                {o.count}
                              </span>
                            ) : null}
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
