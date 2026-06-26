import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";

export interface MenuBarItemDef {
  id: string;
  label: string;
  children?: MenuBarEntry[];
}

export interface MenuBarEntry {
  id: string;
  label?: ReactNode;
  shortcut?: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  submenu?: MenuBarEntry[];
  onSelect?: () => void;
}

export interface MenuBarProps {
  items: MenuBarItemDef[];
  className?: string;
}

export function MenuBar({ items, className }: MenuBarProps) {
  const popoverZ = useZIndex(Z.POPOVER);
  const [active, setActive] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const barRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function openMenu(id: string) {
    const btn = itemRefs.current[id];
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPos({ x: r.left, y: r.bottom });
    setActive(id);
  }

  useEffect(() => {
    if (!active) return;
    function click(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !barRef.current?.contains(e.target as Node)
      )
        setActive(null);
    }
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = items.findIndex((i) => i.id === active);
        if (idx < 0) return;
        const next =
          e.key === "ArrowRight"
            ? (idx + 1) % items.length
            : (idx - 1 + items.length) % items.length;
        openMenu(items[next].id);
      }
    }
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [active, items]);

  const activeItem = items.find((i) => i.id === active);

  return (
    <>
      <div
        ref={barRef}
        className={cn(
          "flex items-center h-[var(--harbor-menu-bar-height)] gap-[var(--harbor-menu-bar-gap)] px-[var(--harbor-menu-bar-padding-x)] text-[length:var(--harbor-workbench-font-size,var(--harbor-text-sm))]",
          className,
        )}
      >
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              type="button"
              key={it.id}
              ref={(el) => {
                itemRefs.current[it.id] = el;
              }}
              onClick={() => (isActive ? setActive(null) : openMenu(it.id))}
              onMouseEnter={() => {
                if (active) openMenu(it.id);
              }}
              className={cn(
                "h-full px-[var(--harbor-menu-trigger-padding-x)] rounded-[var(--harbor-menu-trigger-radius)] transition-colors",
                isActive
                  ? "bg-[var(--harbor-menu-trigger-active-bg)] text-[color:var(--harbor-menu-trigger-active-fg)]"
                  : "text-[color:var(--harbor-menu-trigger-fg)] hover:bg-[var(--harbor-menu-trigger-hover-bg)] hover:text-[color:var(--harbor-menu-trigger-active-fg)]",
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>

      <Portal>
        <AnimatePresence>
          {activeItem?.children ? (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y + 2,
                zIndex: popoverZ,
                minWidth: "var(--harbor-menu-min-width)",
              }}
              className="rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {activeItem.children.map((c) => (
                <MenuBarRow
                  key={c.id}
                  entry={c}
                  onClose={() => setActive(null)}
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}

function MenuBarRow({
  entry,
  onClose,
}: {
  entry: MenuBarEntry;
  onClose: () => void;
}) {
  const submenuZ = useZIndex(Z.SUBMENU);
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLButtonElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hasLeading = entry.checked || entry.icon;

  useEffect(() => {
    if (!open) return;
    const r = rowRef.current?.getBoundingClientRect();
    if (r) setPos({ x: r.right - 2, y: r.top - 4 });
  }, [open]);

  if (entry.separator) {
    return <div className="my-1 h-px bg-[var(--harbor-menu-separator)]" />;
  }

  return (
    <>
      <button
        type="button"
        ref={rowRef}
        disabled={entry.disabled}
        onMouseEnter={() => entry.submenu && setOpen(true)}
        onMouseLeave={() => entry.submenu && setOpen(false)}
        onClick={() => {
          if (entry.submenu) return;
          entry.onSelect?.();
          onClose();
        }}
        className={cn(
          [
            "flex w-full items-center text-left transition-colors",
            "gap-[var(--harbor-menu-item-gap)] rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)]",
            "text-[length:var(--harbor-menu-item-font-size)]",
          ].join(" "),
          entry.disabled
            ? "cursor-not-allowed text-[color:var(--harbor-menu-item-disabled-fg)]"
            : entry.danger
              ? "text-[color:var(--harbor-menu-item-danger-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
              : "text-[color:var(--harbor-menu-item-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]",
        )}
      >
        {hasLeading ? (
          <span className="grid w-[var(--harbor-menu-item-icon-width)] place-items-center text-[color:var(--harbor-menu-item-muted-fg)]">
            {entry.checked ? "✓" : entry.icon}
          </span>
        ) : null}
        <span className="flex-1 truncate">{entry.label}</span>
        {entry.shortcut ? (
          <span className="font-mono text-[length:var(--harbor-workbench-font-size-xs,var(--harbor-text-xs))] text-[color:var(--harbor-menu-item-muted-fg)]">
            {entry.shortcut}
          </span>
        ) : null}
        {entry.submenu ? (
          <span className="text-xs text-[color:var(--harbor-menu-item-muted-fg)]">›</span>
        ) : null}
      </button>
      <Portal>
        <AnimatePresence>
          {open && entry.submenu ? (
            <motion.div
              ref={subRef}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: submenuZ,
                minWidth: "var(--harbor-menu-submenu-min-width)",
              }}
              className="rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {entry.submenu.map((s) => (
                <MenuBarRow key={s.id} entry={s} onClose={onClose} />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
