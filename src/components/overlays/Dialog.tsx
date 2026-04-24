import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Horizontal alignment of footer contents. Defaults to `end`. */
  footerAlign?: "start" | "center" | "end" | "between";
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

const footerAlignClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  footerAlign = "end",
  className,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <Portal>
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            zIndex: Z.DIALOG,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          className="fixed inset-0 grid place-items-center p-4 bg-black/55"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full rounded-2xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden",
              sizes[size],
              className,
            )}
          >
            {(title || description) && (
              <div className="p-6 pb-3">
                {title ? (
                  <h2 id={titleId} className="text-lg font-semibold text-white">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p id={descId} className="text-sm text-white/55 mt-1">
                    {description}
                  </p>
                ) : null}
              </div>
            )}
            {children ? <div className="px-6 pb-6">{children}</div> : null}
            {footer ? (
              <div
                className={cn(
                  "px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-2",
                  footerAlignClass[footerAlign],
                )}
              >
                {footer}
              </div>
            ) : null}
            <button
              type="button"
              aria-label={t("harbor.action.close")}
              onClick={onClose}
              data-cursor="button"
              className="absolute top-3 end-3 w-8 h-8 rounded-lg grid place-items-center text-white/50 hover:text-white hover:bg-white/5"
            >
              <span aria-hidden>×</span>
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </Portal>
  );
}
