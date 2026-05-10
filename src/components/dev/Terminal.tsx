import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TerminalLine {
  id: string | number;
  kind?: "out" | "cmd" | "err" | "info";
  text: ReactNode;
}

export interface TerminalProps {
  lines: TerminalLine[];
  prompt?: string;
  title?: string;
  height?: number | string;
  autoScroll?: boolean;
  variant?: "window" | "console";
  className?: string;
}

const colors = {
  out: "text-[color:var(--harbor-terminal-muted-fg)]",
  cmd: "text-[color:var(--harbor-terminal-fg)]",
  err: "text-[color:var(--harbor-terminal-error)]",
  info: "text-[color:var(--harbor-terminal-info)]",
};

export function Terminal({
  lines,
  prompt = "$",
  title = "terminal",
  height = 260,
  autoScroll = true,
  variant = "window",
  className,
}: TerminalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (autoScroll && ref.current)
      ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, autoScroll]);

  return (
    <div
      className={cn(
        "overflow-hidden border text-[color:var(--harbor-terminal-fg)]",
        "border-[color:var(--harbor-terminal-border)] bg-[var(--harbor-terminal-bg)] shadow-[var(--harbor-terminal-shadow)]",
        variant === "window"
          ? "rounded-[var(--harbor-terminal-radius)] backdrop-blur"
          : "rounded-[var(--harbor-workbench-radius,var(--harbor-radius-sm))]",
        className,
      )}
    >
      {variant === "window" ? (
        <div className="flex items-center gap-2 border-b border-[color:var(--harbor-terminal-border)] bg-[var(--harbor-terminal-header-bg)] px-3 py-2">
          <span className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </span>
          <span className="font-mono text-xs text-[color:var(--harbor-terminal-muted-fg)]">{title}</span>
        </div>
      ) : title ? (
        <div className="border-b border-[color:var(--harbor-terminal-border)] px-[var(--harbor-terminal-padding)] py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--harbor-terminal-muted-fg)]">
          {title}
        </div>
      ) : null}
      <div
        ref={ref}
        style={{ height }}
        className="overflow-auto p-[var(--harbor-terminal-padding)] font-mono text-[length:var(--harbor-terminal-font-size)] leading-[var(--harbor-terminal-line-height)]"
      >
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.div
              key={l.id}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={cn("whitespace-pre-wrap", colors[l.kind ?? "out"])}
            >
              {l.kind === "cmd" ? (
                <span className="mr-2 select-none text-emerald-400 text-[color:var(--harbor-terminal-prompt)]">
                  {prompt}
                </span>
              ) : null}
              {l.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="inline-block h-4 w-2 animate-pulse bg-[var(--harbor-terminal-cursor)] align-middle" />
      </div>
    </div>
  );
}
