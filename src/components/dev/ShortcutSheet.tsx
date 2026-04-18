import { useMemo, useState } from "react";
import { Dialog } from "../overlays/Dialog";

export interface ShortcutItem {
  keys: string[];
  description: string;
}
export interface ShortcutGroup {
  title: string;
  items: ShortcutItem[];
}
export interface ShortcutSheetProps {
  open: boolean;
  onClose: () => void;
  groups: ShortcutGroup[];
}

export function ShortcutSheet({ open, onClose, groups }: ShortcutSheetProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return groups;
    const needle = q.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            it.description.toLowerCase().includes(needle) ||
            it.keys.join(" ").toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, q]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Keyboard shortcuts"
      size="lg"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search shortcuts…"
        autoFocus
        className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-fuchsia-400/60 placeholder:text-white/30"
      />
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-h-[55vh] overflow-auto pr-2">
        {filtered.map((g) => (
          <div key={g.title}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-2">
              {g.title}
            </div>
            <ul className="space-y-1">
              {g.items.map((it, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <span className="text-sm text-white/80">
                    {it.description}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    {it.keys.map((k, j) => (
                      <kbd
                        key={j}
                        className="min-w-[22px] h-6 px-1.5 grid place-items-center rounded bg-white/10 border border-white/10 text-white text-[11px] font-mono"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
