import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
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
  "aria-label"?: string;
  /** Control density. `"md"` (default) matches Harbor's standard input
   *  row (44px). `"sm"` is a compact 28px variant for toolbars,
   *  pagination bars, chrome — anywhere a full-size input would
   *  overwhelm the surrounding UI. */
  size?: "sm" | "md";
  /** How wide the dropdown menu should be.
   *  - `"trigger"` (default) — match the trigger's width exactly.
   *  - `"auto"` — at least the trigger's width, grows with the longest option.
   *  - a CSS length (`240`, `"16rem"`, `"min(90vw, 400px)"`) — fixed width. */
  menuWidth?: "trigger" | "auto" | number | string;
  className?: string;
  disabled?: boolean;
}

const SIZE_TRIGGER: Record<NonNullable<SelectProps["size"]>, string> = {
  sm: "h-[calc(var(--harbor-target-input-height)-8px)] px-[calc(var(--harbor-target-control-padding-x)-4px)] text-xs rounded-[var(--harbor-target-radius)]",
  md: "h-[var(--harbor-target-input-height)] px-[var(--harbor-target-control-padding-x)] text-[length:var(--harbor-target-font-size)] rounded-[var(--harbor-target-radius)]",
};
const SIZE_LABEL: Record<NonNullable<SelectProps["size"]>, string> = {
  sm: "text-xs",
  md: "text-sm",
};
const SIZE_CHEVRON: Record<NonNullable<SelectProps["size"]>, number> = {
  sm: 12,
  md: 14,
};

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  "aria-label": ariaLabel,
  size = "md",
  menuWidth = "trigger",
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
  const glowX = useTransform(localX, (v) => `${v * 100}%`);
  const glowY = useTransform(localY, (v) => `${v * 100}%`);
  const glowBg = useMotionTemplate`radial-gradient(140px circle at ${glowX} ${glowY}, var(--harbor-state-hover), transparent 60%)`;

  // Synchronous initial placement — prevents a first-frame flash at
  // {0,0} while the rect-measuring effect catches up.
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
        <label className="block text-xs text-[color:var(--harbor-field-muted-fg)] mb-1.5">{label}</label>
      ) : null}
      <button
        ref={anchorRef}
        type="button"
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className={cn(
          "relative flex w-full items-center justify-between overflow-hidden border bg-[var(--harbor-field-bg)] text-start text-[color:var(--harbor-field-fg)] outline-none",
          SIZE_TRIGGER[size],
          "border-[color:var(--harbor-field-border)] transition-colors hover:bg-[var(--harbor-field-bg-hover)]",
          open && "border-[color:var(--harbor-field-border-focus)] bg-[var(--harbor-field-bg-focus)]",
          "focus-visible:shadow-[var(--harbor-focus-shadow)] focus-bloom disabled:opacity-50",
        )}
      >
        <motion.span
          aria-hidden
          style={{ opacity: glowOpacity, background: glowBg }}
          className="absolute inset-0 pointer-events-none mix-blend-soft-light rounded-[inherit]"
        />
        <span
          className={cn(
            "relative truncate flex items-center gap-2",
            SIZE_LABEL[size],
            selected
              ? "text-[color:var(--harbor-field-fg)]"
              : "text-[color:var(--harbor-field-muted-fg)]",
          )}
        >
          {selected?.icon}
          {selected?.label ?? effectivePlaceholder}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          width={SIZE_CHEVRON[size]}
          height={SIZE_CHEVRON[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="relative text-[color:var(--harbor-field-muted-fg)]"
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
                ...(menuWidth === "trigger"
                  ? { width: rect.w }
                  : menuWidth === "auto"
                    ? { minWidth: rect.w, maxWidth: "min(90vw, 480px)" }
                    : { width: typeof menuWidth === "number" ? menuWidth : menuWidth, minWidth: rect.w }),
                zIndex: Z.POPOVER,
              }}
              className="overflow-hidden rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
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
                        "relative flex w-full items-center gap-[var(--harbor-menu-item-gap)] rounded-[var(--harbor-menu-item-radius)] py-[var(--harbor-menu-item-padding-y)] ps-[var(--harbor-menu-item-padding-x)] pe-3 text-start text-[length:var(--harbor-menu-item-font-size)] transition-colors",
                        focusIdx === i ? "bg-[var(--harbor-menu-item-hover-bg)]" : "",
                        o.disabled && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      {current === o.value ? (
                        <motion.span
                          layoutId={`${layoutId}-select-ind`}
                          className="absolute start-1 inset-y-0 my-auto h-4 w-0.5 rounded-full bg-[rgb(var(--harbor-accent))] pointer-events-none"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      ) : null}
                      {o.icon ? (
                        <span className="text-[color:var(--harbor-menu-item-muted-fg)] mt-0.5">{o.icon}</span>
                      ) : null}
                      <span className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[color:var(--harbor-menu-item-fg)]">{o.label}</span>
                        {o.description ? (
                          <span className="text-xs text-[color:var(--harbor-menu-item-muted-fg)]">
                            {o.description}
                          </span>
                        ) : null}
                      </span>
                      {current === o.value ? (
                        <span className="text-[color:var(--harbor-focus-ring)] text-xs mt-0.5">
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
