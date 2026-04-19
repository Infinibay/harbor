import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Donut } from "./Donut";

export interface CostItem {
  id: string;
  label: string;
  amount: number;
  color?: string;
}

export interface CostBreakdownProps {
  items: readonly CostItem[];
  /** Currency for formatting. Default "USD". */
  currency?: string;
  /** "donut" (default) or "stacked". */
  variant?: "donut" | "stacked";
  locale?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  "#a855f7", "#38bdf8", "#f472b6", "#34d399",
  "#fbbf24", "#fb7185", "#818cf8", "#22d3ee",
];

/** Cost breakdown — donut with a legend (default) or a stacked
 *  horizontal bar. Hover cross-highlights the row in the legend. */
export function CostBreakdown({
  items,
  currency = "USD",
  variant = "donut",
  locale,
  className,
}: CostBreakdownProps) {
  const [hover, setHover] = useState<string | null>(null);
  const total = useMemo(() => items.reduce((s, it) => s + it.amount, 0), [items]);
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [currency, locale],
  );

  const withColors = items.map((it, i) => ({
    ...it,
    color: it.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));

  return (
    <div className={cn("w-full flex flex-wrap gap-6 items-start", className)}>
      {variant === "donut" ? (
        <div className="shrink-0">
          <Donut
            size={160}
            thickness={18}
            centerLabel="total"
            centerValue={fmt.format(total)}
            slices={withColors.map((it) => ({
              id: it.id,
              label: it.label,
              value: it.amount,
              color: it.color,
            }))}
          />
        </div>
      ) : (
        <div className="w-full">
          <div className="h-4 rounded-full overflow-hidden bg-white/[0.06] flex">
            {withColors.map((it) => {
              const frac = total > 0 ? it.amount / total : 0;
              return (
                <motion.div
                  key={it.id}
                  initial={{ width: 0 }}
                  animate={{ width: `${frac * 100}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  style={{
                    background: it.color,
                    opacity: hover && hover !== it.id ? 0.4 : 1,
                  }}
                  onMouseEnter={() => setHover(it.id)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
        {withColors.map((it) => {
          const frac = total > 0 ? it.amount / total : 0;
          const dim = hover && hover !== it.id;
          return (
            <div
              key={it.id}
              onMouseEnter={() => setHover(it.id)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "flex items-center gap-2 text-xs py-1 px-2 rounded transition-opacity",
                dim && "opacity-40",
                "hover:bg-white/[0.03]",
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: it.color }}
              />
              <span className="flex-1 truncate text-white/85">{it.label}</span>
              <span className="text-white/45 tabular-nums font-mono w-12 text-right">
                {(frac * 100).toFixed(0)}%
              </span>
              <span className="text-white tabular-nums font-mono w-20 text-right">
                {fmt.format(it.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
