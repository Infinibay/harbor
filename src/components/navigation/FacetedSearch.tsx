import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { FilterPanel, type FilterGroup } from "./FilterPanel";

export interface SavedView {
  id: string;
  name: string;
  value: Record<string, string[]>;
  query?: string;
}

export interface FacetedSearchProps {
  /** Backwards-compatible with `FilterPanel` — same groups schema. */
  groups: readonly FilterGroup[];
  value: Record<string, string[]>;
  onChange: (v: Record<string, string[]>) => void;
  /** Search query — controlled. */
  query?: string;
  onQueryChange?: (q: string) => void;
  /** localStorage key for saved views. Default: `harbor:faceted-search`. */
  storageKey?: string;
  title?: ReactNode;
  className?: string;
}

/** Faceted search composed of: query input + active-filter chips +
 *  saved-views dropdown + FilterPanel below. Persists saved views to
 *  localStorage. */
export function FacetedSearch({
  groups,
  value,
  onChange,
  query,
  onQueryChange,
  storageKey = "harbor:faceted-search",
  title,
  className,
}: FacetedSearchProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const q = query ?? internalQuery;
  const setQ = onQueryChange ?? setInternalQuery;
  const [views, setViews] = useState<SavedView[]>([]);
  const [viewsOpen, setViewsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setViews(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [storageKey]);

  function persistViews(v: SavedView[]) {
    setViews(v);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(v));
    } catch {
      // ignore
    }
  }

  function saveCurrent() {
    const name = window.prompt("Save this view as…");
    if (!name) return;
    const newView: SavedView = {
      id: `v-${Date.now()}`,
      name,
      value,
      query: q,
    };
    persistViews([...views, newView]);
  }

  function applyView(v: SavedView) {
    onChange(v.value);
    if (v.query !== undefined) setQ(v.query);
    setViewsOpen(false);
  }

  function clearAll() {
    onChange({});
    setQ("");
  }

  // Active filters → chips
  const activeChips = useMemo(() => {
    const out: { groupId: string; groupLabel: string; value: string; label: string }[] = [];
    for (const g of groups) {
      const vs = value[g.id] ?? [];
      for (const v of vs) {
        const label = g.options.find((o) => o.value === v)?.label ?? v;
        out.push({ groupId: g.id, groupLabel: g.label, value: v, label });
      }
    }
    return out;
  }, [groups, value]);

  function removeChip(groupId: string, v: string) {
    const current = value[groupId] ?? [];
    onChange({ ...value, [groupId]: current.filter((x) => x !== v) });
  }

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white outline-none focus:border-fuchsia-400/40"
        />
        <div className="relative">
          <button
            onClick={() => setViewsOpen((v) => !v)}
            className="text-xs px-2 py-1.5 rounded-md border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/5"
          >
            Views ▾
          </button>
          <AnimatePresence>
            {viewsOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 520, damping: 32 }}
                className="absolute right-0 mt-1 w-56 rounded-md border border-white/10 bg-[#14141c] shadow-2xl z-10 p-1"
              >
                <button
                  onClick={() => {
                    saveCurrent();
                    setViewsOpen(false);
                  }}
                  className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-white/5 text-white/85"
                >
                  + Save current view
                </button>
                {views.length > 0 ? (
                  <div className="h-px my-1 bg-white/10" />
                ) : null}
                {views.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded"
                  >
                    <button
                      onClick={() => applyView(v)}
                      className="flex-1 text-left text-xs text-white/85"
                    >
                      {v.name}
                    </button>
                    <button
                      onClick={() =>
                        persistViews(views.filter((x) => x.id !== v.id))
                      }
                      className="text-[10px] text-white/35 hover:text-rose-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {activeChips.length > 0 || q ? (
          <button
            onClick={clearAll}
            className="text-xs px-2 py-1.5 rounded-md text-rose-300 hover:text-rose-200"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {activeChips.map((c) => (
            <span
              key={`${c.groupId}:${c.value}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-100 text-xs"
            >
              <span className="text-fuchsia-200/60 uppercase tracking-widest text-[9px]">
                {c.groupLabel}
              </span>
              {c.label}
              <button
                onClick={() => removeChip(c.groupId, c.value)}
                className="text-fuchsia-200/60 hover:text-fuchsia-100 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <FilterPanel
        groups={[...groups]}
        value={value}
        onChange={onChange}
        onClear={clearAll}
        title={title ?? "Filters"}
      />
    </div>
  );
}
