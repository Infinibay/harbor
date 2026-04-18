import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Tone = "info" | "success" | "warning" | "danger";

const styles: Record<Tone, { bg: string; icon: string; border: string }> = {
  info: {
    bg: "bg-sky-500/8",
    border: "border-sky-400/25",
    icon: "text-sky-300",
  },
  success: {
    bg: "bg-emerald-500/8",
    border: "border-emerald-400/25",
    icon: "text-emerald-300",
  },
  warning: {
    bg: "bg-amber-500/8",
    border: "border-amber-400/25",
    icon: "text-amber-300",
  },
  danger: {
    bg: "bg-rose-500/8",
    border: "border-rose-400/25",
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
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function Alert({
  tone = "info",
  title,
  children,
  onClose,
  actions,
  className,
}: AlertProps) {
  const s = styles[tone];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl border p-4 flex gap-3",
        s.bg,
        s.border,
        className,
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full grid place-items-center font-bold text-sm flex-shrink-0",
          s.icon,
        )}
      >
        {icons[tone]}
      </div>
      <div className="flex-1 min-w-0">
        {title ? (
          <div className="text-sm font-semibold text-white">{title}</div>
        ) : null}
        {children ? (
          <div className="text-sm text-white/70 mt-0.5">{children}</div>
        ) : null}
        {actions ? (
          <div className="mt-3 flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {onClose ? (
        <button
          onClick={onClose}
          data-cursor="button"
          className="text-white/40 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      ) : null}
    </motion.div>
  );
}
