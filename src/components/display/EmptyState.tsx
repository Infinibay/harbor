import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className,
      )}
    >
      {icon ? (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4 w-16 h-16 rounded-2xl grid place-items-center bg-gradient-to-br from-white/10 to-white/0 border border-white/10 text-white/70 text-2xl"
        >
          {icon}
        </motion.div>
      ) : null}
      <div className="text-white font-semibold">{title}</div>
      {description ? (
        <div className="text-sm text-white/55 mt-1 max-w-sm">{description}</div>
      ) : null}
      {actions ? (
        <div className="mt-5 flex items-center gap-2">{actions}</div>
      ) : null}
    </motion.div>
  );
}
