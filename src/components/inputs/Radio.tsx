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
          "flex gap-[var(--harbor-target-gap)]",
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
        "relative flex cursor-pointer select-none items-start gap-[var(--harbor-target-gap)] rounded-[var(--harbor-target-radius)] border p-[var(--harbor-target-panel-padding)] transition-colors",
        checked
          ? "border-[color:var(--harbor-focus-ring)] bg-[var(--harbor-state-selected)]"
          : "border-[color:var(--harbor-border-default)] hover:border-[color:var(--harbor-border-strong)] hover:bg-[var(--harbor-state-hover)]",
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
      <span className="relative w-5 h-5 rounded-full border-2 border-[color:var(--harbor-border-strong)] flex-shrink-0 mt-0.5 peer-focus-visible:shadow-[var(--harbor-focus-shadow)] grid place-items-center">
        <motion.span
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: "linear-gradient(135deg,rgb(var(--harbor-brand)),rgb(var(--harbor-accent-2)))",
          }}
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[length:var(--harbor-target-font-size)] leading-tight text-[rgb(var(--harbor-text))]">{label}</span>
        {description ? (
          <span className="text-xs text-[rgb(var(--harbor-text-muted))] leading-snug">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
