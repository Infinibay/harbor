import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Divider({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (!children)
    return (
      <div
        className={cn("h-px w-full bg-white/8", className)}
        role="separator"
      />
    );
  return (
    <div
      className={cn("flex items-center gap-3 text-xs text-white/40", className)}
    >
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
      {children}
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/80">
      {children}
    </kbd>
  );
}
