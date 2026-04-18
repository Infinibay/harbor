import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TickerItem {
  id: string;
  label: ReactNode;
  value?: ReactNode;
  change?: number;
}

export interface TickerTapeProps {
  items: TickerItem[];
  speed?: number; // seconds for a full loop
  gap?: number;
  className?: string;
}

export function TickerTape({
  items,
  speed = 40,
  gap = 28,
  className,
}: TickerTapeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/8 bg-white/[0.02] py-2",
        className,
      )}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `ticker ${speed}s linear infinite`,
          gap,
        }}
      >
        {doubled.map((it, i) => (
          <span
            key={`${it.id}-${i}`}
            className="inline-flex items-center gap-2 text-sm text-white/85 shrink-0"
          >
            <span className="text-white/55">{it.label}</span>
            {it.value !== undefined ? (
              <span className="font-mono tabular-nums">{it.value}</span>
            ) : null}
            {it.change !== undefined ? (
              <span
                className={cn(
                  "font-mono tabular-nums text-xs",
                  it.change > 0
                    ? "text-emerald-300"
                    : it.change < 0
                      ? "text-rose-300"
                      : "text-white/40",
                )}
              >
                {it.change > 0 ? "▲" : it.change < 0 ? "▼" : ""}
                {Math.abs(it.change).toFixed(2)}%
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }`}</style>
    </div>
  );
}
