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
        "inline-flex items-center justify-center rounded-lg font-medium select-none relative transition-colors",
        sizes[size],
        pressed
          ? "bg-fuchsia-500/20 border border-fuchsia-400/40 text-white"
          : "bg-white/[0.04] border border-white/10 text-white/75 hover:text-white hover:bg-white/[0.08]",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
      {children}
      {pressed ? (
        <span className="absolute inset-0 rounded-lg pointer-events-none ring-1 ring-fuchsia-400/50 shadow-[0_0_12px_-2px_rgba(168,85,247,0.5)]" />
      ) : null}
    </motion.button>
  );
}
