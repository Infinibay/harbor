import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface HotkeyRecorderProps {
  value?: string[];
  onChange?: (combo: string[]) => void;
  label?: string;
  className?: string;
}

const MODS = ["Meta", "Control", "Alt", "Shift"] as const;
const SYMBOLS: Record<string, string> = {
  Meta: "⌘",
  Control: "⌃",
  Alt: "⌥",
  Shift: "⇧",
  Backspace: "⌫",
  Enter: "↵",
  Tab: "⇥",
  Escape: "⎋",
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  " ": "␣",
};

function pretty(k: string) {
  return SYMBOLS[k] ?? k.toUpperCase();
}

export function HotkeyRecorder({
  value,
  onChange,
  label = "Shortcut",
  className,
}: HotkeyRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const held = useRef<Set<string>>(new Set());
  const boxRef = useRef<HTMLButtonElement | null>(null);
  const currentKeys = value ?? keys;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!recording) return;
    e.preventDefault();
    if (e.key === "Escape") {
      setRecording(false);
      return;
    }
    held.current.add(e.key);
    const mods = MODS.filter((m) => {
      if (m === "Meta") return e.metaKey;
      if (m === "Control") return e.ctrlKey;
      if (m === "Alt") return e.altKey;
      if (m === "Shift") return e.shiftKey;
      return false;
    });
    const primary =
      !MODS.includes(e.key as (typeof MODS)[number]) && e.key !== " "
        ? e.key
        : e.key === " "
          ? " "
          : null;
    const combo = [...mods, ...(primary ? [primary] : [])];
    if (primary) {
      if (value === undefined) setKeys(combo);
      onChange?.(combo);
      setRecording(false);
    }
  }

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      {label ? (
        <span className="text-[11px] uppercase tracking-wider text-[color:var(--harbor-field-muted-fg)]">
          {label}
        </span>
      ) : null}
      <div className="relative inline-flex min-w-[160px]">
        <motion.button
          ref={boxRef}
          onClick={() => {
            setRecording(true);
            setTimeout(() => boxRef.current?.focus(), 0);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setRecording(false)}
          type="button"
          animate={{ scale: recording ? 1.01 : 1 }}
          style={{
            borderColor: recording
              ? "var(--harbor-focus-ring)"
              : "var(--harbor-field-border)",
          }}
          className="relative h-9 w-full px-3 rounded-lg bg-[var(--harbor-field-bg)] border flex items-center gap-1.5 text-left outline-none focus:bg-[var(--harbor-field-bg-focus)]"
        >
          {recording ? (
            <span className="text-xs text-[rgb(var(--harbor-danger))] inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--harbor-danger))] animate-pulse" />
              Press keys...
            </span>
          ) : currentKeys.length > 0 ? (
            currentKeys.map((k, i) => (
              <kbd
                key={i}
                className="min-w-[22px] h-6 px-1.5 grid place-items-center rounded bg-[var(--harbor-state-hover)] border border-[color:var(--harbor-border-subtle)] text-[color:var(--harbor-field-fg)] text-[11px] font-mono"
              >
                {pretty(k)}
              </kbd>
            ))
          ) : (
            <span className="text-xs text-[color:var(--harbor-text-tertiary)]">Click to record</span>
          )}
        </motion.button>
        {!recording && currentKeys.length > 0 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (value === undefined) setKeys([]);
              onChange?.([]);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--harbor-text-tertiary)] hover:text-[color:var(--harbor-field-fg)] text-xs"
          >
            clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
