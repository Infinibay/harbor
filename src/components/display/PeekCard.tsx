import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

/**
 * Hover a card → it expands in place revealing `more`. Siblings in a Peek.Grid
 * reflow smoothly because of `layout` on every card.
 */
export interface PeekCardProps {
  title: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  more: ReactNode;
  className?: string;
}

export function PeekCard({
  title,
  description,
  media,
  children,
  more,
  className,
}: PeekCardProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      ref={ref}
      layout
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn(
        "relative rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden cursor-pointer",
        className,
      )}
    >
      {media ? <motion.div layout>{media}</motion.div> : null}
      <motion.div layout className="p-4">
        <motion.div layout className="text-white font-medium">
          {title}
        </motion.div>
        {description ? (
          <motion.div layout className="text-sm text-white/55 mt-0.5">
            {description}
          </motion.div>
        ) : null}
        {children ? (
          <motion.div layout className="mt-3">
            {children}
          </motion.div>
        ) : null}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="more"
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.25 },
                opacity: { duration: 0.2, delay: 0.05 },
              }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/8 text-sm text-white/75">
                {more}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function PeekGrid({
  children,
  className,
  cols = 3,
}: {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}) {
  const grid =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";
  return (
    <motion.div layout className={cn("grid gap-3 items-start", grid, className)}>
      {children}
    </motion.div>
  );
}
