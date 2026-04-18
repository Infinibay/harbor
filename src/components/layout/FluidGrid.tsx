import { Children, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useContainerSize } from "../../lib/useContainerSize";
import { useFlipOnChange } from "../../lib/useFlipOnChange";

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
 * Uses `grid-template-columns: repeat(N, 1fr)` where N is computed from
 * the container width and `minItemWidth`. When N changes, a manual FLIP
 * transition animates each child from its previous cell to the new one
 * — works equally well for discrete and slow continuous-drag resizes.
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
  const { width } = useContainerSize(ref);
  const raw = width
    ? Math.max(1, Math.floor((width + gap) / (minItemWidth + gap)))
    : 1;
  const cols = maxColumns > 0 ? Math.min(raw, maxColumns) : raw;

  useFlipOnChange(ref, animate ? cols : null);

  return (
    <div
      ref={ref}
      className={cn("grid w-full", className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {Children.map(children, (child, i) => {
        const key = (child as { key?: React.Key })?.key ?? i;
        return (
          <div key={key} data-flip={animate ? String(key) : undefined} className="min-w-0">
            {child}
          </div>
        );
      })}
    </div>
  );
}
