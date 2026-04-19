import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatAbsolute } from "../../lib/format";

export type ChangeKind = "feature" | "improvement" | "fix" | "security" | "breaking";

export interface ChangelogItem {
  /** Short markdown / plain text description. */
  text: string;
  kind?: ChangeKind;
  /** Optional link to a commit / issue / PR. */
  href?: string;
}

export interface ChangelogSection {
  label: string;
  items: ChangelogItem[];
}

export interface ChangelogEntry {
  version: string;
  date: Date | string | number;
  /** Headline. */
  title?: string;
  sections: readonly ChangelogSection[];
  /** Start collapsed? Default: false for the first, true for older. */
  collapsed?: boolean;
}

export interface ChangelogFeedProps {
  entries: readonly ChangelogEntry[];
  /** Filter chips at the top by kind. */
  showFilter?: boolean;
  className?: string;
}

const KIND_META: Record<ChangeKind, { label: string; color: string; bg: string }> = {
  feature: { label: "New", color: "text-emerald-200", bg: "bg-emerald-500/15" },
  improvement: { label: "Better", color: "text-sky-200", bg: "bg-sky-500/15" },
  fix: { label: "Fixed", color: "text-amber-200", bg: "bg-amber-500/15" },
  security: { label: "Security", color: "text-rose-200", bg: "bg-rose-500/15" },
  breaking: { label: "Breaking", color: "text-fuchsia-200", bg: "bg-fuchsia-500/20" },
};

/** Vertical feed of releases. Per-version collapse + kind filter chips
 *  at the top. */
export function ChangelogFeed({
  entries,
  showFilter = true,
  className,
}: ChangelogFeedProps) {
  const [kindFilter, setKindFilter] = useState<ChangeKind | "all">("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const s = new Set<string>();
    entries.forEach((e, i) => {
      if (e.collapsed ?? i > 0) s.add(e.version);
    });
    return s;
  });

  const kindsPresent = useMemo(() => {
    const s = new Set<ChangeKind>();
    for (const e of entries)
      for (const sec of e.sections)
        for (const it of sec.items) if (it.kind) s.add(it.kind);
    return Array.from(s);
  }, [entries]);

  function toggle(version: string) {
    setCollapsed((prev) => {
      const n = new Set(prev);
      if (n.has(version)) n.delete(version);
      else n.add(version);
      return n;
    });
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showFilter && kindsPresent.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setKindFilter("all")}
            className={cn(
              "px-2 py-0.5 rounded-md text-xs",
              kindFilter === "all"
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5",
            )}
          >
            All
          </button>
          {kindsPresent.map((k) => {
            const meta = KIND_META[k];
            return (
              <button
                key={k}
                onClick={() => setKindFilter(k)}
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs inline-flex items-center gap-1.5",
                  kindFilter === k ? meta.bg : "bg-transparent hover:bg-white/5",
                  kindFilter === k ? meta.color : "text-white/55",
                )}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {entries.map((e) => {
          const open = !collapsed.has(e.version);
          return (
            <div
              key={e.version}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => toggle(e.version)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.03]"
              >
                <span className="text-white/40 text-xs w-3 shrink-0">
                  {open ? "▾" : "▸"}
                </span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {e.version}
                </span>
                <span className="text-xs text-white/50 tabular-nums font-mono">
                  {formatAbsolute(e.date, { preset: "date" })}
                </span>
                {e.title ? (
                  <span className="text-sm text-white/70 truncate flex-1">
                    — {e.title}
                  </span>
                ) : null}
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                    className="overflow-hidden border-t border-white/8"
                  >
                    <div className="p-4 pl-10 flex flex-col gap-4">
                      {e.sections.map((sec, i) => {
                        const items = sec.items.filter(
                          (it) => kindFilter === "all" || it.kind === kindFilter,
                        );
                        if (items.length === 0) return null;
                        return (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="text-[10px] uppercase tracking-widest text-white/40">
                              {sec.label}
                            </div>
                            <ul className="flex flex-col gap-1">
                              {items.map((it, ii) => {
                                const meta = it.kind ? KIND_META[it.kind] : null;
                                const inner = (
                                  <span className="flex items-baseline gap-2">
                                    {meta ? (
                                      <span
                                        className={cn(
                                          "shrink-0 text-[9px] uppercase tracking-widest font-semibold px-1.5 rounded",
                                          meta.bg,
                                          meta.color,
                                        )}
                                      >
                                        {meta.label}
                                      </span>
                                    ) : null}
                                    <span className="text-sm text-white/85">
                                      {it.text}
                                    </span>
                                  </span>
                                );
                                return (
                                  <li key={ii}>
                                    {it.href ? (
                                      <a
                                        href={it.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-white"
                                      >
                                        {inner}
                                      </a>
                                    ) : (
                                      inner
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
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
    </div>
  );
}
