import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      maxChars,
      className,
      id,
      onFocus,
      onBlur,
      onChange,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [focus, setFocus] = useState(false);
    const [internal, setInternal] = useState(
      (defaultValue as string) ?? (value as string) ?? "",
    );
    const current = value !== undefined ? (value as string) : internal;
    const count = current.length;
    const pct = maxChars ? Math.min(1, count / maxChars) : 0;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className={cn(
            "relative flex flex-col rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] text-[color:var(--harbor-field-fg)] transition-all",
            "border-[color:var(--harbor-field-border)]",
            focus && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
          )}
        >
          {label ? (
            <span className="px-[var(--harbor-target-control-padding-x)] pt-[var(--harbor-target-control-padding-y)] text-xs text-[color:var(--harbor-field-muted-fg)]">{label}</span>
          ) : null}
          <textarea
            ref={ref}
            id={inputId}
            data-cursor="text"
            value={value}
            defaultValue={defaultValue}
            onFocus={(e) => {
              setFocus(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocus(false);
              onBlur?.(e);
            }}
            onChange={(e) => {
              if (value === undefined) setInternal(e.target.value);
              onChange?.(e);
            }}
            className={cn(
              "min-h-[90px] resize-y appearance-none bg-transparent p-[var(--harbor-target-control-padding-x)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]",
              label && "pt-1",
              className,
            )}
            {...rest}
          />
          {maxChars ? (
            <div className="flex items-center gap-2 px-[var(--harbor-target-control-padding-x)] pb-[var(--harbor-target-control-padding-y)]">
              <div className="flex-1 h-1 rounded-full bg-[var(--harbor-state-hover)] overflow-hidden">
                <motion.div
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      pct > 0.9
                        ? "rgb(var(--harbor-danger))"
                        : "linear-gradient(90deg, rgb(var(--harbor-accent)), rgb(var(--harbor-accent-2)))",
                  }}
                />
              </div>
              <span className="text-[10px] text-[color:var(--harbor-text-tertiary)] font-mono tabular-nums">
                {count}/{maxChars}
              </span>
            </div>
          ) : null}
        </label>
      </div>
    );
  },
);
