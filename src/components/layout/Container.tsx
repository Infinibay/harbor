import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "full";
  padded?: boolean;
  className?: string;
}

const sizes = {
  sm: "max-w-[var(--harbor-container-sm)]",
  md: "max-w-[var(--harbor-container-md)]",
  lg: "max-w-[var(--harbor-container-lg)]",
  xl: "max-w-[var(--harbor-container-xl)]",
  "2xl": "max-w-[var(--harbor-container-2xl)]",
  prose: "max-w-[var(--harbor-container-prose)]",
  full: "max-w-none",
};

/** Centers and constrains width. Breakpoint-aware horizontal padding so
 *  content breathes on larger screens. */
export function Container({
  children,
  size = "xl",
  padded = true,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizes[size],
        padded && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
