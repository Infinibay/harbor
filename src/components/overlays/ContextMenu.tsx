import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";

export interface ContextMenuProps {
  children: ReactNode;
  menu: ReactNode;
  className?: string;
}

export function ContextMenu({ children, menu, className }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const contextMenuZ = useZIndex(Z.CONTEXT_MENU);

  function onContext(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    requestAnimationFrame(() => {
      const mr = menuRef.current?.getBoundingClientRect();
      if (mr) {
        if (x + mr.width > window.innerWidth - 8)
          x = window.innerWidth - mr.width - 8;
        if (y + mr.height > window.innerHeight - 8)
          y = window.innerHeight - mr.height - 8;
        setPos({ x, y });
      }
    });
    setPos({ x, y });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function click(e: globalThis.MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      onContextMenu={onContext}
      className={cn("relative", className)}
    >
      {children}
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: contextMenuZ,
                transformOrigin: "top left",
              }}
              className="min-w-[200px] rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {menu}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
