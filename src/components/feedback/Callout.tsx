import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface CalloutProps {
  /** CSS selector or ref of element to highlight. */
  target?: string | HTMLElement | null;
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  step?: number;
  total?: number;
  onNext?: () => void;
  onPrev?: () => void;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

type Rect = { top: number; left: number; width: number; height: number };

function resolveTarget(target: CalloutProps["target"]): HTMLElement | null {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  return target;
}

export function Callout({
  target,
  open,
  onClose,
  title,
  children,
  step,
  total,
  onNext,
  onPrev,
  placement = "bottom",
  className,
}: CalloutProps) {
  const [rect, setRect] = useState<Rect | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    function measure() {
      const el = resolveTarget(target ?? null);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, target]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const tipPos = (() => {
    if (!rect) {
      return { left: window.innerWidth / 2 - 160, top: window.innerHeight / 2 - 80 };
    }
    const tipW = 320;
    const tipH = 140;
    const margin = 12;
    switch (placement) {
      case "top":
        return { left: rect.left + rect.width / 2 - tipW / 2, top: rect.top - tipH - margin };
      case "left":
        return { left: rect.left - tipW - margin, top: rect.top + rect.height / 2 - tipH / 2 };
      case "right":
        return { left: rect.left + rect.width + margin, top: rect.top + rect.height / 2 - tipH / 2 };
      case "bottom":
      default:
        return { left: rect.left + rect.width / 2 - tipW / 2, top: rect.top + rect.height + margin };
    }
  })();

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: Z.DIALOG }}
          className="fixed inset-0 pointer-events-none"
        >
          {/* Dim with cut-out */}
          {rect ? (
            <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={onClose}>
              <defs>
                <mask id="callout-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <rect
                    x={rect.left - 6}
                    y={rect.top - 6}
                    width={rect.width + 12}
                    height={rect.height + 12}
                    rx={10}
                    ry={10}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.6)"
                mask="url(#callout-mask)"
              />
              {/* Ring */}
              <rect
                x={rect.left - 4}
                y={rect.top - 4}
                width={rect.width + 8}
                height={rect.height + 8}
                rx={10}
                ry={10}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                style={{ animation: "callout-pulse 2s ease-in-out infinite" }}
              />
            </svg>
          ) : (
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
          )}

          <motion.div
            ref={tipRef}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ width: 320, ...tipPos }}
            className={cn(
              "absolute pointer-events-auto rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-4",
              className,
            )}
          >
            {step && total ? (
              <div className="text-[10px] uppercase tracking-wider text-fuchsia-300/80 mb-1">
                Step {step} of {total}
              </div>
            ) : null}
            {title ? (
              <div className="text-white font-semibold text-sm mb-1">{title}</div>
            ) : null}
            {children ? (
              <div className="text-sm text-white/70">{children}</div>
            ) : null}
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="text-xs">
                {step && total ? (
                  <div className="flex gap-1">
                    {Array.from({ length: total }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          i + 1 === step ? "bg-fuchsia-400" : "bg-white/15",
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2">
                {onPrev ? (
                  <button
                    onClick={onPrev}
                    className="text-xs px-3 py-1.5 rounded-md text-white/70 hover:bg-white/5"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  onClick={onNext ?? onClose}
                  className="text-xs px-3 py-1.5 rounded-md bg-fuchsia-500/80 hover:bg-fuchsia-500 text-white"
                >
                  {step && total && step < total ? "Next" : "Done"}
                </button>
              </div>
            </div>
          </motion.div>

          <style>{`@keyframes callout-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
          }`}</style>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
