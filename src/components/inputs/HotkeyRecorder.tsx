import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
  value = [],
  onChange,
  label = "Shortcut",
  className,
}: HotkeyRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [keys, setKeys] = useState<string[]>(value);
  const held = useRef<Set<string>>(new Set());
  const boxRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setKeys(value);
  }, [value]);

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
      setKeys(combo);
      onChange?.(combo);
      setRecording(false);
    }
  }

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      {label ? (
        <span className="text-[11px] uppercase tracking-wider text-white/50">
          {label}
        </span>
      ) : null}
      <motion.button
        ref={boxRef}
        onClick={() => {
          setRecording(true);
          setTimeout(() => boxRef.current?.focus(), 0);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setRecording(false)}
        animate={
          recording
            ? { borderColor: "rgba(244, 114, 182, 0.8)" }
            : { borderColor: "rgba(255,255,255,0.12)" }
        }
        className="relative h-9 px-3 min-w-[160px] rounded-lg bg-white/5 border flex items-center gap-1.5 text-left outline-none focus:bg-white/[0.08]"
      >
        {recording ? (
          <span className="text-xs text-rose-300 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Press keys…
          </span>
        ) : keys.length > 0 ? (
          keys.map((k, i) => (
            <kbd
              key={i}
              className="min-w-[22px] h-6 px-1.5 grid place-items-center rounded bg-white/10 border border-white/10 text-white text-[11px] font-mono"
            >
              {pretty(k)}
            </kbd>
          ))
        ) : (
          <span className="text-xs text-white/40">Click to record</span>
        )}
        {!recording && keys.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setKeys([]);
              onChange?.([]);
            }}
            className="ml-auto text-white/40 hover:text-white text-xs"
          >
            clear
          </button>
        ) : null}
      </motion.button>
    </div>
  );
}
