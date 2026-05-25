import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (v: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  label,
  placeholder = "Select options…",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ x: r.left, y: r.bottom + 6, w: r.width });
    }
    place();
    function click(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", click);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", click);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function toggle(v: string) {
    onChange?.(
      value.includes(v) ? value.filter((x) => x !== v) : [...value, v],
    );
  }

  const filtered = options.filter((o) =>
    !q ? true : o.label.toLowerCase().includes(q.toLowerCase()),
  );
  const selectedItems = options.filter((o) => value.includes(o.value));

  return (
    <div className={cn("relative w-full", className)}>
      {label ? (
        <label className="block text-xs text-[color:var(--harbor-field-muted-fg)] mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex min-h-[var(--harbor-target-input-height)] w-full flex-wrap items-center gap-1.5 rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-left text-[color:var(--harbor-field-fg)] outline-none transition-colors",
          "border-[color:var(--harbor-field-border)] hover:bg-[var(--harbor-field-bg-hover)]",
          open && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
        )}
      >
        <AnimatePresence initial={false}>
          {selectedItems.length === 0 ? (
            <span className="px-1 text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-placeholder)]">{placeholder}</span>
          ) : (
            selectedItems.map((o) => (
              <motion.span
                key={o.value}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border bg-[var(--harbor-state-selected)] border-[color:var(--harbor-border-focus)] text-[color:var(--harbor-state-selected-fg)] text-xs"
              >
                {o.label}
                <span
                  aria-hidden
                  className="text-[color:var(--harbor-field-muted-fg)]"
                >
                  ×
                </span>
              </motion.span>
            ))
          )}
        </AnimatePresence>
      </button>
      <Portal>
        <AnimatePresence>
          {open ? (
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
              className="overflow-hidden rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full appearance-none border-b border-[color:var(--harbor-field-border)] bg-transparent px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]"
              />
              <ul className="max-h-60 overflow-auto p-1">
                {filtered.map((o) => {
                  const on = value.includes(o.value);
                  return (
                    <li key={o.value}>
                      <button
                        onClick={() => toggle(o.value)}
                        className="flex w-full items-center justify-between rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-left text-[length:var(--harbor-menu-item-font-size)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
                      >
                        <span className="inline-flex items-center gap-2 text-[color:var(--harbor-menu-item-fg)]">
                          {o.icon}
                          {o.label}
                        </span>
                        <span
                          className="w-4 h-4 rounded border grid place-items-center"
                          style={{
                            background: on
                              ? "linear-gradient(135deg,rgb(var(--harbor-brand)),rgb(var(--harbor-accent-2)))"
                              : "var(--harbor-field-bg)",
                            borderColor: on
                              ? "transparent"
                              : "var(--harbor-field-border)",
                          }}
                        >
                          {on ? (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="rgb(var(--harbor-brand-fg))"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12 L10 17 L19 7" />
                            </svg>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-sm text-[color:var(--harbor-menu-item-muted-fg)]">
                    No matches
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
