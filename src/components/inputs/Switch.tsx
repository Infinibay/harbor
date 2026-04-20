import { useId, useRef, type InputHTMLAttributes } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

export function Switch({
  label,
  description,
  size = "md",
  checked,
  defaultChecked,
  onChange,
  className,
  id,
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const isOn = checked;
  const h = size === "sm" ? 20 : 26;
  const w = size === "sm" ? 34 : 46;
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const { nx, proximity } = useCursorProximity(trackRef, 60);
  const nudge = useTransform(nx, (v) => v * 1);
  const glow = useTransform(proximity, (v) => v * 0.5);

  return (
    <label
      htmlFor={inputId}
      data-cursor="button"
      className={cn(
        "inline-flex items-start gap-3 cursor-pointer select-none",
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
        ref={trackRef}
        animate={{
          background: isOn
            ? "linear-gradient(135deg,#a855f7,#38bdf8)"
            : "rgb(var(--harbor-text) / 0.18)",
        }}
        style={{ width: w, height: h }}
        className="relative rounded-full flex-shrink-0 peer-focus-visible:ring-2 peer-focus-visible:ring-fuchsia-400/60 focus-bloom overflow-hidden"
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          aria-hidden
          style={{ opacity: glow }}
          className="absolute inset-0 rounded-full pointer-events-none"
        >
          <span className="absolute inset-0 rounded-full bg-white/30 blur-sm" />
        </motion.span>
        <motion.span
          animate={{ x: isOn ? w - h : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="absolute top-0.5 left-0.5 block"
        >
          <motion.span
            style={{ x: nudge, width: h - 4, height: h - 4 }}
            className="block rounded-full bg-white shadow-md"
          />
        </motion.span>
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
