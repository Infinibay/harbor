import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Timestamp } from "./Timestamp";

export type IncidentSeverity = "minor" | "major" | "critical";
export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export interface IncidentUpdate {
  at: Date | string | number;
  status: IncidentStatus;
  message: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  startedAt: Date | string | number;
  resolvedAt?: Date | string | number;
  affectedComponents?: string[];
  updates: IncidentUpdate[];
}

export interface IncidentTimelineProps {
  incidents: readonly Incident[];
  /** Expand all by default. */
  expandedByDefault?: boolean;
  /** Slot rendered when the list is empty. */
  emptyState?: ReactNode;
  className?: string;
}

const SEVERITY_META: Record<
  IncidentSeverity,
  { label: string; color: string; bg: string }
> = {
  minor: { label: "Minor", color: "text-sky-300", bg: "bg-sky-500/15" },
  major: { label: "Major", color: "text-amber-300", bg: "bg-amber-500/15" },
  critical: { label: "Critical", color: "text-rose-300", bg: "bg-rose-500/15" },
};

const STATUS_META: Record<
  IncidentStatus,
  { label: string; color: string; dot: string }
> = {
  investigating: { label: "Investigating", color: "text-amber-300", dot: "bg-amber-400" },
  identified: { label: "Identified", color: "text-sky-300", dot: "bg-sky-400" },
  monitoring: { label: "Monitoring", color: "text-violet-300", dot: "bg-violet-400" },
  resolved: { label: "Resolved", color: "text-emerald-300", dot: "bg-emerald-400" },
};

/** Vertical list of incidents with collapsible update threads.
 *  Ongoing incidents pulse their severity chip so they stand out. */
export function IncidentTimeline({
  incidents,
  expandedByDefault = true,
  emptyState,
  className,
}: IncidentTimelineProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (expandedByDefault) for (const inc of incidents) s.add(inc.id);
    return s;
  });

  if (incidents.length === 0) {
    return (
      <div className={cn("text-sm text-white/50 p-6 text-center", className)}>
        {emptyState ?? "No incidents. Everything is operational."}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {incidents.map((inc) => {
        const open = expanded.has(inc.id);
        const sev = SEVERITY_META[inc.severity];
        const ongoing = !inc.resolvedAt;
        return (
          <div
            key={inc.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
          >
            <button
              onClick={() =>
                setExpanded((prev) => {
                  const n = new Set(prev);
                  if (n.has(inc.id)) n.delete(inc.id);
                  else n.add(inc.id);
                  return n;
                })
              }
              className="w-full flex items-start gap-3 p-3 text-left hover:bg-white/[0.03]"
            >
              <span className="text-white/40 text-xs mt-0.5 shrink-0 w-3">
                {open ? "▾" : "▸"}
              </span>
              <span
                className={cn(
                  "shrink-0 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-semibold",
                  sev.bg,
                  sev.color,
                  ongoing && "animate-pulse",
                )}
              >
                {sev.label}
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="text-white font-medium truncate">{inc.title}</div>
                <div className="text-xs text-white/50 flex items-center gap-2 flex-wrap">
                  <Timestamp value={inc.startedAt} />
                  {inc.resolvedAt ? (
                    <>
                      <span className="text-white/30">→</span>
                      <span className="text-emerald-300">resolved</span>
                    </>
                  ) : (
                    <span className="text-amber-300">ongoing</span>
                  )}
                  {inc.affectedComponents && inc.affectedComponents.length > 0 ? (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="truncate">
                        {inc.affectedComponents.join(", ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="updates"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden border-t border-white/8"
                >
                  <div className="p-4 pl-10 relative">
                    {inc.updates.map((u, i) => {
                      const st = STATUS_META[u.status];
                      return (
                        <div
                          key={i}
                          className="relative pl-6 pb-4 last:pb-0"
                        >
                          <span
                            className={cn(
                              "absolute left-0 top-1 w-2 h-2 rounded-full",
                              st.dot,
                            )}
                          />
                          {i < inc.updates.length - 1 ? (
                            <span className="absolute left-[3.5px] top-3 bottom-0 w-px bg-white/10" />
                          ) : null}
                          <div className="flex items-baseline gap-2">
                            <span
                              className={cn(
                                "text-[10px] uppercase tracking-widest font-semibold",
                                st.color,
                              )}
                            >
                              {st.label}
                            </span>
                            <Timestamp
                              value={u.at}
                              className="text-xs text-white/40"
                            />
                          </div>
                          <p className="text-sm text-white/80 mt-0.5">{u.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
