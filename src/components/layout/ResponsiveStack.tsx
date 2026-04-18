import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { Breakpoint } from "../../lib/responsive";

type Direction = "row" | "col" | "row-reverse" | "col-reverse";
type ResponsiveProp<T> = T | Partial<Record<"base" | Breakpoint, T>>;

export interface ResponsiveStackProps {
  children: ReactNode;
  direction?: ResponsiveProp<Direction>;
  gap?: ResponsiveProp<number>;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Flex stack whose direction can change per breakpoint.
 *
 *   <ResponsiveStack direction={{ base: "col", md: "row" }} gap={{ base: 2, md: 4 }} />
 *
 * Uses Tailwind breakpoint utilities under the hood, so Framer-Motion
 * layout animations pick up the flex-direction change for free. */
export function ResponsiveStack({
  children,
  direction = "col",
  gap = 3,
  align,
  justify,
  wrap,
  className,
  style,
}: ResponsiveStackProps) {
  const dirClasses = buildResponsive(direction, dirClass);
  const gapClasses = buildResponsive(gap, gapClass);

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
    around: "justify-around",
  };

  return (
    <div
      style={style}
      className={cn(
        "flex",
        dirClasses,
        gapClasses,
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
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

function dirClass(d: Direction, bp?: Breakpoint | "base") {
  const base =
    d === "row"
      ? "flex-row"
      : d === "col"
        ? "flex-col"
        : d === "row-reverse"
          ? "flex-row-reverse"
          : "flex-col-reverse";
  return bp && bp !== "base" ? `${bp}:${base}` : base;
}

function gapClass(g: number, bp?: Breakpoint | "base") {
  return bp && bp !== "base" ? `${bp}:gap-${g}` : `gap-${g}`;
}
