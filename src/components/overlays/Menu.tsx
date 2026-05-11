import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Z } from "../../lib/z";
import { Portal } from "../../lib/Portal";

/** Open/close state for the root menu. Exported so other right-click
 *  containers (e.g. `Canvas`) can share the same contract — any
 *  `MenuItem` beneath this context calls `close()` after its click. */
export const MenuCtx = createContext<{
  close: () => void;
} | null>(null);

export interface MenuProps {
  trigger: ReactElement<any>;
  children: ReactNode;
  side?: "bottom" | "right";
  align?: "start" | "end";
  className?: string;
}

export function Menu({
  trigger,
  children,
  side = "bottom",
  align = "start",
  className,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const a = anchorRef.current;
      const m = menuRef.current;
      if (!a || !m) return;
      const ar = a.getBoundingClientRect();
      const mr = m.getBoundingClientRect();
      let x = ar.left;
      let y = ar.bottom + 6;
      if (side === "right") {
        x = ar.right + 6;
        y = ar.top;
      }
      if (align === "end") x = ar.right - mr.width;
      if (x + mr.width > window.innerWidth - 8)
        x = window.innerWidth - mr.width - 8;
      if (y + mr.height > window.innerHeight - 8)
        y = Math.max(8, ar.top - mr.height - 6);
      setPos({ x, y });
    }
    place();
    function click(e: globalThis.MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", place);
    };
  }, [open, side, align]);

  const clone = cloneElement(trigger, {
    ref: (el: HTMLElement | null) => {
      anchorRef.current = el;
      const ref = (trigger as any).ref;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as any).current = el;
    },
    onClick: (e: any) => {
      trigger.props.onClick?.(e);
      setOpen((o) => !o);
    },
  } as any);

  return (
    <MenuCtx.Provider value={{ close: () => setOpen(false) }}>
      {clone}
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: Z.POPOVER,
              }}
              className={cn(
                "min-w-[200px] rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]",
                className,
              )}
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </MenuCtx.Provider>
  );
}

export interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  submenu?: ReactNode;
  className?: string;
}

export function MenuItem({
  children,
  onClick,
  icon,
  shortcut,
  danger,
  disabled,
  submenu,
  className,
}: MenuItemProps) {
  const ctx = useContext(MenuCtx);
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLButtonElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open || !submenu) return;
    const a = itemRef.current;
    const s = subRef.current;
    if (!a || !s) return;
    const ar = a.getBoundingClientRect();
    const sr = s.getBoundingClientRect();
    let x = ar.right - 4;
    let y = ar.top - 4;
    if (x + sr.width > window.innerWidth - 8) x = ar.left - sr.width + 4;
    if (y + sr.height > window.innerHeight - 8)
      y = window.innerHeight - sr.height - 8;
    setPos({ x, y });
  }, [open, submenu]);

  function onEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (submenu) setOpen(true);
  }
  function onLeave() {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }

  function handle(e: MouseEvent) {
    if (disabled) return;
    if (!submenu) {
      onClick?.();
      ctx?.close();
    } else {
      e.stopPropagation();
    }
  }

  return (
    <>
      <button
        type="button"
        ref={itemRef}
        onClick={handle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        disabled={disabled}
        aria-expanded={submenu ? open : undefined}
        data-cursor="button"
        className={cn(
          "flex w-full items-center gap-[var(--harbor-menu-item-gap)] rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-left text-[length:var(--harbor-menu-item-font-size)] outline-none transition-colors",
          danger
            ? "text-[color:var(--harbor-menu-item-danger-fg)]"
            : "text-[color:var(--harbor-menu-item-fg)]",
          !disabled && "hover:bg-[var(--harbor-menu-item-hover-bg)]",
          disabled && "opacity-40 cursor-not-allowed",
          className,
        )}
      >
        {icon ? (
          <span
            className={cn(
              "grid h-[var(--harbor-target-icon-size)] w-[var(--harbor-target-icon-size)] flex-shrink-0 place-items-center",
              danger
                ? "text-[color:var(--harbor-menu-item-danger-fg)]"
                : "text-[color:var(--harbor-menu-item-muted-fg)]",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="flex-1 truncate">{children}</span>
        {shortcut ? (
          <span className="font-mono text-[10px] text-[color:var(--harbor-menu-item-muted-fg)]">
            {shortcut}
          </span>
        ) : null}
        {submenu ? (
          <span className="text-xs text-[color:var(--harbor-menu-item-muted-fg)]">›</span>
        ) : null}
      </button>
      <Portal>
        <AnimatePresence>
          {open && submenu ? (
            <motion.div
              ref={subRef}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              initial={{ opacity: 0, x: -4, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -4, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: Z.SUBMENU,
              }}
              className="min-w-[180px] rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {submenu}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-[var(--harbor-menu-separator)]" />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-[10px] font-semibold uppercase tracking-wider text-[color:var(--harbor-menu-item-muted-fg)]">
      {children}
    </div>
  );
}
