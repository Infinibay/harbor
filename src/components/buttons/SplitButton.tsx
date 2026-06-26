import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";

export interface SplitButtonOption {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface SplitButtonProps {
  primary: SplitButtonOption;
  options: SplitButtonOption[];
  className?: string;
  variant?: "primary" | "secondary";
}

export function SplitButton({
  primary,
  options,
  className,
  variant = "primary",
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0 });
  const popoverZ = useZIndex(Z.POPOVER);

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = caretRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const menuW = 220;
      setPos({
        x: r.right - menuW,
        y: r.bottom + 6,
        w: menuW,
      });
    }
    place();
    function click(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !caretRef.current?.contains(e.target as Node)
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

  const baseStyle =
    variant === "primary"
      ? "bg-[rgb(var(--harbor-brand))] text-[rgb(var(--harbor-brand-fg))] hover:bg-[rgb(var(--harbor-accent-2))]"
      : "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)]";

  return (
    <div className={cn("inline-flex", className)}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={primary.onSelect}
        className={cn(
          "h-10 px-4 rounded-l-xl font-medium text-sm inline-flex items-center gap-2 border-r border-[color:var(--harbor-border-default)] outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
          baseStyle,
        )}
      >
        {primary.icon}
        {primary.label}
      </motion.button>
      <motion.button
        type="button"
        ref={caretRef}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open additional actions"
        className={cn(
          "h-10 px-2.5 rounded-r-xl inline-flex items-center justify-center outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
          baseStyle,
        )}
      >
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </motion.button>
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: pos.w,
                zIndex: popoverZ,
              }}
              className="rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {options.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => {
                    o.onSelect();
                    setOpen(false);
                  }}
                  className="w-full text-left px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] rounded-[var(--harbor-menu-item-radius)] flex items-start gap-[var(--harbor-menu-item-gap)] text-[length:var(--harbor-menu-item-font-size)] hover:bg-[var(--harbor-menu-item-hover-bg)] transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]"
                >
                  {o.icon ? (
                    <span className="text-[rgb(var(--harbor-text-muted))] mt-0.5">{o.icon}</span>
                  ) : null}
                  <span className="flex-1">
                    <span className="block text-sm text-[rgb(var(--harbor-text))]">
                      {o.label}
                    </span>
                    {o.description ? (
                      <span className="block text-xs text-[rgb(var(--harbor-text-muted))] mt-0.5">
                        {o.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
