import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
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
  // Support both controlled (`checked`) and uncontrolled
  // (`defaultChecked` only) modes. In uncontrolled mode we drive the
  // track + knob position off internal state so the visual updates on
  // click — otherwise `isOn` was always undefined and the knob stayed
  // stuck regardless of what the user pressed.
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isOn = isControlled ? checked : internal;
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  }
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
        "inline-flex cursor-pointer select-none items-start gap-[var(--harbor-target-gap)]",
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="sr-only peer"
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        onChange={handleChange}
        {...rest}
      />
      <motion.span
        ref={trackRef}
        style={{
          width: w,
          height: h,
          background: isOn
            ? "linear-gradient(135deg,rgb(var(--harbor-brand)),rgb(var(--harbor-accent-2)))"
            : "var(--harbor-field-bg)",
        }}
        className="relative rounded-full flex-shrink-0 border border-[color:var(--harbor-field-border)] peer-focus-visible:shadow-[var(--harbor-focus-shadow)] overflow-hidden"
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          aria-hidden
          style={{ opacity: glow }}
          className="absolute inset-0 rounded-full pointer-events-none"
        >
          <span className="absolute inset-0 rounded-full bg-[rgb(var(--harbor-brand-fg)/0.24)] blur-sm" />
        </motion.span>
        <motion.span
          animate={{ x: isOn ? w - h : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="absolute top-0.5 left-0.5 block"
        >
          <motion.span
            style={{ x: nudge, width: h - 4, height: h - 4 }}
            className="block rounded-full bg-[rgb(var(--harbor-brand-fg))] shadow-md"
          />
        </motion.span>
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
