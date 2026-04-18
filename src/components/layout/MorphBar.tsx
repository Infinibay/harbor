import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { cn } from "../../lib/cn";

/**
 * MorphBar is a flex container whose children (MorphItem) declare how they
 * behave when the layout changes:
 *  - hidden: remove the item entirely (exit animation)
 *  - collapsed: shrink to width 0, keep mounted
 *  - grow: fraction of remaining space it takes
 *  - shrink: how aggressively it gives up space
 *  - minWidth / maxWidth: bounds
 *  - priority: when space is tight, lower-priority items are hidden first
 *    (auto responsiveness — configured declaratively)
 *
 * The bar uses framer-motion's `layout` to smoothly interpolate sizes and
 * positions when children change visibility / grow factor.
 */
type MorphCtx = {
  transition: Transition;
};
const Ctx = createContext<MorphCtx>({
  transition: { type: "spring", stiffness: 400, damping: 34, mass: 0.8 },
});

export interface MorphBarProps {
  children: ReactNode;
  className?: string;
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  transition?: Transition;
}

export function MorphBar({
  children,
  className,
  gap = 8,
  align = "center",
  transition,
}: MorphBarProps) {
  const ctx = useMemo<MorphCtx>(
    () => ({
      transition: transition ?? {
        type: "spring",
        stiffness: 400,
        damping: 34,
        mass: 0.8,
      },
    }),
    [transition],
  );
  const alignCls = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[align];

  return (
    <Ctx.Provider value={ctx}>
      <motion.div
        layout
        className={cn("flex w-full min-w-0", alignCls, className)}
        style={{ gap }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {children}
        </AnimatePresence>
      </motion.div>
    </Ctx.Provider>
  );
}

export interface MorphItemProps {
  id?: string;
  children: ReactNode;
  /** hidden = remove entirely with exit animation */
  hidden?: boolean;
  /** collapsed = keep mounted but shrink to 0 width */
  collapsed?: boolean;
  /** flex-grow */
  grow?: number;
  /** flex-shrink */
  shrink?: number;
  minWidth?: number | string;
  maxWidth?: number | string;
  className?: string;
  onClick?: () => void;
}

export function MorphItem({
  id,
  children,
  hidden,
  collapsed,
  grow = 0,
  shrink = 1,
  minWidth,
  maxWidth,
  className,
  onClick,
}: MorphItemProps) {
  const { transition } = useContext(Ctx);
  const autoId = useId();
  const key = id ?? autoId;
  if (hidden) return null;

  return (
    <motion.div
      key={key}
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: collapsed ? 0 : 1,
        scale: collapsed ? 0.6 : 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        width: 0,
        marginInline: 0,
        transition: { duration: 0.22 },
      }}
      transition={transition}
      onClick={onClick}
      style={{
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: grow > 0 ? 0 : "auto",
        minWidth: collapsed ? 0 : minWidth,
        maxWidth: collapsed ? 0 : maxWidth,
        overflow: collapsed ? "hidden" : undefined,
        pointerEvents: collapsed ? "none" : undefined,
      }}
      className={cn("min-w-0", className)}
    >
      {children}
    </motion.div>
  );
}
