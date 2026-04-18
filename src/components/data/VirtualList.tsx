import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyFor?: (item: T, index: number) => string | number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  overscan = 6,
  renderItem,
  keyFor = (_i, idx) => idx,
  className,
}: VirtualListProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const total = items.length * itemHeight;
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2;
  const endIdx = Math.min(items.length, startIdx + visibleCount);
  const visible = items.slice(startIdx, endIdx);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-auto", className)}
      style={{ height }}
    >
      <div style={{ height: total, position: "relative" }}>
        {visible.map((item, i) => {
          const idx = startIdx + i;
          return (
            <div
              key={keyFor(item, idx)}
              style={{
                position: "absolute",
                top: idx * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, idx)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
