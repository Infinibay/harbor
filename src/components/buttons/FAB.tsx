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
    "text-white bg-gradient-to-br from-fuchsia-500 to-sky-500 shadow-[0_12px_40px_-8px_rgba(168,85,247,0.55)]",
  secondary:
    "text-white bg-[#1c1c26] border border-white/10 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]",
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
        "rounded-full grid place-items-center z-50",
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
