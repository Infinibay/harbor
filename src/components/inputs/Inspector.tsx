import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface InspectorSection {
  id: string;
  title: string;
  icon?: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
}

export interface InspectorProps {
  sections: InspectorSection[];
  className?: string;
}

export function Inspector({ sections, className }: InspectorProps) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, !!s.collapsed])),
  );
  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-[color:var(--harbor-field-border)] overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-workbench-panel-bg)]",
        className,
      )}
    >
      {sections.map((s) => {
        const collapsed = state[s.id];
        return (
          <div key={s.id}>
            <button
              type="button"
              aria-expanded={!collapsed}
              onClick={() =>
                setState((p) => ({ ...p, [s.id]: !p[s.id] }))
              }
              className="flex h-[calc(var(--harbor-target-control-height)-8px)] w-full items-center gap-2 px-[var(--harbor-target-control-padding-x)] text-[11px] font-semibold uppercase tracking-wider text-[color:var(--harbor-field-muted-fg)] transition-colors hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]"
            >
              <motion.svg
                animate={{ rotate: collapsed ? -90 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" />
              </motion.svg>
              {s.icon}
              <span className="flex-1 text-left">{s.title}</span>
            </button>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.div
                  key="b"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-[var(--harbor-target-gap)] px-[var(--harbor-target-panel-padding)] pb-[var(--harbor-target-panel-padding)] pt-1">{s.children}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function PropertyRow({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "grid grid-cols-[90px_1fr] items-center gap-2 text-xs",
        className,
      )}
    >
      <span className="truncate text-[color:var(--harbor-field-muted-fg)]">{label}</span>
      <div className="min-w-0">{children}</div>
    </label>
  );
}

/** A compact number input meant for property panels. */
export function InspectorNumber({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="relative flex min-h-[calc(var(--harbor-target-input-height)-8px)] items-center rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-1 focus-within:border-[color:var(--harbor-field-border-focus)]">
      <input
        type="number"
        value={value}
        onChange={(e) => {
          let v = Number(e.target.value);
          if (min !== undefined) v = Math.max(min, v);
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        step={step}
        className="min-w-0 flex-1 bg-transparent px-1.5 font-mono text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] tabular-nums outline-none"
      />
      {unit ? (
        <span className="mr-1 font-mono text-[10px] text-[color:var(--harbor-field-muted-fg)]">
          {unit}
        </span>
      ) : null}
    </div>
  );
}
