import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CountdownTimerProps {
  target: Date | number; // Date or timestamp ms
  onComplete?: () => void;
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({
  target,
  onComplete,
  className,
  compact,
}: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const deadline = typeof target === "number" ? target : target.getTime();
  const diff = Math.max(0, deadline - now);
  useEffect(() => {
    if (diff === 0) onComplete?.();
  }, [diff, onComplete]);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const parts = [
    { v: days, l: "d", show: days > 0 || !compact },
    { v: hours, l: "h" },
    { v: mins, l: "m" },
    { v: secs, l: "s" },
  ];

  return (
    <div className={cn("inline-flex items-baseline gap-1.5", className)}>
      {parts.map((p, i) =>
        !p.show && i === 0 ? null : (
          <div
            key={p.l}
            className="inline-flex items-baseline gap-0.5 font-mono"
          >
            <div className="relative h-8 min-w-[1.6em] overflow-hidden flex items-baseline text-2xl font-semibold text-white tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={p.v}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  {String(p.v).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs text-white/40">{p.l}</span>
          </div>
        ),
      )}
    </div>
  );
}
