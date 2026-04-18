import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ToolbarProps {
  children: ReactNode;
  className?: string;
  variant?: "flat" | "floating";
  orientation?: "horizontal" | "vertical";
}

export function Toolbar({
  children,
  className,
  variant = "flat",
  orientation = "horizontal",
}: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-0.5"
          : "flex flex-col items-center gap-0.5",
        variant === "floating" &&
          "rounded-xl bg-[#14141c]/90 border border-white/10 p-1 shadow-lg backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {children}
    </div>
  );
}

export function ToolbarSeparator({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  return orientation === "vertical" ? (
    <span className="mx-1 w-px h-5 bg-white/10" />
  ) : (
    <span className="my-1 h-px w-5 bg-white/10" />
  );
}
