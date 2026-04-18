import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface SegmentedItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  items: SegmentedItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onChange,
  size = "md",
  className,
}: SegmentedControlProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? internal;

  const h = size === "sm" ? "h-8 text-xs" : "h-9 text-sm";

  return (
    <div
      className={cn(
        "relative inline-flex bg-white/5 border border-white/10 rounded-xl p-0.5",
        h,
        className,
      )}
    >
      {items.map((it) => {
        const active = current === it.value;
        return (
          <button
            key={it.value}
            onClick={() => {
              if (value === undefined) setInternal(it.value);
              onChange?.(it.value);
            }}
            data-cursor="button"
            className={cn(
              "relative flex-1 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors whitespace-nowrap",
              active ? "text-black" : "text-white/65 hover:text-white",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`${id}-seg`}
                className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
