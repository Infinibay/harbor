import type { ReactNode, CSSProperties } from "react";
import { cn } from "../../lib/cn";

export interface AppShellProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
  /** Horizontal padding around the main content. Tailwind spacing scale. */
  contentPadding?: "none" | "sm" | "md" | "lg";
  /** Outer gutter that surrounds both sidebar and main panel so they appear
   *  as floating islands. When enabled, the main panel gets a matching
   *  rounded card surface so its top-left corner does not visually clash
   *  with the sidebar's rounding. Default "none" preserves prior behavior. */
  gutter?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

const paddings: Record<NonNullable<AppShellProps["contentPadding"]>, string> = {
  none: "",
  sm: "px-3 py-3",
  md: "px-4 py-4 md:px-6 md:py-5",
  lg: "px-6 py-6 md:px-8 md:py-6",
};

const gutters: Record<NonNullable<AppShellProps["gutter"]>, string> = {
  none: "",
  sm: "p-2 gap-2",
  md: "p-3 gap-3",
  lg: "p-4 gap-4",
};

/** Full-viewport app frame: optional sticky sidebar on the left, optional
 *  top header, and a scrollable main content region. Sized to at least
 *  the viewport so fixed chrome sits at the correct edges. */
export function AppShell({
  sidebar,
  header,
  children,
  contentPadding = "lg",
  gutter = "none",
  className,
  style,
}: AppShellProps) {
  const hasGutter = gutter !== "none";
  return (
    <div
      style={style}
      className={cn(
        "flex w-full text-white",
        hasGutter ? "h-screen" : "min-h-screen",
        gutters[gutter],
        className,
      )}
    >
      {sidebar}
      <main
        className={cn(
          "flex-1 min-w-0 flex flex-col",
          hasGutter &&
            "hbr-card rounded-2xl bg-[rgb(var(--harbor-bg-elev-1)/0.82)] backdrop-blur-md border border-white/8 overflow-hidden",
        )}
      >
        {header}
        <div
          className={cn(
            "flex-1 min-w-0",
            hasGutter && "overflow-y-auto",
            paddings[contentPadding],
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
