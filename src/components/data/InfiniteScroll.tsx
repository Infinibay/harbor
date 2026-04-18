import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../display/Spinner";

export interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  children: ReactNode;
  threshold?: number;
  className?: string;
  endMessage?: ReactNode;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  children,
  threshold = 200,
  className,
  endMessage,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: `${threshold}px` },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {children}
      <div ref={sentinelRef} className="py-6 grid place-items-center">
        {loading ? (
          <Spinner size={20} />
        ) : !hasMore ? (
          <span className="text-xs text-white/35">
            {endMessage ?? "No more items"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
