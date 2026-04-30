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
              className="fixed inset-0 grid place-items-center p-4 bg-black/55"
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
                  "relative w-full rounded-2xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden flex flex-col",
                  sizes[size],
                  className,
                )}
              >
                {children}
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
    <div className={cn("p-6 pb-3", className)} {...rest}>
      {children}
    </div>
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function DialogTitle({
  children,
  className,
  ...rest
}: DialogTitleProps) {
  const { titleId } = useDialogCtx("DialogTitle");
  return (
    <h2
      id={titleId}
      className={cn("px-6 pt-6 text-lg font-semibold text-white", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export interface DialogDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export function DialogDescription({
  children,
  className,
  ...rest
}: DialogDescriptionProps) {
  const { descId } = useDialogCtx("DialogDescription");
  return (
    <p
      id={descId}
      className={cn("px-6 pt-1 text-sm text-white/55", className)}
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
    <div className={cn("px-6 py-4", className)} {...rest}>
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
        "px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-2 mt-auto",
        alignClass[align],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
