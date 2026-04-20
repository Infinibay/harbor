import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Tone = "info" | "success" | "warning" | "danger";
type Size = "sm" | "md";
type Layout = "stack" | "inline";

const styles: Record<Tone, { bg: string; icon: string; border: string }> = {
  info: {
    bg: "bg-[rgb(var(--harbor-bg-elev-2))]",
    border: "border-sky-400/45",
    icon: "text-sky-300",
  },
  success: {
    bg: "bg-[rgb(var(--harbor-bg-elev-2))]",
    border: "border-emerald-400/45",
    icon: "text-emerald-300",
  },
  warning: {
    bg: "bg-[rgb(var(--harbor-bg-elev-2))]",
    border: "border-amber-400/45",
    icon: "text-amber-300",
  },
  danger: {
    bg: "bg-[rgb(var(--harbor-bg-elev-2))]",
    border: "border-rose-400/45",
    icon: "text-rose-300",
  },
};

const icons = {
  info: "ⓘ",
  success: "✓",
  warning: "!",
  danger: "⚠",
};

export interface AlertProps {
  tone?: Tone;
  /** Visual density. `sm` = field-level inline warnings, `md` = full alert (default). */
  size?: Size;
  /** `stack` (default) — title above body, actions beneath.
   *  `inline` — title + body + actions in a single row, clipped to one line. */
  layout?: Layout;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function Alert({
  tone = "info",
  size = "md",
  layout = "stack",
  title,
  children,
  onClose,
  actions,
  icon,
  className,
}: AlertProps) {
  const s = styles[tone];
  const sm = size === "sm";
  const inline = layout === "inline";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative border",
        sm ? "rounded-lg px-3 py-2 gap-2 text-xs" : "rounded-xl p-4 gap-3 text-sm",
        inline ? "flex items-center" : "flex",
        s.bg,
        s.border,
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full grid place-items-center font-bold flex-shrink-0",
          sm ? "w-4 h-4 text-[10px]" : "w-6 h-6 text-sm",
          s.icon,
        )}
      >
        {icon ?? icons[tone]}
      </div>
      <div
        className={cn(
          "flex-1 min-w-0",
          inline && "flex items-center gap-3",
        )}
      >
        {title ? (
          <div
            className={cn(
              "font-semibold text-white",
              sm ? "text-xs" : "text-sm",
              inline && "truncate",
            )}
          >
            {title}
          </div>
        ) : null}
        {children ? (
          <div
            className={cn(
              "text-white/70",
              sm ? "text-xs" : "text-sm",
              !inline && (title ? "mt-0.5" : ""),
              inline && "truncate flex-1",
            )}
          >
            {children}
          </div>
        ) : null}
        {actions ? (
          <div
            className={cn(
              "flex items-center gap-2",
              inline ? "ml-auto" : sm ? "mt-2" : "mt-3",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
      {onClose ? (
        <button
          onClick={onClose}
          data-cursor="button"
          className={cn(
            "text-white/40 hover:text-white leading-none",
            sm ? "text-sm" : "text-lg",
          )}
        >
          ×
        </button>
      ) : null}
    </motion.div>
  );
}
