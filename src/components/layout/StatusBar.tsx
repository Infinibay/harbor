import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface StatusBarProps {
  children: ReactNode;
  className?: string;
}

export function StatusBar({ children, className }: StatusBarProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 text-[11px] text-white/55 font-mono",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatusItem({
  icon,
  children,
  tone,
  onClick,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "info";
  onClick?: () => void;
  className?: string;
}) {
  const colors = {
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-rose-300",
    info: "text-sky-300",
  };
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded",
        tone ? colors[tone] : "text-white/60",
        onClick ? "hover:bg-white/5 cursor-pointer" : "cursor-default",
        className,
      )}
    >
      {icon ? <span>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export function StatusSeparator() {
  return <span className="text-white/20 select-none">·</span>;
}
