import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Variant = "default" | "dashed" | "inline";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: Variant;
  className?: string;
}

const containerVariants: Record<Variant, string> = {
  default: "flex flex-col items-center justify-center text-center py-10 px-4",
  dashed:
    "flex flex-col items-center justify-center text-center py-8 px-4 rounded-2xl border-2 border-dashed border-white/12",
  inline:
    "flex flex-row items-center justify-center text-left gap-3 py-4 px-4 rounded-xl border border-white/8 bg-white/[0.02]",
};

const iconBoxVariants: Record<Variant, string> = {
  default:
    "mb-4 w-16 h-16 rounded-2xl grid place-items-center bg-gradient-to-br from-white/10 to-white/0 border border-white/10 text-white/70 text-2xl",
  dashed:
    "mb-3 w-12 h-12 rounded-xl grid place-items-center bg-white/5 border border-white/10 text-white/60 text-xl",
  inline:
    "w-9 h-9 shrink-0 rounded-lg grid place-items-center bg-white/5 border border-white/10 text-white/60 text-base",
};

const titleVariants: Record<Variant, string> = {
  default: "text-white font-semibold",
  dashed: "text-white font-medium text-sm",
  inline: "text-white font-medium text-sm",
};

const descriptionVariants: Record<Variant, string> = {
  default: "text-sm text-white/55 mt-1 max-w-sm",
  dashed: "text-xs text-white/50 mt-0.5 max-w-sm",
  inline: "text-xs text-white/50 mt-0.5",
};

const textWrapVariants: Record<Variant, string> = {
  default: "",
  dashed: "",
  inline: "min-w-0 flex-1",
};

export function EmptyState({
  title,
  description,
  icon,
  actions,
  variant = "default",
  className,
}: EmptyStateProps) {
  const animateIcon = variant === "default";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={cn(containerVariants[variant], className)}
    >
      {icon ? (
        animateIcon ? (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={iconBoxVariants[variant]}
          >
            {icon}
          </motion.div>
        ) : (
          <div className={iconBoxVariants[variant]}>{icon}</div>
        )
      ) : null}
      <div className={textWrapVariants[variant]}>
        <div className={titleVariants[variant]}>{title}</div>
        {description ? (
          <div className={descriptionVariants[variant]}>{description}</div>
        ) : null}
      </div>
      {actions ? (
        <div
          className={cn(
            variant === "inline"
              ? "ml-auto flex items-center gap-2"
              : "mt-5 flex items-center gap-2",
          )}
        >
          {actions}
        </div>
      ) : null}
    </motion.div>
  );
}
