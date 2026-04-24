import { useEffect, useState } from "react";
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
  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

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
        <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      ) : null}
      <div className="flex items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-fuchsia-400/60 transition-colors">
        <button
          type="button"
          data-cursor="button"
          onClick={() => set(current - step)}
          className="w-10 h-11 grid place-items-center text-white/60 hover:bg-white/5 text-lg"
        >
          −
        </button>
        <div className="flex-1 min-w-0 h-11 relative overflow-hidden">
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
              className="absolute inset-0 flex items-center justify-center font-mono text-white text-sm tabular-nums whitespace-nowrap px-1"
            >
              {current}
              {unit ? (
                <span className="text-white/40 ms-1">{unit}</span>
              ) : null}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          type="button"
          data-cursor="button"
          onClick={() => set(current + step)}
          className="w-10 h-11 grid place-items-center text-white/60 hover:bg-white/5 text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}
