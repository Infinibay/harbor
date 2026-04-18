import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Z } from "../../lib/z";
import { Portal } from "../../lib/Portal";

type Tone = "default" | "success" | "warning" | "danger" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  tone?: Tone;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

const ToastCtx = createContext<{
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const toneStyles: Record<Tone, string> = {
  default: "border-white/10",
  success: "border-emerald-400/40",
  warning: "border-amber-400/40",
  danger: "border-rose-400/40",
  info: "border-sky-400/40",
};

const toneBar: Record<Tone, string> = {
  default: "bg-white/20",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-rose-400",
  info: "bg-sky-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++idRef.current;
      const duration = t.duration ?? 4000;
      setToasts((ts) => [...ts, { ...t, id }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <Portal>
      <div style={{ zIndex: Z.TOAST }} className="fixed bottom-6 right-6 flex flex-col items-end gap-2 pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-xl border bg-[#14141c]/95 backdrop-blur-xl shadow-2xl min-w-[280px] max-w-sm",
                toneStyles[t.tone ?? "default"],
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  toneBar[t.tone ?? "default"],
                )}
              />
              <div className="pl-4 pr-3 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">
                    {t.title}
                  </div>
                  {t.description ? (
                    <div className="text-xs text-white/60 mt-0.5">
                      {t.description}
                    </div>
                  ) : null}
                </div>
                {t.action ? (
                  <button
                    onClick={() => {
                      t.action!.onClick();
                      dismiss(t.id);
                    }}
                    data-cursor="button"
                    className="text-xs font-medium text-fuchsia-300 hover:text-fuchsia-200 px-2 py-1"
                  >
                    {t.action.label}
                  </button>
                ) : null}
                <button
                  onClick={() => dismiss(t.id)}
                  data-cursor="button"
                  aria-label="Dismiss"
                  className="text-white/40 hover:text-white text-lg leading-none"
                >
                  ×
                </button>
              </div>
              {(t.duration ?? 4000) > 0 ? (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: (t.duration ?? 4000) / 1000,
                    ease: "linear",
                  }}
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 origin-left",
                    toneBar[t.tone ?? "default"],
                    "opacity-50",
                  )}
                />
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </Portal>
    </ToastCtx.Provider>
  );
}
