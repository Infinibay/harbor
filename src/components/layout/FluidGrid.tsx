import { Children, useCallback, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useContainerDerived } from "../../lib/useContainerSize";

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

  // Derive the expected column count from container width. Only triggers
  // a re-render when the count actually changes.
  const compute = useCallback(
    ({ width }: { width: number }) => {
      if (!width) return 1;
      const raw = Math.max(1, Math.floor((width + gap) / (minItemWidth + gap)));
      return maxColumns > 0 ? Math.min(raw, maxColumns) : raw;
    },
    [minItemWidth, maxColumns, gap],
  );
  const cols = useContainerDerived(ref, compute);

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
