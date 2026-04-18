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
        <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full min-h-11 px-3 py-2 rounded-xl border bg-white/5 flex flex-wrap items-center gap-1.5 text-left outline-none transition-colors",
          "border-white/10 hover:bg-white/[0.07]",
          open && "border-fuchsia-400/60",
        )}
      >
        <AnimatePresence initial={false}>
          {selectedItems.length === 0 ? (
            <span className="text-white/40 text-sm px-1">{placeholder}</span>
          ) : (
            selectedItems.map((o) => (
              <motion.span
                key={o.value}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200 text-xs"
              >
                {o.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(o.value);
                  }}
                  className="text-fuchsia-300/70 hover:text-white"
                >
                  ×
                </button>
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
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden"
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full px-4 py-3 bg-transparent text-white text-sm outline-none border-b border-white/10 placeholder:text-white/30"
              />
              <ul className="max-h-60 overflow-auto p-1">
                {filtered.map((o) => {
                  const on = value.includes(o.value);
                  return (
                    <li key={o.value}>
                      <button
                        onClick={() => toggle(o.value)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-white/5"
                      >
                        <span className="inline-flex items-center gap-2 text-white">
                          {o.icon}
                          {o.label}
                        </span>
                        <motion.span
                          animate={{
                            background: on
                              ? "linear-gradient(135deg,#a855f7,#38bdf8)"
                              : "rgba(255,255,255,0.03)",
                            borderColor: on
                              ? "transparent"
                              : "rgba(255,255,255,0.18)",
                          }}
                          className="w-4 h-4 rounded border grid place-items-center"
                        >
                          {on ? (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12 L10 17 L19 7" />
                            </svg>
                          ) : null}
                        </motion.span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-sm text-white/40">
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
