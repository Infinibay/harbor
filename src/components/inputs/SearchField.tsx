import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export interface SearchFieldProps {
  placeholder?: string;
  onSearch?: (q: string) => SearchResult[] | Promise<SearchResult[]>;
  onPick?: (r: SearchResult) => void;
  className?: string;
}

export function SearchField({
  placeholder = "Search…",
  onSearch,
  onPick,
  className,
}: SearchFieldProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0 });

  useEffect(() => {
    if (!q || !onSearch) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      const r = await onSearch(q);
      if (!cancelled) {
        setResults(r);
        setLoading(false);
      }
    }, 160);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [q, onSearch]);

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ x: r.left, y: r.bottom + 6, w: r.width });
    }
    place();
    function onClick(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <div ref={anchorRef} className={cn("relative w-full", className)}>
      <div className="relative flex h-[var(--harbor-target-input-height)] items-center rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] text-[color:var(--harbor-field-fg)] transition-colors focus-within:border-[color:var(--harbor-field-border-focus)] focus-within:bg-[var(--harbor-field-bg-focus)]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-[var(--harbor-target-control-padding-x)] text-[color:var(--harbor-field-muted-fg)]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            const nextQuery = e.target.value;
            setQ(nextQuery);
            setLoading(Boolean(nextQuery && onSearch));
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          data-cursor="text"
          className="w-full appearance-none bg-transparent pl-10 pr-10 text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]"
        />
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="sp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 w-4 h-4 rounded-full border-2 border-[rgb(var(--harbor-accent))] border-t-transparent animate-spin"
            />
          ) : q ? (
            <motion.button
              key="x"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQ("")}
              className="absolute right-3 text-[color:var(--harbor-text-tertiary)] hover:text-[color:var(--harbor-text)] text-lg"
            >
              ×
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      <Portal>
      <AnimatePresence>
        {open && q ? (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              position: "fixed",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              zIndex: Z.POPOVER,
            }}
            className="overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] shadow-[var(--harbor-target-shadow)]"
          >
            <ul className="max-h-72 overflow-auto p-1">
              <AnimatePresence initial={false}>
                {results.map((r) => (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      onClick={() => {
                        onPick?.(r);
                        setOpen(false);
                      }}
                      data-cursor="button"
                      className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-start gap-2.5 text-[color:var(--harbor-menu-item-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
                    >
                      {r.icon}
                      <span className="flex-1 flex flex-col gap-0.5">
                        <HighlightMatch text={r.title} q={q} />
                        {r.subtitle ? (
                          <span className="text-xs text-[color:var(--harbor-menu-item-muted-fg)]">
                            {r.subtitle}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {!loading && results.length === 0 ? (
                <li className="px-3 py-3 text-sm text-[color:var(--harbor-menu-item-muted-fg)]">
                  No results for “{q}”
                </li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </Portal>
    </div>
  );
}

function HighlightMatch({ text, q }: { text: string; q: string }) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1 || !q)
    return <span className="text-[color:var(--harbor-menu-item-fg)]">{text}</span>;
  return (
    <span className="text-[color:var(--harbor-menu-item-fg)]">
      {text.slice(0, idx)}
      <span className="rounded px-0.5 bg-[var(--harbor-state-selected)] text-[color:var(--harbor-state-selected-fg)]">
        {text.slice(idx, idx + q.length)}
      </span>
      {text.slice(idx + q.length)}
    </span>
  );
}
