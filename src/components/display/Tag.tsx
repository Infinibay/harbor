import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

export interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function Tag({ children, onRemove, icon, className }: TagProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const { nx, ny, localX, localY, proximity } = useCursorProximity(ref, 80);
  const x = useTransform(nx, (v) => v * 1);
  const y = useTransform(ny, (v) => v * 1);
  const glowOpacity = useTransform(proximity, (v) => v * 0.45);
  const glowBg = useTransform(
    [localX, localY] as any,
    ([lx, ly]: any) =>
      `radial-gradient(60px circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.35), transparent 60%)`,
  );
  return (
    <motion.span
      ref={ref}
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={cn(
        "relative overflow-hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/85",
        className,
      )}
    >
      <motion.span
        aria-hidden
        style={{ opacity: glowOpacity, background: glowBg }}
        className="absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-soft-light"
      />
      <span className="relative inline-flex items-center gap-1.5">
        {icon}
        {children}
        {onRemove ? (
          <button
            onClick={onRemove}
            className="text-white/40 hover:text-white text-sm leading-none"
          >
            ×
          </button>
        ) : null}
      </span>
    </motion.span>
  );
}
