import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TypingIndicatorProps {
  name?: string;
  className?: string;
}

export function TypingIndicator({ name, className }: TypingIndicatorProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl rounded-bl-md bg-white/8 border border-white/10",
        className,
      )}
    >
      {name ? (
        <span className="text-xs text-white/60">{name}</span>
      ) : null}
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-white/70"
          />
        ))}
      </span>
    </motion.div>
  );
}
