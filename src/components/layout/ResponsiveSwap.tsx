import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useIsAbove, type Breakpoint } from "../../lib/responsive";

export interface ResponsiveSwapProps {
  /** Breakpoint at which `desktop` takes over. Below this, `mobile`. */
  above?: Breakpoint;
  mobile: ReactNode;
  desktop: ReactNode;
  /** Animation: "fade" (default) or "slide" or false. */
  animate?: "fade" | "slide" | false;
  className?: string;
}

/** Cross-fade between two variants at a breakpoint.
 *
 * Unlike rendering both and hiding one with CSS, both children only
 * mount when active — useful when the mobile and desktop versions
 * diverge significantly. */
export function ResponsiveSwap({
  above = "md",
  mobile,
  desktop,
  animate = "fade",
  className,
}: ResponsiveSwapProps) {
  const isDesktop = useIsAbove(above);
  const key = isDesktop ? "desktop" : "mobile";
  const child = isDesktop ? desktop : mobile;

  if (animate === false) {
    return <div className={className}>{child}</div>;
  }

  const variants =
    animate === "slide"
      ? {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          {...variants}
          transition={{ duration: 0.2, ease: [0.22, 0.7, 0.2, 1] }}
        >
          {child}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
