import { useId, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
}

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  className,
  id,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const isChecked = checked;

  return (
    <label
      htmlFor={inputId}
      data-cursor="button"
      className={cn(
        "group inline-flex cursor-pointer select-none items-start gap-[var(--harbor-target-gap)]",
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        {...rest}
      />
      <motion.span
        style={{
          background: isChecked
            ? "linear-gradient(135deg,rgb(var(--harbor-brand)),rgb(var(--harbor-accent-2)))"
            : "var(--harbor-field-bg)",
          borderColor: isChecked
            ? "var(--harbor-focus-ring)"
            : "var(--harbor-field-border)",
        }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative mt-0.5 grid h-[var(--harbor-target-icon-size)] w-[var(--harbor-target-icon-size)] flex-shrink-0 place-items-center rounded-[calc(var(--harbor-target-radius)/2)] border peer-focus-visible:shadow-[var(--harbor-focus-shadow)]"
      >
        <AnimatePresence>
          {isChecked ? (
            <motion.svg
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(var(--harbor-brand-fg))"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M5 12 L10 17 L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22 }}
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </motion.span>

      {label || description ? (
        <span className="flex flex-col gap-0.5">
          {label ? (
            <span className="text-[length:var(--harbor-target-font-size)] leading-tight text-[rgb(var(--harbor-text))]">{label}</span>
          ) : null}
          {description ? (
            <span className="text-xs text-[rgb(var(--harbor-text-muted))] leading-snug">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
