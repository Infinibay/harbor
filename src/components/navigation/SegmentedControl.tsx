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
        "relative inline-flex rounded-xl border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] p-0.5",
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
              "relative flex-1 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors whitespace-nowrap outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
              active
                ? "text-[var(--harbor-state-selected-fg)]"
                : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`${id}-seg`}
                className="absolute inset-0 rounded-lg border border-[color:var(--harbor-focus-ring)] bg-[var(--harbor-state-selected)] shadow-[var(--harbor-target-shadow)]"
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
