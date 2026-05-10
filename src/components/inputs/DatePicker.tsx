import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Calendar } from "./Calendar";
import { Z } from "../../lib/z";

export interface DatePickerProps {
  value?: Date;
  onChange?: (d: Date) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ x: r.left, y: r.bottom + 6 });
    }
    place();
    function click(e: MouseEvent) {
      if (
        !popRef.current?.contains(e.target as Node) &&
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

  return (
    <div className={cn("relative w-full", className)}>
      {label ? (
        <label className="block text-xs text-fg-muted mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-[var(--harbor-target-input-height)] w-full items-center gap-[var(--harbor-target-gap)] rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] text-left text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] outline-none transition-colors",
          "border-[color:var(--harbor-field-border)] hover:bg-[var(--harbor-field-bg-hover)]",
          open && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
        )}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-fg-muted"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
        </svg>
        <span className={value ? "text-fg" : "text-fg-subtle"}>
          {value
            ? value.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : placeholder}
        </span>
      </button>
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: Z.POPOVER,
              }}
            >
              <Calendar
                value={value}
                onChange={(d) => {
                  onChange?.(d);
                  setOpen(false);
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
