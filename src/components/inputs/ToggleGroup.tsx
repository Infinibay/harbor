import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ToggleItem {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  ariaLabel?: string;
}

export interface ToggleGroupProps {
  items: ToggleItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (v: string | string[]) => void;
  multiple?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ToggleGroup({
  items,
  value,
  defaultValue,
  onChange,
  multiple,
  size = "md",
  className,
}: ToggleGroupProps) {
  const layoutId = useId();
  const [internal, setInternal] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : items[0]?.value ?? ""),
  );
  const current = value ?? internal;
  const isOn = (v: string) =>
    Array.isArray(current) ? current.includes(v) : current === v;

  function toggle(v: string) {
    let next: string | string[];
    if (multiple) {
      const arr = Array.isArray(current) ? current : [];
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    } else {
      next = v;
    }
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  const h = size === "sm" ? "h-8 text-xs" : "h-9 text-sm";

  return (
    <div
      className={cn(
        "inline-flex bg-white/5 border border-white/10 rounded-xl p-0.5",
        className,
      )}
    >
      {items.map((it) => {
        const on = isOn(it.value);
        return (
          <button
            key={it.value}
            aria-label={it.ariaLabel ?? (typeof it.label === "string" ? it.label : it.value)}
            onClick={() => toggle(it.value)}
            className={cn(
              "relative px-3 rounded-lg inline-flex items-center justify-center gap-1.5 font-medium transition-colors",
              h,
              on ? "text-black" : "text-white/65 hover:text-white",
            )}
          >
            {on && !multiple ? (
              <motion.span
                layoutId={`${layoutId}-tg`}
                className="absolute inset-0 rounded-lg bg-white shadow"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            ) : null}
            {on && multiple ? (
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 rounded-lg bg-white shadow"
              />
            ) : null}
            <span className="relative inline-flex items-center gap-1.5">
              {it.icon}
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
