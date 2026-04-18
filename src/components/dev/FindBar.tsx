import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FindBarProps {
  open: boolean;
  onClose: () => void;
  total?: number;
  current?: number;
  onChange?: (q: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onReplace?: (find: string, replace: string) => void;
  showReplace?: boolean;
  caseSensitive?: boolean;
  onCaseToggle?: (v: boolean) => void;
  regex?: boolean;
  onRegexToggle?: (v: boolean) => void;
  className?: string;
}

export function FindBar({
  open,
  onClose,
  total = 0,
  current = 0,
  onChange,
  onNext,
  onPrev,
  onReplace,
  showReplace: showReplaceProp = false,
  caseSensitive,
  onCaseToggle,
  regex,
  onRegexToggle,
  className,
}: FindBarProps) {
  const [q, setQ] = useState("");
  const [r, setR] = useState("");
  const [showReplace, setShowReplace] = useState(showReplaceProp);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className={cn(
            "flex flex-col gap-1 p-2 rounded-xl bg-[#14141c]/95 border border-white/10 shadow-2xl backdrop-blur-md min-w-[360px]",
            className,
          )}
        >
          <div className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="ml-1.5 text-white/50 shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onChange?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.shiftKey ? onPrev?.() : onNext?.();
                }
              }}
              placeholder="Find"
              className="flex-1 min-w-0 h-7 px-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
            />
            <span className="text-[11px] font-mono text-white/45 px-1 whitespace-nowrap">
              {total > 0 ? `${current}/${total}` : q ? "0/0" : ""}
            </span>
            <FToggle
              active={caseSensitive}
              onClick={() => onCaseToggle?.(!caseSensitive)}
              title="Match case"
            >
              Aa
            </FToggle>
            <FToggle
              active={regex}
              onClick={() => onRegexToggle?.(!regex)}
              title="Use regex"
            >
              .*
            </FToggle>
            <span className="w-px h-4 bg-white/10 mx-0.5" />
            <FIcon onClick={onPrev} title="Previous match (⇧⏎)">
              ↑
            </FIcon>
            <FIcon onClick={onNext} title="Next match (⏎)">
              ↓
            </FIcon>
            {onReplace ? (
              <FIcon
                onClick={() => setShowReplace((s) => !s)}
                title="Replace"
              >
                ⇅
              </FIcon>
            ) : null}
            <span className="w-px h-4 bg-white/10 mx-0.5" />
            <FIcon onClick={onClose} title="Close (Esc)">
              ×
            </FIcon>
          </div>
          <AnimatePresence>
            {showReplace && onReplace ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                <span className="w-[14px] ml-1.5" />
                <input
                  value={r}
                  onChange={(e) => setR(e.target.value)}
                  placeholder="Replace"
                  className="flex-1 min-w-0 h-7 px-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
                <button
                  onClick={() => onReplace(q, r)}
                  className="h-7 px-2 text-xs text-white rounded bg-white/10 hover:bg-white/15"
                >
                  Replace
                </button>
                <button
                  onClick={() => onReplace(q, r)}
                  className="h-7 px-2 text-xs text-white rounded bg-white/10 hover:bg-white/15"
                >
                  All
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FIcon({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 grid place-items-center text-white/60 hover:bg-white/5 hover:text-white rounded text-xs"
    >
      {children}
    </button>
  );
}

function FToggle({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "w-7 h-7 grid place-items-center rounded text-[11px] font-mono transition-colors",
        active
          ? "bg-fuchsia-500/20 text-fuchsia-200"
          : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
