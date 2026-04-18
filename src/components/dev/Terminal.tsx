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
  className?: string;
}

const colors = {
  out: "text-white/80",
  cmd: "text-white",
  err: "text-rose-300",
  info: "text-sky-300",
};

export function Terminal({
  lines,
  prompt = "$",
  title = "terminal",
  height = 260,
  autoScroll = true,
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
        "rounded-xl overflow-hidden border border-white/10 bg-black/70 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8 bg-white/[0.02]">
        <span className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        </span>
        <span className="text-xs text-white/55 font-mono">{title}</span>
      </div>
      <div
        ref={ref}
        style={{ height }}
        className="overflow-auto p-3 font-mono text-[12.5px] leading-relaxed"
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
                <span className="text-emerald-400 mr-2 select-none">
                  {prompt}
                </span>
              ) : null}
              {l.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="inline-block w-2 h-4 bg-white/80 align-middle animate-pulse" />
      </div>
    </div>
  );
}
