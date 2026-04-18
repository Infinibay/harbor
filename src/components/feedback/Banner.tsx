import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Tone = "info" | "success" | "warning" | "danger" | "promo";

export interface BannerProps {
  open?: boolean;
  tone?: Tone;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  sticky?: boolean;
  className?: string;
}

const tones: Record<Tone, string> = {
  info: "bg-sky-500/15 border-sky-400/30 text-sky-100",
  success: "bg-emerald-500/15 border-emerald-400/30 text-emerald-100",
  warning: "bg-amber-500/15 border-amber-400/30 text-amber-100",
  danger: "bg-rose-500/15 border-rose-400/30 text-rose-100",
  promo:
    "bg-gradient-to-r from-fuchsia-500/25 via-sky-500/20 to-emerald-500/20 border-white/15 text-white",
};

export function Banner({
  open = true,
  tone = "info",
  icon,
  title,
  children,
  actions,
  onClose,
  sticky,
  className,
}: BannerProps) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          layout
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative w-full border-y backdrop-blur-md",
            tones[tone],
            sticky && "sticky top-0 z-20",
            className,
          )}
        >
          <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
            {icon ? <span className="shrink-0">{icon}</span> : null}
            <div className="flex-1 min-w-0">
              {title ? (
                <span className="font-medium">{title}</span>
              ) : null}
              {title && children ? <span className="mx-2 opacity-50">·</span> : null}
              {children ? (
                <span className="opacity-90">{children}</span>
              ) : null}
            </div>
            {actions ? <div className="shrink-0 flex gap-2">{actions}</div> : null}
            {onClose ? (
              <button
                onClick={onClose}
                className="shrink-0 w-6 h-6 grid place-items-center rounded opacity-70 hover:opacity-100 hover:bg-white/10"
                aria-label="Dismiss"
              >
                ×
              </button>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
