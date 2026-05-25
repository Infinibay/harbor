import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { focusFirst, trapFocus, useDismissableLayer } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
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

const initialVariants: Record<Side, { x?: string; y?: string }> = {
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
  const { t } = useT();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useDismissableLayer({
    ref: drawerRef,
    enabled: open,
    onDismiss: onClose,
  });

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => {
      if (drawerRef.current) focusFirst(drawerRef.current);
    });
    return () => {
      window.clearTimeout(id);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [open]);

  function onDrawerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (drawerRef.current) trapFocus(drawerRef.current, event);
  }

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
          className="fixed inset-0 bg-[var(--harbor-overlay-scrim)]"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            ref={drawerRef}
            tabIndex={-1}
            initial={initialVariants[side]}
            animate={{ x: 0, y: 0 }}
            exit={initialVariants[side]}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onDrawerKeyDown}
            style={sz}
            className={cn(
              "absolute flex flex-col border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] shadow-[var(--harbor-menu-surface-shadow)] outline-none",
              positions[side],
              side === "right" && "rounded-l-[var(--harbor-target-radius)]",
              side === "left" && "rounded-r-[var(--harbor-target-radius)]",
              side === "top" && "rounded-b-[var(--harbor-target-radius)]",
              side === "bottom" && "rounded-t-[var(--harbor-target-radius)]",
              className,
            )}
          >
            {title ? (
              <div className="flex items-center justify-between border-b border-[color:var(--harbor-border-subtle)] px-[var(--harbor-target-panel-padding)] py-[var(--harbor-target-control-padding-y)]">
                <div id={titleId} className="font-semibold text-[rgb(var(--harbor-text))]">
                  {title}
                </div>
                <button
                  type="button"
                  aria-label={t("harbor.action.close")}
                  onClick={onClose}
                  data-cursor="button"
                  className="grid h-[calc(var(--harbor-target-control-height)-4px)] w-[calc(var(--harbor-target-control-height)-4px)] place-items-center rounded-[var(--harbor-target-radius)] text-[rgb(var(--harbor-text-muted))] outline-none hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))] focus-visible:shadow-[var(--harbor-focus-shadow)]"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>
            ) : null}
            <div className="flex-1 overflow-auto p-[var(--harbor-target-panel-padding)]">{children}</div>
            {footer ? (
              <div className="border-t border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] px-[var(--harbor-target-panel-padding)] py-[var(--harbor-target-control-padding-y)]">
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
