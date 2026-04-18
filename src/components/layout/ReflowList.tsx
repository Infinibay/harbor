import { Children, useRef, type ReactNode } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "../../lib/cn";
import { useContainerSize } from "../../lib/useContainerSize";

export interface ReflowListProps {
  children: ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  /** Items wrap when they don't fit. The one being pushed to a new row
   *  animates into place. */
  wrap?: boolean;
  className?: string;
}

/** Horizontal list of items that wrap on overflow, with smooth position
 *  animations as elements are pushed between rows.
 *
 * Classic use: a toolbar / chip row / avatar stack / nav items. Shrink the
 * container and the last items slide down into the next row instead of
 * snapping. Grow it and they slide back up.
 *
 * Uses a combination of:
 *   - flex-wrap for the CSS layout
 *   - ResizeObserver to force re-render on width changes
 *   - Framer Motion `layout` + `LayoutGroup` so each child animates
 *     between its old and new position.
 */
export function ReflowList({
  children,
  gap = 8,
  align = "center",
  justify = "start",
  wrap = true,
  className,
}: ReflowListProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useContainerSize(ref);

  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <LayoutGroup>
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          wrap && "flex-wrap",
          alignMap[align],
          justifyMap[justify],
          className,
        )}
        style={{ gap }}
      >
        {Children.map(children, (child, i) => (
          <motion.div
            key={(child as { key?: React.Key })?.key ?? i}
            layout
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
}
