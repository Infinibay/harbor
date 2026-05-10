import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface MentionUser {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
}

export interface MentionInputProps {
  users: MentionUser[];
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function MentionInput({
  users,
  value,
  onChange,
  onSubmit,
  placeholder = "Type @ to mention someone…",
  className,
  rows = 3,
}: MentionInputProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function updateTriggerFromCaret() {
    const el = taRef.current;
    if (!el) return;
    const caret = el.selectionStart;
    const before = value.slice(0, caret);
    const m = /@([\w-]*)$/.exec(before);
    if (!m) {
      setQuery(null);
      return;
    }
    setQuery(m[1]);
    const r = el.getBoundingClientRect();
    // Rough positioning — place popup below the input.
    setPos({ top: r.bottom + 4, left: r.left + 8 });
  }

  useEffect(() => {
    updateTriggerFromCaret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filtered = query
    ? users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.handle?.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  function insertMention(u: MentionUser) {
    const el = taRef.current;
    if (!el) return;
    const caret = el.selectionStart;
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const replaced = before.replace(/@([\w-]*)$/, `@${u.handle ?? u.name.replace(/\s+/g, "")} `);
    const next = replaced + after;
    onChange(next);
    setQuery(null);
    requestAnimationFrame(() => {
      const newCaret = replaced.length;
      el.focus();
      el.setSelectionRange(newCaret, newCaret);
    });
  }

  return (
    <div className={cn("relative w-full", className)}>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (query !== null && filtered.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % filtered.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a - 1 + filtered.length) % filtered.length);
            } else if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              insertMention(filtered[active]);
            } else if (e.key === "Escape") {
              setQuery(null);
            }
          } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            onSubmit?.(value);
          }
        }}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none placeholder:text-[color:var(--harbor-field-placeholder)] focus:border-[color:var(--harbor-field-border-focus)]"
      />
      <Portal>
        <AnimatePresence>
          {query !== null && filtered.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: Z.POPOVER,
                width: 260,
              }}
              className="max-h-[240px] overflow-auto rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-menu-surface-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              {filtered.map((u, i) => (
                <button
                  key={u.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => insertMention(u)}
                  className={cn(
                    "flex w-full items-center gap-[var(--harbor-menu-item-gap)] rounded-[var(--harbor-menu-item-radius)] px-[var(--harbor-menu-item-padding-x)] py-[var(--harbor-menu-item-padding-y)] text-left text-[length:var(--harbor-menu-item-font-size)]",
                    i === active
                      ? "bg-[var(--harbor-menu-item-hover-bg)] text-[color:var(--harbor-field-fg)]"
                      : "text-[color:var(--harbor-menu-item-fg)]",
                  )}
                >
                  <Avatar name={u.name} size="sm" />
                  <span className="flex-1 truncate">
                    <span className="text-[color:var(--harbor-field-fg)]">{u.name}</span>
                    {u.handle ? (
                      <span className="ml-1 text-[color:var(--harbor-field-muted-fg)]">@{u.handle}</span>
                    ) : null}
                  </span>
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
