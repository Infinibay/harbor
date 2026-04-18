import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { FAB } from "./FAB";

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
}

export interface SpeedDialProps {
  icon: ReactNode;
  actions: SpeedDialAction[];
  direction?: "up" | "down" | "left" | "right";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  className?: string;
}

export function SpeedDial({
  icon,
  actions,
  direction = "up",
  position = "bottom-right",
  className,
}: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const sign = direction === "up" || direction === "left" ? -1 : 1;

  return (
    <div className={cn("relative", position !== "none" && "fixed", positionsOuter[position], className)}>
      <div
        className={cn(
          "absolute flex items-center gap-2",
          direction === "up" && "bottom-full mb-3 flex-col-reverse left-1/2 -translate-x-1/2",
          direction === "down" && "top-full mt-3 flex-col left-1/2 -translate-x-1/2",
          direction === "left" && "right-full mr-3 flex-row-reverse top-1/2 -translate-y-1/2",
          direction === "right" && "left-full ml-3 flex-row top-1/2 -translate-y-1/2",
        )}
      >
        <AnimatePresence>
          {open
            ? actions.map((a, i) => (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, [axis]: 0 }}
                  animate={{ opacity: 1, [axis]: sign * (i + 1) * 0 }}
                  exit={{ opacity: 0, [axis]: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 26 }}
                  onClick={() => {
                    a.onSelect?.();
                    setOpen(false);
                  }}
                  aria-label={a.label}
                  className="group relative w-10 h-10 rounded-full bg-[#1c1c26] border border-white/10 text-white/85 hover:text-white shadow-lg grid place-items-center"
                >
                  {a.icon}
                  <span
                    className={cn(
                      "absolute whitespace-nowrap px-2 py-0.5 rounded bg-[#14141c] border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                      direction === "up" && "right-full mr-2 top-1/2 -translate-y-1/2",
                      direction === "down" && "right-full mr-2 top-1/2 -translate-y-1/2",
                      direction === "left" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
                      direction === "right" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
                    )}
                  >
                    {a.label}
                  </span>
                </motion.button>
              ))
            : null}
        </AnimatePresence>
      </div>
      <FAB
        position="none"
        icon={
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
            {icon}
          </motion.span>
        }
        label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      />
    </div>
  );
}

const positionsOuter = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
  none: "",
};
