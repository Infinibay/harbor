import { Children, isValidElement, useCallback, useRef, type ReactNode } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "../../lib/cn";
import { useContainerDerived } from "../../lib/useContainerSize";

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
 * on the container, not the viewport). Items animate to their new
 * positions when the container resizes across a breakpoint.
 */
export function Bento({
  children,
  columns = { base: 2, md: 4, lg: 6 },
  gap = 12,
  className,
}: BentoProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Only re-render when the breakpoint *step* changes — not on every pixel.
  // That gives Framer Motion a clean discrete delta to animate between,
  // instead of cancelling itself 60 times per second during resize.
  const compute = useCallback(({ width }: { width: number }) => stepForWidth(width), []);
  const step = useContainerDerived(ref, compute);
  const cols = resolveForStep(columns, step);

  return (
    <LayoutGroup>
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
          return (
            <motion.div
              key={child.key ?? i}
              layout
              layoutDependency={step}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className={cn("min-w-0", child.props.className)}
              style={{
                gridColumn: `span ${col}`,
                gridRow: `span ${row}`,
              }}
            >
              {child.props.children}
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/** Slot inside `Bento` — spans are resolved per container width. */
export function BentoItem({ children }: BentoItemProps) {
  return <>{children}</>;
}
