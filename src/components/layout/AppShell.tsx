import type { ReactNode, CSSProperties } from "react";
import { cn } from "../../lib/cn";

export interface AppShellProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
  /** Horizontal padding around the main content. Tailwind spacing scale. */
  contentPadding?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

const paddings: Record<NonNullable<AppShellProps["contentPadding"]>, string> = {
  none: "",
  sm: "px-3 py-3",
  md: "px-4 py-4 md:px-6 md:py-5",
  lg: "px-6 py-6 md:px-8 md:py-6",
};

/** Full-viewport app frame: optional sticky sidebar on the left, optional
 *  top header, and a scrollable main content region. Sized to at least
 *  the viewport so fixed chrome sits at the correct edges. */
export function AppShell({
  sidebar,
  header,
  children,
  contentPadding = "lg",
  className,
  style,
}: AppShellProps) {
  return (
    <div
      style={style}
      className={cn("flex min-h-screen w-full text-white", className)}
    >
      {sidebar}
      <main className="flex-1 min-w-0 flex flex-col">
        {header}
        <div className={cn("flex-1 min-w-0", paddings[contentPadding])}>
          {children}
        </div>
      </main>
    </div>
  );
}
