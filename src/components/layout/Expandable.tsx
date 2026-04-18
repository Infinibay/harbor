import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

/**
 * Two states, shared layout: the collapsed element (e.g. a magnifier icon)
 * visually morphs into the expanded one (e.g. a full search field).
 * Use inside a MorphBar if you want siblings to yield space.
 */
export interface ExpandableProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  collapsed: ReactNode;
  expanded: ReactNode;
  expandOn?: "click" | "focus";
  closeOnEscape?: boolean;
  closeOnBlur?: boolean;
  className?: string;
  expandedClassName?: string;
}

export function Expandable({
  open,
  defaultOpen,
  onOpenChange,
  collapsed,
  expanded,
  expandOn = "click",
  closeOnEscape = true,
  closeOnBlur = true,
  className,
  expandedClassName,
}: ExpandableProps) {
  const [internal, setInternal] = useState(!!defaultOpen);
  const isOpen = open ?? internal;
  const ref = useRef<HTMLDivElement | null>(null);

  function setOpen(v: boolean) {
    if (open === undefined) setInternal(v);
    onOpenChange?.(v);
  }

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    function k(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [isOpen, closeOnEscape]);

  useEffect(() => {
    if (!isOpen || !closeOnBlur) return;
    function click(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [isOpen, closeOnBlur]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onFocus={expandOn === "focus" ? () => setOpen(true) : undefined}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="expanded"
            layout
            layoutId="expandable-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn("w-full", expandedClassName)}
          >
            {expanded}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            layout
            layoutId="expandable-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={expandOn === "click" ? () => setOpen(true) : undefined}
          >
            {collapsed}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
