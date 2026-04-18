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
            "relative flex flex-col rounded-xl border transition-all bg-white/5",
            "border-white/10",
            focus && "border-fuchsia-400/60 bg-white/[0.07]",
          )}
        >
          {label ? (
            <span className="text-xs text-white/50 px-4 pt-3">{label}</span>
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
              "bg-transparent outline-none p-4 text-white placeholder:text-white/30 resize-y min-h-[90px]",
              label && "pt-1",
              className,
            )}
            {...rest}
          />
          {maxChars ? (
            <div className="px-4 pb-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      pct > 0.9
                        ? "rgb(244, 63, 94)"
                        : "linear-gradient(90deg, #a855f7, #38bdf8)",
                  }}
                />
              </div>
              <span className="text-[10px] text-white/40 font-mono tabular-nums">
                {count}/{maxChars}
              </span>
            </div>
          ) : null}
        </label>
      </div>
    );
  },
);
