import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";

export interface ComboboxOption {
  value: string;
  label: string;
  keywords?: string[];
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  emptyText?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select or search…",
  label,
  className,
  emptyText = "No matches",
}: ComboboxProps) {
  const selected = options.find((o) => o.value === value);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0 });
  const popoverZ = useZIndex(Z.POPOVER);

  // Compute position synchronously before paint when opening — if this
  // runs in a plain `useEffect` the menu flashes at {0,0} with width 0
  // on its very first open (the `rect` state is still stale), which is
  // what the opening animation "starts from" and looks broken.
  useLayoutEffect(() => {
    if (!open) return;
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.bottom + 6, w: r.width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ x: r.left, y: r.bottom + 6, w: r.width });
    }
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

  const filtered = options.filter((o) => {
    if (!q) return true;
    const hay = [o.label, ...(o.keywords ?? [])].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className={cn("relative w-full", className)}>
      {label ? (
        <label className="block text-xs text-fg-muted mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-[var(--harbor-target-input-height)] w-full items-center justify-between rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] text-[color:var(--harbor-field-fg)] outline-none transition-colors",
          "border-[color:var(--harbor-field-border)] hover:bg-[var(--harbor-field-bg-hover)]",
          open && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
        )}
      >
        <span
          className={cn(
            "truncate text-[length:var(--harbor-target-font-size)]",
            selected ? "text-fg" : "text-fg-subtle",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <span className="text-xs text-fg-subtle">⌄</span>
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
              zIndex: popoverZ,
            }}
            className="overflow-hidden rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] shadow-[var(--harbor-menu-surface-shadow)]"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              data-cursor="text"
              className="w-full appearance-none border-b border-[color:var(--harbor-field-border)] bg-transparent px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)]"
            />
            <ul className="max-h-60 overflow-auto p-1">
              <AnimatePresence initial={false}>
                {filtered.map((o) => (
                  <motion.li
                    layout
                    key={o.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      onClick={() => {
                        onChange?.(o.value);
                        setOpen(false);
                        setQ("");
                      }}
                      data-cursor="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-left text-[length:var(--harbor-menu-item-font-size)] hover:bg-[var(--harbor-menu-item-hover-bg)]",
                        value === o.value && "bg-white/5 text-fg",
                      )}
                    >
                      <span className="text-fg">{o.label}</span>
                      {value === o.value ? (
                        <span className="text-fuchsia-300 text-xs">✓</span>
                      ) : null}
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-fg-subtle">
                  {emptyText}
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
