import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";
import { Timestamp } from "../display/Timestamp";

export type AuditSeverity = "info" | "warn" | "critical";

export interface AuditEntry {
  id: string;
  actor: { id?: string; name: string; avatarUrl?: string };
  /** Short imperative verb — "deleted", "created", "enabled". */
  verb: string;
  /** The object the action was performed on. */
  target: string;
  at: Date | string | number;
  /** Optional rich detail shown when expanded. */
  detail?: ReactNode;
  /** Structured diff summary. */
  diff?: { from?: string; to?: string };
  severity?: AuditSeverity;
  /** Category — used by filter chips. */
  kind?: string;
}

// =====================================================================
// AuditRow — one standardized entry
// =====================================================================

export interface AuditRowProps {
  entry: AuditEntry;
  /** Show the expand arrow. Default: true when detail/diff exist. */
  expandable?: boolean;
  className?: string;
}

const SEV_META: Record<AuditSeverity, { color: string; bg: string }> = {
  info: { color: "text-white/50", bg: "bg-white/[0.02]" },
  warn: { color: "text-amber-300", bg: "bg-amber-500/[0.06]" },
  critical: { color: "text-rose-300", bg: "bg-rose-500/[0.06]" },
};

export function AuditRow({ entry, expandable, className }: AuditRowProps) {
  const [open, setOpen] = useState(false);
  const meta = SEV_META[entry.severity ?? "info"];
  const canExpand = expandable ?? Boolean(entry.detail || entry.diff);
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg px-3 py-2 transition-colors",
        meta.bg,
        canExpand && "cursor-pointer hover:bg-white/[0.05]",
        className,
      )}
      onClick={() => canExpand && setOpen((o) => !o)}
    >
      <div className="flex items-center gap-3 text-xs">
        <Avatar name={entry.actor.name} size="sm" />
        <span className="text-white/85">{entry.actor.name}</span>
        <span className={cn("font-semibold", meta.color)}>{entry.verb}</span>
        <span className="text-white/80 truncate">{entry.target}</span>
        <span className="flex-1" />
        {entry.kind ? (
          <span className="text-[10px] uppercase tracking-widest text-white/35">
            {entry.kind}
          </span>
        ) : null}
        <Timestamp value={entry.at} className="text-white/40" />
        {canExpand ? (
          <span className="text-white/40 text-xs w-3 text-right">
            {open ? "▾" : "▸"}
          </span>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-10 text-xs text-white/65">
              {entry.diff ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.diff.from ? (
                    <code className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-200 border border-rose-400/20 font-mono">
                      {entry.diff.from}
                    </code>
                  ) : null}
                  <span className="text-white/30">→</span>
                  {entry.diff.to ? (
                    <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 font-mono">
                      {entry.diff.to}
                    </code>
                  ) : null}
                </div>
              ) : null}
              {entry.detail ? <div className="mt-2">{entry.detail}</div> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// AuditLog — vertical stack with grouping + filter chips
// =====================================================================

export interface AuditLogProps {
  entries: readonly AuditEntry[];
  /** Group-by mode. Default `"day"`. */
  groupBy?: "day" | "actor" | "kind" | "none";
  /** Kind chips visible at the top; filters the list. */
  kinds?: readonly string[];
  className?: string;
}

function toKey(at: Date | string | number): string {
  const d = at instanceof Date ? at : new Date(at);
  return d.toISOString().slice(0, 10);
}

export function AuditLog({
  entries,
  groupBy = "day",
  kinds,
  className,
}: AuditLogProps) {
  const [kindFilter, setKindFilter] = useState<string | "all">("all");
  const filtered = useMemo(
    () =>
      kindFilter === "all"
        ? entries
        : entries.filter((e) => e.kind === kindFilter),
    [entries, kindFilter],
  );

  const grouped = useMemo(() => {
    if (groupBy === "none") return [["", filtered] as const];
    const m = new Map<string, AuditEntry[]>();
    for (const e of filtered) {
      let key = "";
      if (groupBy === "day") key = toKey(e.at);
      else if (groupBy === "actor") key = e.actor.name;
      else if (groupBy === "kind") key = e.kind ?? "—";
      const list = m.get(key) ?? [];
      list.push(e);
      m.set(key, list);
    }
    return Array.from(m.entries()).sort(([a], [b]) =>
      groupBy === "day" ? (a < b ? 1 : -1) : a.localeCompare(b),
    );
  }, [filtered, groupBy]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {kinds && kinds.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setKindFilter("all")}
            className={cn(
              "text-xs px-2 py-0.5 rounded",
              kindFilter === "all" ? "bg-white/10 text-white" : "text-white/55 hover:text-white",
            )}
          >
            All
          </button>
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              className={cn(
                "text-xs px-2 py-0.5 rounded",
                kindFilter === k
                  ? "bg-fuchsia-500/20 text-fuchsia-100"
                  : "text-white/55 hover:text-white",
              )}
            >
              {k}
            </button>
          ))}
        </div>
      ) : null}
      {grouped.map(([group, rows]) => (
        <div key={group} className="flex flex-col gap-1">
          {group ? (
            <div className="text-[10px] uppercase tracking-widest text-white/35 px-1">
              {group}
            </div>
          ) : null}
          {rows.map((e) => (
            <AuditRow key={e.id} entry={e} />
          ))}
        </div>
      ))}
      {filtered.length === 0 ? (
        <div className="text-sm text-white/40 py-6 text-center border border-dashed border-white/10 rounded-xl">
          No entries match.
        </div>
      ) : null}
    </div>
  );
}
