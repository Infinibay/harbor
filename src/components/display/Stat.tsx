import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/cn";

type Variant = "bordered" | "plain";

export interface StatProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  icon?: ReactNode;
  /** `bordered` (default) wraps in a card-like surface with border.
   *  `plain` removes the surface so the Stat can compose inside another
   *  Card without doubled borders. */
  variant?: Variant;
  className?: string;
  format?: (n: number) => string;
}

export function Stat({
  label,
  value,
  prefix,
  suffix,
  change,
  icon,
  variant = "bordered",
  className,
  format,
}: StatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 900;
    const from = 0;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const positive = (change ?? 0) >= 0;
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1",
        variant === "bordered" &&
          "p-4 rounded-2xl bg-white/[0.03] border border-white/8",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white tabular-nums font-mono">
        {prefix}
        {format ? format(display) : display.toLocaleString()}
        {suffix ? (
          <span className="text-white/40 text-base font-normal ml-1">
            {suffix}
          </span>
        ) : null}
      </div>
      {change !== undefined ? (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "text-xs font-medium",
            positive ? "text-emerald-300" : "text-rose-300",
          )}
        >
          {positive ? "↑" : "↓"} {Math.abs(change)}% vs last week
        </motion.div>
      ) : null}
    </div>
  );
}
