import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
import { Portal } from "../../lib/Portal";
import { useCursorProximity } from "../../lib/cursor";
import { Z } from "../../lib/z";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  className,
  disabled,
}: SelectProps) {
  const { t } = useT();
  const effectivePlaceholder = placeholder ?? t("harbor.select.placeholder");
  const layoutId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0 });
  const selected = options.find((o) => o.value === current);
  const { localX, localY, proximity } = useCursorProximity(anchorRef, 100);
  const glowOpacity = useTransform(proximity, (v) => v * 0.35);
  const glowBg = useTransform(
    [localX, localY] as any,
    ([lx, ly]: any) =>
      `radial-gradient(140px circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.25), transparent 60%)`,
  );

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

  function pick(v: string) {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setFocusIdx((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open) pick(options[focusIdx].value);
      else setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      {label ? (
        <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className={cn(
          "relative overflow-hidden w-full h-11 px-4 rounded-xl border bg-white/5 flex items-center justify-between text-start outline-none",
          "border-white/10 hover:bg-white/[0.07] transition-colors",
          open && "border-fuchsia-400/60",
          "focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-bloom disabled:opacity-50",
        )}
      >
        <motion.span
          aria-hidden
          style={{ opacity: glowOpacity, background: glowBg }}
          className="absolute inset-0 pointer-events-none mix-blend-soft-light rounded-[inherit]"
        />
        <span
          className={cn(
            "relative truncate text-sm flex items-center gap-2",
            selected ? "text-white" : "text-white/40",
          )}
        >
          {selected?.icon}
          {selected?.label ?? effectivePlaceholder}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="relative text-white/50"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
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
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden p-1"
            >
              <ul className="max-h-64 overflow-y-auto overflow-x-hidden">
                {options.map((o, i) => (
                  <li key={o.value} className="relative">
                    <button
                      type="button"
                      disabled={o.disabled}
                      onClick={() => pick(o.value)}
                      onMouseEnter={() => setFocusIdx(i)}
                      className={cn(
                        "relative w-full text-start ps-4 pe-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-colors",
                        focusIdx === i ? "bg-white/5" : "",
                        o.disabled && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      {current === o.value ? (
                        <motion.span
                          layoutId={`${layoutId}-select-ind`}
                          className="absolute start-1 inset-y-0 my-auto h-4 w-0.5 rounded-full bg-fuchsia-400 pointer-events-none"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      ) : null}
                      {o.icon ? (
                        <span className="text-white/60 mt-0.5">{o.icon}</span>
                      ) : null}
                      <span className="flex-1 flex flex-col gap-0.5">
                        <span className="text-white">{o.label}</span>
                        {o.description ? (
                          <span className="text-xs text-white/50">
                            {o.description}
                          </span>
                        ) : null}
                      </span>
                      {current === o.value ? (
                        <span className="text-fuchsia-300 text-xs mt-0.5">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
