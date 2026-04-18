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
 * Circle magnifier + sliding input. The circle keeps its shape and size
 * (it's a distinct pill-button with its own bg/border); when open, an
 * input field slides in beside it with its own pill. Drop inside a
 * MorphBar with `grow={open ? 1 : 0}` on the MorphItem and siblings
 * with `hidden={open}` to make room.
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
        "flex items-center",
        isOpen ? "w-full gap-2" : "w-10",
        className,
      )}
    >
      <motion.button
        layout
        type="button"
        onClick={() => setOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/70 hover:bg-white/10 transition-colors"
      >
        <motion.svg
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
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </motion.svg>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="field"
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1 min-w-0 h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-3"
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKey}
              onBlur={onBlur}
              placeholder={placeholder}
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
            />
            {q ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQ("");
                  inputRef.current?.focus();
                }}
                className="text-white/40 hover:text-white text-sm ml-2 shrink-0"
              >
                ×
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
