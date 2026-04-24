import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

type Side = "right" | "left" | "bottom" | "top";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: Side;
  size?: number | string;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const positions: Record<Side, string> = {
  right: "top-0 right-0 h-full",
  left: "top-0 left-0 h-full",
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
};

const initialVariants: Record<Side, any> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

export function Drawer({
  open,
  onClose,
  side = "right",
  size = 380,
  title,
  children,
  footer,
  className,
}: DrawerProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function k(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  const sz =
    side === "top" || side === "bottom" ? { height: size } : { width: size };

  return (
    <Portal>
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            zIndex: Z.DRAWER,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          className="fixed inset-0 bg-black/55"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={initialVariants[side]}
            animate={{ x: 0, y: 0 }}
            exit={initialVariants[side]}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            onClick={(e) => e.stopPropagation()}
            style={sz}
            className={cn(
              "absolute bg-[#14141c] border border-white/10 shadow-2xl flex flex-col",
              positions[side],
              side === "right" && "rounded-l-2xl",
              side === "left" && "rounded-r-2xl",
              side === "top" && "rounded-b-2xl",
              side === "bottom" && "rounded-t-2xl",
              className,
            )}
          >
            {title ? (
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <div id={titleId} className="text-white font-semibold">
                  {title}
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  data-cursor="button"
                  className="w-8 h-8 rounded-lg grid place-items-center text-white/50 hover:text-white hover:bg-white/5"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>
            ) : null}
            <div className="flex-1 overflow-auto p-5">{children}</div>
            {footer ? (
              <div className="px-5 py-3 border-t border-white/8 bg-white/[0.02]">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </Portal>
  );
}
