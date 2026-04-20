import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Z } from "../../lib/z";

export interface AppHeaderProps {
  left?: ReactNode;
  right?: ReactNode;
  sticky?: boolean;
  className?: string;
}

/** Thin app chrome bar for the top of a page. Provides a backdrop-blurred,
 *  bordered sticky strip with a left slot (back button, breadcrumbs, title)
 *  and a right slot (actions, notifications, user menu). Unlike `NavBar`,
 *  this does not render tabbed navigation — it is a passive frame. */
export function AppHeader({
  left,
  right,
  sticky = true,
  className,
}: AppHeaderProps) {
  return (
    <header
      style={sticky ? { zIndex: Z.STICKY } : undefined}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-3 bg-[#0d0d14]/80 backdrop-blur-md border-b border-white/8",
        sticky && "sticky top-0",
        className,
      )}
    >
      <div className="min-w-0 flex-1 flex items-center gap-3">{left}</div>
      <div className="shrink-0 flex items-center gap-2">{right}</div>
    </header>
  );
}
