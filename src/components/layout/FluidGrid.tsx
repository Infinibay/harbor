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
 * so children naturally reflow at any container width. A ResizeObserver
 * re-renders on width changes so Framer Motion's `layout` animations
 * pick up the new positions smoothly.
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
  // width is read for its side-effect (forces re-render on resize → Framer
  // Motion re-measures and animates to the new position).
  useContainerSize(ref);

  const cols = maxColumns > 0 ? `repeat(${maxColumns}, 1fr)` : undefined;

  return (
    <div
      ref={ref}
      className={cn("grid w-full", className)}
      style={{
        gap,
        gridTemplateColumns:
          cols ??
          `repeat(auto-fit, minmax(min(100%, ${minItemWidth}px), 1fr))`,
      }}
    >
      {Children.map(children, (child, i) =>
        animate ? (
          <motion.div
            key={(child as { key?: React.Key })?.key ?? i}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
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
