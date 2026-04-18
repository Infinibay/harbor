import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

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

  const filtered = options.filter((o) => {
    if (!q) return true;
    const hay = [o.label, ...(o.keywords ?? [])].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className={cn("relative w-full", className)}>
      {label ? (
        <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-white/5 flex items-center justify-between transition-colors outline-none",
          "border-white/10 hover:bg-white/[0.07]",
          open && "border-fuchsia-400/60",
        )}
      >
        <span
          className={cn(
            "text-sm truncate",
            selected ? "text-white" : "text-white/40",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <span className="text-white/40 text-xs">⌄</span>
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
            className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              data-cursor="text"
              className="w-full px-4 py-3 bg-transparent text-white text-sm outline-none border-b border-white/10 placeholder:text-white/30"
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
                        "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-white/5",
                        value === o.value && "bg-white/5 text-white",
                      )}
                    >
                      <span className="text-white">{o.label}</span>
                      {value === o.value ? (
                        <span className="text-fuchsia-300 text-xs">✓</span>
                      ) : null}
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-white/40">
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
