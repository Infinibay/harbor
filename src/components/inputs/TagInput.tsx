import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "Add tag…",
  label,
  className,
}: TagInputProps) {
  const [internal, setInternal] = useState(defaultValue);
  const tags = value ?? internal;
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);

  function set(next: string[]) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function add() {
    const t = q.trim();
    if (!t || tags.includes(t)) return;
    set([...tags, t]);
    setQ("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !q && tags.length) {
      set(tags.slice(0, -1));
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      ) : null}
      <div
        onClick={() => {
          document.getElementById("tag-input-inner")?.focus();
        }}
        className={cn(
          "flex flex-wrap gap-1.5 p-2 rounded-xl bg-white/5 border min-h-11 transition-colors",
          "border-white/10",
          focus && "border-fuchsia-400/60 bg-white/[0.07]",
        )}
      >
        <AnimatePresence initial={false}>
          {tags.map((t) => (
            <motion.span
              key={t}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200 text-xs"
            >
              {t}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  set(tags.filter((x) => x !== t));
                }}
                data-cursor="button"
                className="text-fuchsia-300/70 hover:text-white"
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          id="tag-input-inner"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={tags.length === 0 ? placeholder : ""}
          data-cursor="text"
          className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white placeholder:text-white/35 px-1"
        />
      </div>
    </div>
  );
}
