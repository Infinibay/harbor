import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { Breakpoint } from "../../lib/responsive";

type ResponsiveProp<T> = T | Partial<Record<"base" | Breakpoint, T>>;

export interface ResponsiveGridProps {
  children: ReactNode;
  /** Number of columns per breakpoint (viewport width). Defaults to 1. */
  columns?: ResponsiveProp<number>;
  /** Gap in Tailwind scale units (1–12). Defaults to 4. */
  gap?: ResponsiveProp<number>;
  className?: string;
}

/** Viewport-responsive CSS grid with no runtime container measurement.
 *
 * Unlike `Bento`, this primitive uses Tailwind media-query breakpoints
 * (sm/md/lg/xl/2xl) and never measures its parent. Safe inside
 * collapsing containers like `Accordion`, `Drawer` or animated `Tabs`
 * where `Bento` flickers on first render.
 *
 *   <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
 *     <Card />
 *     <Card />
 *   </ResponsiveGrid>
 */
export function ResponsiveGrid({
  children,
  columns = 1,
  gap = 4,
  className,
}: ResponsiveGridProps) {
  const colClasses = buildResponsive(columns, colClass);
  const gapClasses = buildResponsive(gap, gapClass);
  return (
    <div className={cn("grid w-full", colClasses, gapClasses, className)}>
      {children}
    </div>
  );
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function buildResponsive<T>(
  prop: ResponsiveProp<T>,
  cls: (v: T, bp?: Breakpoint | "base") => string,
): string {
  if (!isObject(prop)) return cls(prop as T);
  const out: string[] = [];
  for (const key of ["base", "sm", "md", "lg", "xl", "2xl"] as const) {
    const v = (prop as Record<string, T>)[key];
    if (v !== undefined) out.push(cls(v, key));
  }
  return out.join(" ");
}

function colClass(n: number, bp?: Breakpoint | "base") {
  const prefix = bp && bp !== "base" ? `${bp}:` : "";
  return `${prefix}grid-cols-${Math.max(1, Math.min(12, n))}`;
}

function gapClass(g: number, bp?: Breakpoint | "base") {
  const prefix = bp && bp !== "base" ? `${bp}:` : "";
  return `${prefix}gap-${g}`;
}
