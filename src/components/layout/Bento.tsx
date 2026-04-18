import { Children, isValidElement, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useContainerSize } from "../../lib/useContainerSize";
import { useFlipOnChange } from "../../lib/useFlipOnChange";

type Span = {
  col?: number;
  row?: number;
};

type Responsive<T> = T | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", T>>;

export interface BentoItemProps {
  span?: Responsive<Span>;
  children: ReactNode;
  className?: string;
}

export interface BentoProps {
  children: ReactNode;
  /** Number of columns per breakpoint (container width). */
  columns?: Responsive<number>;
  gap?: number;
  className?: string;
}

const bentoBreakpoints = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

type Step = keyof typeof bentoBreakpoints;

function stepForWidth(width: number): Step {
  if (width >= bentoBreakpoints.xl) return "xl";
  if (width >= bentoBreakpoints.lg) return "lg";
  if (width >= bentoBreakpoints.md) return "md";
  if (width >= bentoBreakpoints.sm) return "sm";
  return "base";
}

function resolveForStep<T>(value: Responsive<T>, step: Step): T {
  if (value === null || value === undefined) return value as T;
  if (typeof value !== "object") return value as T;
  const steps: Step[] = ["xl", "lg", "md", "sm", "base"];
  const entries = value as Partial<Record<Step, T>>;
  const startIdx = steps.indexOf(step);
  for (let i = startIdx === -1 ? 0 : startIdx; i < steps.length; i++) {
    if (entries[steps[i]] !== undefined) return entries[steps[i]] as T;
  }
  return (entries.base ?? Object.values(entries)[0]) as T;
}

/** Bento-style grid with complex, responsive item spans.
 *
 * Wrap each child in `<BentoItem span={{ base: {col:2, row:1}, md: {col:3, row:2} }}>`
 * to control how many columns/rows it occupies per breakpoint (measured
 * on the container, not the viewport). Tiles animate to their new
 * positions when the container crosses a breakpoint — including during
 * a slow continuous window-drag.
 */
export function Bento({
  children,
  columns = { base: 2, md: 4, lg: 6 },
  gap = 12,
  className,
}: BentoProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { width } = useContainerSize(ref);
  const step = stepForWidth(width);
  const cols = resolveForStep(columns, step);

  useFlipOnChange(ref, step);

  return (
    <div
      ref={ref}
      className={cn("grid w-full", className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: "minmax(80px, auto)",
      }}
    >
      {Children.map(children, (child, i) => {
        if (!isValidElement<BentoItemProps>(child)) return child;
        const span = resolveForStep(child.props.span ?? {}, step) ?? {};
        const col = Math.min(span.col ?? 1, cols);
        const row = span.row ?? 1;
        const key = child.key ?? i;
        return (
          <div
            key={key}
            data-flip={String(key)}
            className={cn("min-w-0", child.props.className)}
            style={{
              gridColumn: `span ${col}`,
              gridRow: `span ${row}`,
            }}
          >
            {child.props.children}
          </div>
        );
      })}
    </div>
  );
}

/** Slot inside `Bento` — spans are resolved per container width. */
export function BentoItem({ children }: BentoItemProps) {
  return <>{children}</>;
}
