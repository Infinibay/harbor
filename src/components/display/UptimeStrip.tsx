import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { formatAbsolute } from "../../lib/format";

export type DayStatus = "operational" | "degraded" | "down" | "maintenance" | "no-data";

export interface UptimeDay {
  /** Date representing the day (time-of-day ignored). */
  date: Date | string | number;
  status: DayStatus;
  /** Short summary / incident title for the hover tooltip. */
  label?: string;
  /** Extra detail shown below the summary. */
  detail?: ReactNode;
}

export interface UptimeStripProps {
  /** Days to render, oldest first. Extras beyond the first `days` prop
   *  are clamped; shorter arrays are padded with no-data entries. */
  days: readonly UptimeDay[];
  /** Target count of squares — missing ones are rendered as empty. */
  length?: number;
  /** Square width in px. Default 8. */
  size?: number;
  /** Called when the user clicks a day. */
  onDayClick?: (day: UptimeDay) => void;
  /** Compact label / title above the strip. */
  label?: ReactNode;
  className?: string;
}

const STATUS_COLOR: Record<DayStatus, string> = {
  operational: "bg-emerald-400/80",
  degraded: "bg-amber-400/80",
  down: "bg-rose-500/90",
  maintenance: "bg-sky-400/70",
  "no-data": "bg-white/10",
};

/** Horizontal strip of colored squares — one per day — showing service
 *  uptime at a glance. Hover reveals the day's incident summary. */
export function UptimeStrip({
  days,
  length = 90,
  size = 8,
  onDayClick,
  label,
  className,
}: UptimeStripProps) {
  const [hover, setHover] = useState<number | null>(null);

  const padded: UptimeDay[] = [];
  const pad = Math.max(0, length - days.length);
  for (let i = 0; i < pad; i++) {
    padded.push({ date: Date.now() - (length - i) * 86400_000, status: "no-data" });
  }
  for (const d of days) padded.push(d);

  // Summary ratios
  const counts = padded.reduce<Record<DayStatus, number>>(
    (acc, d) => {
      acc[d.status] += 1;
      return acc;
    },
    { operational: 0, degraded: 0, down: 0, maintenance: 0, "no-data": 0 },
  );
  const knownDays = padded.length - counts["no-data"];
  const uptime =
    knownDays > 0 ? counts.operational / knownDays : 1;

  const hoverDay = hover != null ? padded[hover] : null;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between text-xs">
        <div className="text-white/70">{label}</div>
        <div className="text-white/45 tabular-nums font-mono">
          {(uptime * 100).toFixed(2)}% uptime · last {padded.length} days
        </div>
      </div>
      <div
        className="flex gap-[2px] items-end"
        style={{ height: size * 2 }}
        onMouseLeave={() => setHover(null)}
      >
        {padded.map((d, i) => (
          <button
            key={i}
            onClick={() => onDayClick?.(d)}
            onMouseEnter={() => setHover(i)}
            className={cn(
              "flex-1 rounded-[2px] hover:opacity-70 transition",
              STATUS_COLOR[d.status],
            )}
            style={{ minWidth: size, height: size * 2 }}
            title={`${formatAbsolute(d.date, { preset: "date" })} · ${d.status}${d.label ? ` · ${d.label}` : ""}`}
          />
        ))}
      </div>
      <div className="text-xs text-white/60 min-h-[1.25rem]">
        {hoverDay ? (
          <span className="flex items-baseline gap-2">
            <span className="tabular-nums font-mono">
              {formatAbsolute(hoverDay.date, { preset: "date" })}
            </span>
            <span
              className={cn(
                "uppercase text-[10px] tracking-widest",
                hoverDay.status === "operational" && "text-emerald-300",
                hoverDay.status === "degraded" && "text-amber-300",
                hoverDay.status === "down" && "text-rose-300",
                hoverDay.status === "maintenance" && "text-sky-300",
                hoverDay.status === "no-data" && "text-white/30",
              )}
            >
              {hoverDay.status}
            </span>
            {hoverDay.label ? <span>· {hoverDay.label}</span> : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}
