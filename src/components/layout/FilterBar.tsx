import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FilterDef {
  id: string;
  label: string;
  options: string[];
}

export interface AppliedFilter {
  id: string;
  label: string;
  value: string;
}

export interface FilterBarProps {
  filters: FilterDef[];
  applied: AppliedFilter[];
  onChange: (applied: AppliedFilter[]) => void;
  className?: string;
}

export function FilterBar({
  filters,
  applied,
  onChange,
  className,
}: FilterBarProps) {
  const [picking, setPicking] = useState<string | null>(null);

  function addFilter(filter: FilterDef, value: string) {
    const next: AppliedFilter[] = [
      ...applied.filter((a) => a.id !== filter.id),
      { id: filter.id, label: filter.label, value },
    ];
    onChange(next);
    setPicking(null);
  }
  function remove(id: string) {
    onChange(applied.filter((a) => a.id !== id));
  }

  const pickingFilter = picking ? filters.find((f) => f.id === picking) : null;

  return (
    <motion.div
      layout
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <AnimatePresence initial={false}>
        {applied.map((a) => (
          <motion.span
            key={a.id}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-fuchsia-500/12 border border-fuchsia-400/30 text-xs"
          >
            <span className="text-fuchsia-200/80">{a.label}:</span>
            <span className="text-white">{a.value}</span>
            <button
              onClick={() => remove(a.id)}
              className="text-fuchsia-300/60 hover:text-white"
            >
              ×
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      {pickingFilter ? (
        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1"
        >
          <span className="text-xs text-white/60 pl-2 pr-1">
            {pickingFilter.label}:
          </span>
          {pickingFilter.options.map((o) => (
            <button
              key={o}
              onClick={() => addFilter(pickingFilter, o)}
              className="px-2 h-6 rounded-full text-xs text-white hover:bg-white/10"
            >
              {o}
            </button>
          ))}
          <button
            onClick={() => setPicking(null)}
            className="px-2 h-6 text-white/40 hover:text-white text-xs"
          >
            cancel
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="relative">
          <button
            onClick={() => {
              const first = filters.find(
                (f) => !applied.some((a) => a.id === f.id),
              );
              if (first) setPicking(first.id);
            }}
            disabled={applied.length === filters.length}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-dashed border-white/15 hover:border-white/30 text-xs text-white/65 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-sm">+</span> Add filter
          </button>
          {applied.length === 0 ? null : (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange([])}
              className="ml-1 text-xs text-white/40 hover:text-white"
            >
              clear all
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function _FilterBarSlot(_: { children?: ReactNode }) {
  return null;
}
