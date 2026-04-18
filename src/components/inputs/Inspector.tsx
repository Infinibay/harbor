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
        "flex flex-col divide-y divide-white/5 bg-[#12121a] border border-white/8 rounded-xl overflow-hidden",
        className,
      )}
    >
      {sections.map((s) => {
        const collapsed = state[s.id];
        return (
          <div key={s.id}>
            <button
              onClick={() =>
                setState((p) => ({ ...p, [s.id]: !p[s.id] }))
              }
              className="w-full flex items-center gap-2 px-3 h-8 text-[11px] uppercase tracking-wider font-semibold text-white/55 hover:text-white hover:bg-white/[0.02] transition-colors"
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
                  <div className="px-3 pb-3 pt-1 space-y-2">{s.children}</div>
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
      <span className="text-white/55 truncate">{label}</span>
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
    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-md focus-within:border-fuchsia-400/60 h-7 px-1">
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
        className="flex-1 min-w-0 bg-transparent outline-none px-1.5 text-white text-xs font-mono tabular-nums"
      />
      {unit ? (
        <span className="text-[10px] text-white/40 font-mono mr-1">
          {unit}
        </span>
      ) : null}
    </div>
  );
}
