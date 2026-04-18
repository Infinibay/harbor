import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CopyButtonProps {
  value: string;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function CopyButton({
  value,
  children,
  className,
  size = "md",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  const s = size === "sm" ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs";
  return (
    <motion.button
      onClick={copy}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 font-medium overflow-hidden",
        s,
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="ok"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="inline-flex items-center gap-1.5 text-emerald-300"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12 L10 17 L19 7" />
            </svg>
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="inline-flex items-center gap-1.5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {children ?? "Copy"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
