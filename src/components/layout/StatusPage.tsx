import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { StatusDot, type Status } from "../display/StatusDot";
import { UptimeStrip, type UptimeDay } from "../display/UptimeStrip";
import {
  IncidentTimeline,
  type Incident,
} from "../display/IncidentTimeline";

export type SystemStatus =
  | "operational"
  | "degraded"
  | "partial-outage"
  | "major-outage"
  | "maintenance";

export interface StatusComponent {
  id: string;
  name: string;
  status: Status;
  /** Optional per-component uptime history. */
  uptime?: readonly UptimeDay[];
  /** Optional group label ("Core services", "Regions", "Third-party"). */
  group?: string;
  description?: string;
}

export interface StatusPageProps {
  /** Overall system status banner. */
  system: { status: SystemStatus; message?: string };
  /** Components / regions / services to list. */
  components: readonly StatusComponent[];
  /** Recent incidents. */
  incidents?: readonly Incident[];
  /** Optional global uptime strip above the components. */
  uptime?: readonly UptimeDay[];
  /** Header content (title, subscribe button, etc.). */
  header?: ReactNode;
  className?: string;
}

const SYSTEM_META: Record<
  SystemStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  operational: {
    label: "All systems operational",
    color: "text-emerald-100",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/30",
  },
  degraded: {
    label: "Degraded performance",
    color: "text-amber-100",
    bg: "bg-amber-500/15",
    border: "border-amber-400/30",
  },
  "partial-outage": {
    label: "Partial outage",
    color: "text-orange-100",
    bg: "bg-orange-500/15",
    border: "border-orange-400/30",
  },
  "major-outage": {
    label: "Major outage",
    color: "text-rose-100",
    bg: "bg-rose-500/15",
    border: "border-rose-400/30",
  },
  maintenance: {
    label: "Scheduled maintenance",
    color: "text-sky-100",
    bg: "bg-sky-500/15",
    border: "border-sky-400/30",
  },
};

/** Opinionated system status page: banner + (optional) global uptime +
 *  grouped component list + incident timeline. Drop it onto any
 *  "/status" route and you're 90% of the way there. */
export function StatusPage({
  system,
  components,
  incidents,
  uptime,
  header,
  className,
}: StatusPageProps) {
  const meta = SYSTEM_META[system.status];

  // Group components
  const groups = new Map<string, StatusComponent[]>();
  for (const c of components) {
    const key = c.group ?? "";
    const list = groups.get(key) ?? [];
    list.push(c);
    groups.set(key, list);
  }

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {header}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4",
          meta.bg,
          meta.border,
        )}
      >
        <div className={cn("flex-1 text-lg font-semibold", meta.color)}>
          {system.message ?? meta.label}
        </div>
      </div>

      {uptime ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <UptimeStrip label="Overall" days={uptime} />
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {Array.from(groups.entries()).map(([groupName, comps]) => (
          <div key={groupName} className="flex flex-col gap-2">
            {groupName ? (
              <div className="text-[10px] uppercase tracking-widest text-white/40 px-1">
                {groupName}
              </div>
            ) : null}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/8">
              {comps.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <StatusDot status={c.status} label={null} />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="text-sm text-white truncate">{c.name}</div>
                      {c.description ? (
                        <div className="text-xs text-white/50 truncate">
                          {c.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {c.uptime ? (
                    <div className="w-56 shrink-0">
                      <UptimeStrip days={c.uptime} length={c.uptime.length} size={6} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {incidents && incidents.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-widest text-white/40 px-1">
            Recent incidents
          </div>
          <IncidentTimeline incidents={incidents} />
        </div>
      ) : null}
    </div>
  );
}
