import { Children, useMemo, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface MasonryGridProps {
  columns?: number;
  gap?: number;
  children: ReactNode;
  className?: string;
}

export function MasonryGrid({
  columns = 3,
  gap = 12,
  children,
  className,
}: MasonryGridProps) {
  const cols = useMemo(() => {
    const arr = Children.toArray(children);
    const buckets: ReactNode[][] = Array.from({ length: columns }, () => []);
    arr.forEach((child, i) => {
      buckets[i % columns].push(child);
    });
    return buckets;
  }, [children, columns]);

  return (
    <div
      className={cn("flex items-start", className)}
      style={{ gap }}
    >
      {cols.map((col, ci) => (
        <div key={ci} className="flex-1 min-w-0 flex flex-col" style={{ gap }}>
          {col}
        </div>
      ))}
    </div>
  );
}
