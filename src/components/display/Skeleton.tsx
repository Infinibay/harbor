import { cn } from "../../lib/cn";

export interface SkeletonProps {
  className?: string;
  circle?: boolean;
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ className, circle, width, height }: SkeletonProps) {
  return (
    <span
      className={cn(
        "block shimmer",
        circle ? "rounded-full" : "rounded-md",
        className,
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={10}
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}
