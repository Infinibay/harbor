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
        "group inline-flex items-start gap-3 cursor-pointer select-none",
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
        animate={{
          background: isChecked
            ? "linear-gradient(135deg,#a855f7,#38bdf8)"
            : "rgba(255,255,255,0.03)",
          borderColor: isChecked
            ? "rgba(168, 85, 247, 0.5)"
            : "rgba(255,255,255,0.18)",
        }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative w-5 h-5 rounded-md border flex-shrink-0 grid place-items-center mt-0.5 peer-focus-visible:ring-2 peer-focus-visible:ring-fuchsia-400/60 focus-bloom"
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
              stroke="white"
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
            <span className="text-sm text-white/90 leading-tight">{label}</span>
          ) : null}
          {description ? (
            <span className="text-xs text-white/50 leading-snug">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
