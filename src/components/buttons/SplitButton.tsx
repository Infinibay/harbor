import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

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
      ? "bg-white text-black hover:bg-white/90"
      : "bg-white/10 text-white border border-white/15 hover:bg-white/15";

  return (
    <div className={cn("inline-flex", className)}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={primary.onSelect}
        className={cn(
          "h-10 px-4 rounded-l-xl font-medium text-sm inline-flex items-center gap-2 border-r border-black/10",
          baseStyle,
        )}
      >
        {primary.icon}
        {primary.label}
      </motion.button>
      <motion.button
        ref={caretRef}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-10 px-2.5 rounded-r-xl inline-flex items-center justify-center",
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
                zIndex: Z.POPOVER,
              }}
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
            >
              {options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    o.onSelect();
                    setOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-md flex items-start gap-2.5 hover:bg-white/5 transition-colors"
                >
                  {o.icon ? (
                    <span className="text-white/55 mt-0.5">{o.icon}</span>
                  ) : null}
                  <span className="flex-1">
                    <span className="block text-sm text-white">
                      {o.label}
                    </span>
                    {o.description ? (
                      <span className="block text-xs text-white/45 mt-0.5">
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
