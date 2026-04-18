import { createContext, useContext, useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Ctx = {
  name: string;
  value: string;
  onChange: (v: string) => void;
};
const RadioCtx = createContext<Ctx | null>(null);

export interface RadioGroupProps {
  value: string;
  onChange: (v: string) => void;
  name?: string;
  children: ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  value,
  onChange,
  name,
  children,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  const autoName = useId();
  return (
    <RadioCtx.Provider value={{ name: name ?? autoName, value, onChange }}>
      <div
        role="radiogroup"
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className,
        )}
      >
        {children}
      </div>
    </RadioCtx.Provider>
  );
}

export interface RadioProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({
  value,
  label,
  description,
  disabled,
  className,
}: RadioProps) {
  const ctx = useContext(RadioCtx);
  if (!ctx) throw new Error("<Radio> must be inside <RadioGroup>");
  const checked = ctx.value === value;

  return (
    <label
      data-cursor="button"
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-colors",
        checked
          ? "border-fuchsia-400/50 bg-fuchsia-500/10"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.onChange(value)}
        className="sr-only peer"
      />
      <span className="relative w-5 h-5 rounded-full border-2 border-white/25 flex-shrink-0 mt-0.5 peer-focus-visible:ring-2 peer-focus-visible:ring-fuchsia-400/60 grid place-items-center">
        <motion.span
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: "linear-gradient(135deg,#a855f7,#38bdf8)",
          }}
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-white leading-tight">{label}</span>
        {description ? (
          <span className="text-xs text-white/50 leading-snug">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
