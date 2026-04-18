import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface InlineEditProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  as?: "text" | "heading";
}

export function InlineEdit({
  value,
  onChange,
  placeholder = "Click to edit",
  className,
  as = "text",
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => ref.current?.select());
    }
  }, [editing, value]);

  function commit() {
    const v = draft.trim();
    if (v !== value) onChange(v);
    setEditing(false);
  }
  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  const size =
    as === "heading" ? "text-xl font-semibold" : "text-sm";

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 min-w-[120px]",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.form
            key="e"
            layoutId="inline-edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              commit();
            }}
            className="flex items-center gap-1 flex-1"
          >
            <input
              ref={ref}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancel();
                }
              }}
              className={cn(
                "bg-white/5 border border-fuchsia-400/60 rounded-md px-2 py-1 text-white outline-none w-full",
                size,
              )}
              placeholder={placeholder}
            />
          </motion.form>
        ) : (
          <motion.button
            key="v"
            layoutId="inline-edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(true)}
            className={cn(
              "group inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors text-left",
              size,
              value ? "text-white" : "text-white/40",
            )}
          >
            {value || placeholder}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/35 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
