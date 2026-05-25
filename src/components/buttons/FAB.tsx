import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

export interface FABProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  size?: "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
}

const positions = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
  none: "",
};

const sizes = {
  md: "w-12 h-12 text-lg",
  lg: "w-14 h-14 text-xl",
};

const variants = {
  primary:
    "bg-[rgb(var(--harbor-brand))] text-[rgb(var(--harbor-brand-fg))] shadow-[0_12px_40px_-8px_rgb(var(--harbor-brand)/0.42)] hover:bg-[rgb(var(--harbor-accent-2))]",
  secondary:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text))] shadow-[0_12px_30px_-8px_rgb(var(--harbor-bg)/0.35)] hover:bg-[var(--harbor-state-hover)]",
};

export function FAB({
  icon,
  label,
  onClick,
  position = "bottom-right",
  size = "md",
  variant = "primary",
  className,
}: FABProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { nx, ny } = useCursorProximity(ref, 140);
  const x = useTransform(nx, (v) => v * 3);
  const y = useTransform(ny, (v) => v * 3);

  return (
    <motion.button
      ref={ref}
      aria-label={label}
      onClick={onClick}
      data-cursor="button"
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "rounded-full grid place-items-center z-50 outline-none transition-colors focus-visible:shadow-[var(--harbor-focus-shadow)]",
        sizes[size],
        variants[variant],
        positions[position],
        className,
      )}
    >
      {icon}
    </motion.button>
  );
}
