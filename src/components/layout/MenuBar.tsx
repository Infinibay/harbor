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
          "flex items-center gap-0.5 px-1 h-7 text-[13px]",
          className,
        )}
      >
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              ref={(el) => {
                itemRefs.current[it.id] = el;
              }}
              onClick={() => (isActive ? setActive(null) : openMenu(it.id))}
              onMouseEnter={() => {
                if (active) openMenu(it.id);
              }}
              className={cn(
                "px-2 h-full rounded-md transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/5 hover:text-white",
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
                zIndex: Z.POPOVER,
                minWidth: 220,
              }}
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
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
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLButtonElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    const r = rowRef.current?.getBoundingClientRect();
    if (r) setPos({ x: r.right - 2, y: r.top - 4 });
  }, [open]);

  if (entry.separator) {
    return <div className="h-px bg-white/8 my-1" />;
  }

  return (
    <>
      <button
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
          "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-left transition-colors",
          entry.disabled
            ? "text-white/30 cursor-not-allowed"
            : entry.danger
              ? "text-rose-300 hover:bg-white/5"
              : "text-white/85 hover:bg-white/5",
        )}
      >
        <span className="w-4 grid place-items-center text-white/50">
          {entry.checked ? "✓" : entry.icon ?? null}
        </span>
        <span className="flex-1 truncate">{entry.label}</span>
        {entry.shortcut ? (
          <span className="text-[11px] text-white/40 font-mono">
            {entry.shortcut}
          </span>
        ) : null}
        {entry.submenu ? (
          <span className="text-white/40 text-xs">›</span>
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
                zIndex: Z.SUBMENU,
                minWidth: 200,
              }}
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
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
