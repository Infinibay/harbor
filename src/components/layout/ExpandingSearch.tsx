import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ExpandingSearchProps {
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onChange?: (q: string) => void;
  value?: string;
  iconSize?: number;
  className?: string;
  autoCollapseOnEmpty?: boolean;
}

/**
 * Magnifier that *morphs* into a full-width search field. When placed inside
 * a MorphBar, declare it as `grow={open ? 1 : 0}` and siblings can hide via
 * `hidden={open}` or `collapsed={open}` to give this one the space.
 */
export function ExpandingSearch({
  placeholder = "Search",
  open,
  onOpenChange,
  onChange,
  value,
  iconSize = 16,
  className,
  autoCollapseOnEmpty,
}: ExpandingSearchProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const isOpen = open ?? internalOpen;
  const q = value ?? internalValue;
  const inputRef = useRef<HTMLInputElement | null>(null);

  function setOpen(v: boolean) {
    if (open === undefined) setInternalOpen(v);
    onOpenChange?.(v);
  }
  function setQ(v: string) {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
  }

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
  }
  function onBlur() {
    if (autoCollapseOnEmpty && !q) setOpen(false);
  }

  return (
    <motion.div
      layout
      className={cn(
        "relative flex items-center rounded-full transition-colors",
        isOpen
          ? "bg-white/5 border border-white/10 px-3 h-10 w-full"
          : "bg-white/5 border border-white/10 w-10 h-10 justify-center",
        className,
      )}
      onClick={() => {
        if (!isOpen) setOpen(true);
      }}
    >
      <motion.svg
        layout
        animate={{ rotate: isOpen ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("text-white/70 shrink-0", isOpen ? "mr-2" : "")}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </motion.svg>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.input
            key="input"
            ref={inputRef}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            onBlur={onBlur}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
          />
        ) : null}
      </AnimatePresence>
      {isOpen && q ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQ("");
            inputRef.current?.focus();
          }}
          className="text-white/40 hover:text-white text-sm ml-1 shrink-0"
        >
          ×
        </button>
      ) : null}
    </motion.div>
  );
}
