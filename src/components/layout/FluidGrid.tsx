import { Children, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useContainerSize } from "../../lib/useContainerSize";

export interface FluidGridProps {
  children: ReactNode;
  /** Minimum width for a child before wrapping to a new column. */
  minItemWidth?: number;
  /** Max number of columns (0 = unlimited). */
  maxColumns?: number;
  gap?: number;
  className?: string;
  /** Animate position changes when columns reflow. */
  animate?: boolean;
}

/** Grid that auto-fits columns based on available width.
 *
 * Uses `grid-template-columns: repeat(auto-fit, minmax(minWidth, 1fr))`
 * so children naturally reflow at any container width. Re-renders ONLY
 * when the computed column count actually changes (not on every pixel),
 * so Framer Motion's `layout` animations get a clean delta to animate.
 */
export function FluidGrid({
  children,
  minItemWidth = 220,
  maxColumns = 0,
  gap = 16,
  className,
  animate = true,
}: FluidGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Re-render on every resize tick to keep FM's cached position fresh,
  // but animate only when the computed column count actually changes.
  const { width } = useContainerSize(ref);
  const raw = width
    ? Math.max(1, Math.floor((width + gap) / (minItemWidth + gap)))
    : 1;
  const cols = maxColumns > 0 ? Math.min(raw, maxColumns) : raw;

  return (
    <div
      ref={ref}
      className={cn("grid w-full", className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {Children.map(children, (child, i) =>
        animate ? (
          <motion.div
            key={(child as { key?: React.Key })?.key ?? i}
            layout
            layoutDependency={cols}
            transition={{
              layout: { type: "spring", stiffness: 260, damping: 30, duration: 0.5 },
            }}
            className="min-w-0"
          >
            {child}
          </motion.div>
        ) : (
          child
        ),
      )}
    </div>
  );
}
