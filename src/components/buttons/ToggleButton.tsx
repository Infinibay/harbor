import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

export interface ToggleButtonProps {
  pressed: boolean;
  onChange?: (pressed: boolean) => void;
  icon?: ReactNode;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-7 px-2 text-xs gap-1.5",
  md: "h-9 px-3 text-sm gap-2",
  lg: "h-11 px-4 text-base gap-2",
};

export function ToggleButton({
  pressed,
  onChange,
  icon,
  children,
  size = "md",
  disabled,
  className,
}: ToggleButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { nx, ny } = useCursorProximity(ref, 100);
  const x = useTransform(nx, (v) => v * 1.5);
  const y = useTransform(ny, (v) => v * 1.5);

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onChange?.(!pressed)}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      data-cursor="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium select-none relative border outline-none transition-colors focus-visible:shadow-[var(--harbor-focus-shadow)]",
        sizes[size],
        pressed
          ? "border-[color:var(--harbor-focus-ring)] bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
          : "border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
      {children}
      {pressed ? (
        <span className="absolute inset-0 rounded-lg pointer-events-none shadow-[0_0_0_1px_var(--harbor-focus-ring),0_0_14px_-4px_rgb(var(--harbor-accent)/0.58)]" />
      ) : null}
    </motion.button>
  );
}
