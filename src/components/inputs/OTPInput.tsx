import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  className,
}: OTPInputProps) {
  const [internal, setInternal] = useState(value ?? "");
  const v = (value ?? internal).slice(0, length);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (v.length === length) onComplete?.(v);
  }, [v, length, onComplete]);

  function setValue(next: string) {
    const trimmed = next.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInternal(trimmed);
    onChange?.(trimmed);
  }

  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (v[i]) {
        setValue(v.slice(0, i) + v.slice(i + 1));
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setValue(v.slice(0, i - 1));
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function onInput(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = (v.slice(0, i) + digit + v.slice(i + 1)).slice(0, length);
    setValue(next);
    if (i < length - 1) refs.current[i + 1]?.focus();
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text");
    if (/\d/.test(pasted)) {
      e.preventDefault();
      setValue(pasted);
      const idx = Math.min(pasted.replace(/\D/g, "").length, length - 1);
      refs.current[idx]?.focus();
    }
  }

  const complete = v.length === length;

  return (
    <div className={cn("inline-flex gap-[var(--harbor-target-gap)]", className)}>
      {Array.from({ length }).map((_, i) => {
        const filled = !!v[i];
        return (
          <motion.div
            key={i}
            animate={{
              borderColor: complete
                ? "rgba(74, 222, 128, 0.7)"
                : filled
                  ? "rgba(168, 85, 247, 0.6)"
                  : "var(--harbor-field-border)",
              background: complete
                ? "rgba(34, 197, 94, 0.08)"
                : filled
                  ? "rgba(168, 85, 247, 0.08)"
                  : "var(--harbor-field-bg)",
            }}
            transition={{ duration: 0.2 }}
            className="relative grid h-[calc(var(--harbor-target-input-height)+12px)] w-[calc(var(--harbor-target-input-height)+4px)] place-items-center rounded-[var(--harbor-target-radius)] border"
          >
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={v[i] ?? ""}
              onKeyDown={(e) => onKey(i, e)}
              onChange={(e) => onInput(i, e.target.value)}
              onPaste={onPaste}
              inputMode="numeric"
              maxLength={1}
              className="absolute inset-0 bg-transparent text-center font-mono text-xl font-semibold text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
