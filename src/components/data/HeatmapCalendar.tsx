import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface HeatmapCalendarProps {
  /** Map of ISO date (YYYY-MM-DD) → value */
  data: Record<string, number>;
  weeks?: number; // default 20
  max?: number;
  className?: string;
  onHover?: (date: string | null, value: number) => void;
}

export function HeatmapCalendar({
  data,
  weeks = 20,
  max,
  className,
  onHover,
}: HeatmapCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const cells = useMemo(() => {
    const days: { date: string; value: number }[] = [];
    const end = new Date(today);
    end.setHours(0, 0, 0, 0);
    // Move to end of week (Sunday)
    end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));
    const total = weeks * 7;
    for (let i = total - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ date: iso, value: data[iso] ?? 0 });
    }
    return days;
  }, [data, weeks, today]);

  const peak =
    max ?? Math.max(1, ...Object.values(data).map((v) => v));

  function level(v: number) {
    if (v <= 0) return 0;
    return Math.min(4, Math.ceil((v / peak) * 4));
  }

  const levelColors = [
    "bg-white/5",
    "bg-fuchsia-500/25",
    "bg-fuchsia-500/50",
    "bg-fuchsia-500/75",
    "bg-fuchsia-400",
  ];

  // Build grid: columns = weeks, rows = 7 days (Mon..Sun)
  const grid: { date: string; value: number }[][] = Array.from(
    { length: weeks },
    (_, w) => cells.slice(w * 7, w * 7 + 7),
  );

  return (
    <div className={cn("inline-flex gap-1", className)}>
      {grid.map((col, i) => (
        <div key={i} className="flex flex-col gap-1">
          {col.map((c) => {
            const lvl = level(c.value);
            return (
              <motion.div
                key={c.date}
                whileHover={{ scale: 1.6, zIndex: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onMouseEnter={() => onHover?.(c.date, c.value)}
                onMouseLeave={() => onHover?.(null, 0)}
                title={`${c.date} · ${c.value}`}
                className={cn("w-3 h-3 rounded-[3px]", levelColors[lvl])}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
