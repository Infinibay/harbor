import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface EventCardProps {
  date: Date | string;
  title: ReactNode;
  time?: ReactNode;
  location?: ReactNode;
  description?: ReactNode;
  attendees?: number;
  attending?: boolean;
  onToggleAttending?: () => void;
  className?: string;
}

function parseDate(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return {
    day: dt.getDate(),
    month: dt.toLocaleString(undefined, { month: "short" }).toUpperCase(),
    weekday: dt.toLocaleString(undefined, { weekday: "short" }),
  };
}

export function EventCard({
  date,
  title,
  time,
  location,
  description,
  attendees,
  attending,
  onToggleAttending,
  className,
}: EventCardProps) {
  const d = parseDate(date);
  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl bg-white/[0.03] border border-white/8 p-4 hover:border-white/20 transition-colors",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center w-16 h-20 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/25 text-white shrink-0">
        <div className="text-[10px] uppercase tracking-wider text-fuchsia-300">
          {d.month}
        </div>
        <div className="text-2xl font-bold font-mono leading-none mt-0.5">
          {d.day}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/45 mt-1">
          {d.weekday}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="text-white font-semibold text-base leading-tight">
            {title}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/55 mt-1">
            {time ? <span>🕒 {time}</span> : null}
            {location ? <span>📍 {location}</span> : null}
            {attendees !== undefined ? (
              <span>👥 {attendees} going</span>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-white/70 mt-2 leading-relaxed line-clamp-2">
              {description}
            </p>
          ) : null}
        </div>
        {onToggleAttending ? (
          <button
            onClick={onToggleAttending}
            data-cursor="button"
            className={cn(
              "self-start mt-3 text-xs px-3 py-1.5 rounded-md transition-colors",
              attending
                ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-200"
                : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10",
            )}
          >
            {attending ? "✓ Attending" : "RSVP"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
