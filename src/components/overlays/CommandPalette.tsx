import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../lib/i18n";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface Command {
  id: string;
  label: string;
  section?: string;
  icon?: ReactNode;
  shortcut?: string;
  keywords?: string[];
  action: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  commands: Command[];
  placeholder?: string;
}

function score(target: string, q: string) {
  if (!q) return 1;
  let ti = 0;
  let s = 0;
  for (const c of q) {
    const i = target.indexOf(c, ti);
    if (i === -1) return 0;
    s += i === ti ? 2 : 1;
    ti = i + 1;
  }
  return s;
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder,
}: CommandPaletteProps) {
  const { t } = useT();
  const effectivePlaceholder =
    placeholder ?? t("harbor.commandPalette.placeholder");
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    return commands
      .map((c) => ({
        c,
        s: Math.max(
          score(c.label.toLowerCase(), lower),
          ...(c.keywords ?? []).map((k) => score(k.toLowerCase(), lower)),
        ),
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.c);
  }, [commands, q]);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const c = filtered[idx];
        if (c) {
          c.action();
          onOpenChange(false);
          setQ("");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx, filtered, onOpenChange]);

  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach((c) => {
      const k = c.section ?? "Actions";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Portal>
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            zIndex: Z.COMMAND_PALETTE,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          className="fixed inset-0 flex items-start justify-center bg-black/55 px-[var(--harbor-target-panel-padding)] pt-[calc(50vh-28px)]"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("harbor.commandPalette.title")}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] text-fg shadow-[var(--harbor-menu-surface-shadow)]"
          >
            <div className="flex items-center gap-[var(--harbor-target-gap)] border-b border-white/8 px-[var(--harbor-target-panel-padding)] py-[var(--harbor-target-control-padding-y)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-fg-subtle"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                aria-label={effectivePlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={effectivePlaceholder}
                data-cursor="text"
                className="flex-1 appearance-none bg-transparent text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]"
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                {t("harbor.commandPalette.escKey")}
              </kbd>
            </div>
            <ul
              ref={listRef}
              className="max-h-[50vh] space-y-2 overflow-auto p-[var(--harbor-menu-surface-padding)]"
            >
              {grouped.map(([section, items]) => (
                <li key={section}>
                  <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                    {section}
                  </div>
                  <ul>
                    <AnimatePresence initial={false}>
                      {items.map((c) => {
                        const i = filtered.indexOf(c);
                        return (
                          <motion.li
                            key={c.id}
                            layout
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            onMouseEnter={() => setIdx(i)}
                          >
                            <button
                              onClick={() => {
                                c.action();
                                onOpenChange(false);
                                setQ("");
                              }}
                              data-cursor="button"
                              className={`flex w-full items-center gap-[var(--harbor-menu-item-gap)] rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-left text-[length:var(--harbor-menu-item-font-size)] ${
                                idx === i ? "bg-[var(--harbor-menu-item-hover-bg)]" : ""
                              }`}
                            >
                              {c.icon ? (
                                <span className="text-fg-muted">{c.icon}</span>
                              ) : null}
                              <span className="flex-1 text-fg">
                                {c.label}
                              </span>
                              {c.shortcut ? (
                                <span className="font-mono text-[10px] text-fg-subtle">
                                  {c.shortcut}
                                </span>
                              ) : null}
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-fg-subtle">
                  No commands match “{q}”
                </li>
              ) : null}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </Portal>
  );
}
