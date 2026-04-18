import { Children, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useContainerSize } from "../../lib/useContainerSize";
import { useFlipOnChange } from "../../lib/useFlipOnChange";

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
 * snapping. Grow it and they slide back up. Works for both discrete
 * resizes and slow continuous window-drags via a manual FLIP transition
 * triggered on ~64px width buckets.
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
  const { width } = useContainerSize(ref);
  const widthBucket = Math.round(width / 64);

  useFlipOnChange(ref, widthBucket);

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
      {Children.map(children, (child, i) => {
        const key = (child as { key?: React.Key })?.key ?? i;
        return (
          <div key={key} data-flip={String(key)}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
