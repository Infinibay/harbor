import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface NumberFieldProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (v: number) => void;
  label?: string;
  unit?: string;
  className?: string;
}

export function NumberField({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  label,
  unit,
  className,
}: NumberFieldProps) {
  const [internal, setInternal] = useState(value ?? defaultValue);
  const current = value ?? internal;
  const [last, setLast] = useState(current);

  function set(v: number) {
    const clamped = Math.min(max, Math.max(min, v));
    setLast(current);
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  }

  const trending = current > last ? "up" : current < last ? "down" : "eq";

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label className="block text-xs text-[color:var(--harbor-field-muted-fg)] mb-1.5">{label}</label>
      ) : null}
      <div className="flex min-h-[var(--harbor-target-input-height)] items-center overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] text-[color:var(--harbor-field-fg)] transition-colors focus-within:border-[color:var(--harbor-field-border-focus)] focus-within:bg-[var(--harbor-field-bg-focus)]">
        <button
          type="button"
          data-cursor="button"
          onClick={() => set(current - step)}
          className="grid h-[var(--harbor-target-input-height)] w-[var(--harbor-target-input-height)] place-items-center text-lg text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
        >
          −
        </button>
        <div className="relative h-[var(--harbor-target-input-height)] min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={current}
              initial={{
                y: trending === "up" ? 18 : trending === "down" ? -18 : 0,
                opacity: 0,
              }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: trending === "up" ? -18 : 18,
                opacity: 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-1 font-mono text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] tabular-nums"
            >
              {current}
              {unit ? (
                <span className="text-[color:var(--harbor-text-tertiary)] ms-1">{unit}</span>
              ) : null}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          type="button"
          data-cursor="button"
          onClick={() => set(current + step)}
          className="grid h-[var(--harbor-target-input-height)] w-[var(--harbor-target-input-height)] place-items-center text-lg text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
        >
          +
        </button>
      </div>
    </div>
  );
}
