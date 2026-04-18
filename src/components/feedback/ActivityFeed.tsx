import { useMemo, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ActivityEvent {
  id: string;
  avatar?: ReactNode;
  actor?: string;
  verb?: string;
  target?: string;
  description?: ReactNode;
  time: string | Date;
  tone?: "info" | "success" | "warning" | "danger" | "neutral";
  icon?: ReactNode;
}

export interface ActivityFeedProps {
  events: ActivityEvent[];
  groupBy?: "day" | "none";
  className?: string;
}

const toneColor: Record<NonNullable<ActivityEvent["tone"]>, string> = {
  info: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  danger: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  neutral: "border-white/10 bg-white/5 text-white/70",
};

function dayKey(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  if (dt.getTime() === today.getTime()) return "Today";
  if (dt.getTime() === yesterday.getTime()) return "Yesterday";
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function ActivityFeed({ events, groupBy = "day", className }: ActivityFeedProps) {
  const groups = useMemo(() => {
    if (groupBy === "none") return [{ label: "", events }];
    const map = new Map<string, ActivityEvent[]>();
    events.forEach((e) => {
      const d = typeof e.time === "string" ? new Date(e.time) : e.time;
      const key = isNaN(d.getTime()) ? "" : dayKey(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).map(([label, events]) => ({ label, events }));
  }, [events, groupBy]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label ? (
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2 px-1">
              {g.label}
            </div>
          ) : null}
          <div className="flex flex-col">
            {g.events.map((e, i) => (
              <div key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
                {i < g.events.length - 1 ? (
                  <span className="absolute left-[15px] top-8 bottom-0 w-px bg-white/8" />
                ) : null}
                <div
                  className={cn(
                    "relative z-[1] w-8 h-8 rounded-full border grid place-items-center shrink-0 text-[11px]",
                    toneColor[e.tone ?? "neutral"],
                  )}
                >
                  {e.icon ?? e.avatar ?? "•"}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-sm text-white/85">
                    {e.actor ? (
                      <span className="font-medium text-white">{e.actor}</span>
                    ) : null}
                    {e.verb ? <span className="text-white/60"> {e.verb} </span> : null}
                    {e.target ? (
                      <span className="font-medium text-white/85">{e.target}</span>
                    ) : null}
                  </div>
                  {e.description ? (
                    <div className="text-xs text-white/55 mt-0.5">{e.description}</div>
                  ) : null}
                  <div className="text-[11px] text-white/40 mt-1">
                    {typeof e.time === "string"
                      ? e.time
                      : e.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
