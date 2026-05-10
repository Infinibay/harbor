import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useFormField } from "./FormField";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  valid?: boolean;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      hint,
      error,
      valid,
      icon,
      suffix,
      className,
      id,
      onFocus,
      onBlur,
      value,
      defaultValue,
      placeholder,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const ff = useFormField();
    const inputId = id ?? ff?.id ?? autoId;
    const [focus, setFocus] = useState(false);
    const [internal, setInternal] = useState(
      (defaultValue as string) ?? (value as string) ?? "",
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as string) : internal;
    const filled = currentValue.length > 0;
    const floated = focus || filled;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className={cn(
            "relative flex min-h-[var(--harbor-target-input-height)] items-center rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] text-[color:var(--harbor-field-fg)] transition-all",
            "border-[color:var(--harbor-field-border)]",
            focus && !error && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
            error && "border-rose-400/60",
            valid && !error && "border-emerald-400/50",
          )}
        >
          {icon ? (
            <span className="grid place-items-center ps-[var(--harbor-target-control-padding-x)] text-[color:var(--harbor-field-muted-fg)]">
              {icon}
            </span>
          ) : null}

          {label ? (
            <motion.span
              initial={false}
              animate={{
                y: floated ? -22 : 0,
                scale: floated ? 0.82 : 1,
                x: floated ? -4 : 0,
                color: focus
                  ? "rgb(var(--harbor-accent))"
                  : "rgb(var(--harbor-text-muted))",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "absolute",
                left: icon ? 40 : "var(--harbor-target-control-padding-x)",
                top: "50%",
                translate: "0 -50%",
                pointerEvents: "none",
                transformOrigin: "left center",
                background: floated ? "rgb(var(--harbor-bg-elev-1))" : "transparent",
                padding: floated ? "0 4px" : "0",
                fontSize: 14,
                zIndex: 1,
              }}
            >
              {label}
            </motion.span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={ff?.describedBy}
            aria-invalid={error || ff?.invalid ? true : undefined}
            aria-required={ff?.required || undefined}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              if (!isControlled) setInternal(e.target.value);
              rest.onChange?.(e);
            }}
            onFocus={(e) => {
              setFocus(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocus(false);
              onBlur?.(e);
            }}
            placeholder={floated ? placeholder : ""}
            data-cursor="text"
            className={cn(
              "flex-1 appearance-none bg-transparent py-[var(--harbor-target-control-padding-y)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]",
              icon ? "ps-3" : "px-4",
              !icon && "px-[var(--harbor-target-control-padding-x)]",
              suffix || valid || error
                ? "pe-3"
                : "pe-[var(--harbor-target-control-padding-x)]",
              className,
            )}
            {...rest}
          />

          <div className="pe-3 flex items-center gap-2 text-[color:var(--harbor-field-muted-fg)]">
            <AnimatePresence>
              {valid && !error ? (
                <motion.svg
                  key="ok"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(74, 222, 128)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 12 L10 17 L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.svg>
              ) : null}
              {error ? (
                <motion.svg
                  key="err"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(244, 63, 94)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M12 8v5M12 17v.5M12 3l10 18H2Z" />
                </motion.svg>
              ) : null}
            </AnimatePresence>
            {suffix}
          </div>
        </label>

        <AnimatePresence>
          {error ? (
            <motion.p
              key="err-txt"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="text-xs mt-1.5 text-rose-300"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs mt-1.5 text-white/40"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
