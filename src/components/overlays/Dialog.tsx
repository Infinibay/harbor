import {
  createContext,
  useContext,
  useEffect,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

/* ------------------------------------------------------------------ *
 *  Dialog — composable.
 *
 *  The recommended API uses subcomponents:
 *
 *    <Dialog open={open} onClose={close}>
 *      <DialogTitle>Delete project?</DialogTitle>
 *      <DialogDescription>This action can't be undone.</DialogDescription>
 *      <DialogBody>…</DialogBody>
 *      <DialogButtons align="end">
 *        <Button variant="ghost" onClick={close}>Cancel</Button>
 *        <Button variant="destructive" onClick={confirm}>Delete</Button>
 *      </DialogButtons>
 *    </Dialog>
 *
 *  The legacy prop-driven API (title / description / footer / footerAlign)
 *  still works — it forwards to the same internals — so existing call
 *  sites don't have to migrate immediately. New code should prefer the
 *  subcomponent form.
 * ------------------------------------------------------------------ */

export type DialogAlign = "start" | "center" | "end" | "between";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  footerAlign?: DialogAlign;
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

type Ctx = { titleId: string; descId: string };
const DialogCtx = createContext<Ctx | null>(null);

function useDialogCtx(component: string): Ctx {
  const ctx = useContext(DialogCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Dialog>.`);
  }
  return ctx;
}

export function Dialog({
  open,
  onClose,
  children,
  size = "md",
  title,
  description,
  footer,
  footerAlign = "end",
  className,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const { t } = useT();
  const legacy = title !== undefined || description !== undefined || footer !== undefined;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <DialogCtx.Provider value={{ titleId, descId }}>
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
              className="fixed inset-0 grid place-items-center bg-black/55 p-[var(--harbor-target-panel-padding)]"
              onClick={onClose}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "relative flex w-full flex-col overflow-hidden rounded-[var(--harbor-target-radius)] border border-white/10 bg-surface-2 text-fg shadow-[var(--harbor-target-shadow)]",
                  sizes[size],
                  className,
                )}
              >
                {title !== undefined ? <DialogTitle>{title}</DialogTitle> : null}
                {description !== undefined ? <DialogDescription>{description}</DialogDescription> : null}
                {legacy ? <DialogBody>{children}</DialogBody> : children}
                {footer !== undefined ? <DialogButtons align={footerAlign}>{footer}</DialogButtons> : null}
                <button
                  type="button"
                  aria-label={t("harbor.action.close")}
                  onClick={onClose}
                  data-cursor="button"
                  className="absolute end-3 top-3 grid h-[calc(var(--harbor-target-control-height)-4px)] w-[calc(var(--harbor-target-control-height)-4px)] place-items-center rounded-[var(--harbor-target-radius)] text-fg-muted hover:bg-white/5 hover:text-fg"
                >
                  <span aria-hidden>×</span>
                </button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </DialogCtx.Provider>
  );
}

/* ---------- Subcomponents ---------- */

/**
 * Wrapper that pairs a title with an optional description. Most callers
 * skip this and put <DialogTitle>+<DialogDescription> at the top of
 * <Dialog> directly — this is just for visual grouping when both are
 * present and you want consistent padding.
 */
export function DialogHeader({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-[calc(var(--harbor-target-panel-padding)+4px)] pb-[var(--harbor-target-panel-padding)]", className)} {...rest}>
      {children}
    </div>
  );
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function DialogTitle({
  children,
  className,
  ...rest
}: DialogTitleProps) {
  const { titleId } = useDialogCtx("DialogTitle");
  return (
    <h2
      id={titleId}
      className={cn("px-[calc(var(--harbor-target-panel-padding)+4px)] pt-[calc(var(--harbor-target-panel-padding)+4px)] text-lg font-semibold text-fg", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function DialogDescription({
  children,
  className,
  ...rest
}: DialogDescriptionProps) {
  const { descId } = useDialogCtx("DialogDescription");
  return (
    <p
      id={descId}
      className={cn("px-[calc(var(--harbor-target-panel-padding)+4px)] pt-1 text-[length:var(--harbor-target-font-size)] text-fg-muted", className)}
      {...rest}
    >
      {children}
    </p>
  );
}

/** Body region. Provides the standard horizontal padding plus a
 *  bottom-of-modal gap before the action row. Pass anything inside. */
export function DialogBody({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-[calc(var(--harbor-target-panel-padding)+4px)] py-[var(--harbor-target-panel-padding)]", className)} {...rest}>
      {children}
    </div>
  );
}

const alignClass: Record<DialogAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export interface DialogButtonsProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of action buttons. Defaults to `"end"` —
   *  primary action on the right, OK / Cancel pattern. Use `"between"`
   *  when you have a destructive option that should sit to the far left
   *  separate from the safe options. */
  align?: DialogAlign;
}

/** Action row with consistent padding, gap, divider, and alignment.
 *  Pairs naturally with `<Button>` children. */
export function DialogButtons({
  align = "end",
  children,
  className,
  ...rest
}: DialogButtonsProps) {
  return (
    <div
      className={cn(
        "mt-auto flex items-center gap-[var(--harbor-target-gap)] border-t border-white/5 bg-white/[0.02] px-[calc(var(--harbor-target-panel-padding)+4px)] py-[var(--harbor-target-panel-padding)]",
        alignClass[align],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
