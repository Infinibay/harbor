import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";
import {
  useDevice,
  useIsAbove,
  useIsBelow,
  useIsLandscape,
  useIsPortrait,
  useIsTouch,
  type Breakpoint,
  type Device,
  type Orientation,
} from "../../lib/responsive";

type Anim = "fade" | "slide" | "scale" | false;

export interface ShowProps {
  /** Show at >= this breakpoint. */
  above?: Breakpoint;
  /** Show at < this breakpoint. */
  below?: Breakpoint;
  /** Show between two breakpoints: `[min, max)`. */
  between?: [Breakpoint, Breakpoint];
  /** Show on a specific device class — "phone" | "tablet" | "desktop",
   *  or any subset. */
  device?: Device | Device[];
  /** Show in a specific screen orientation. */
  orientation?: Orientation;
  /** Show only on touch (or only on non-touch) devices. */
  touch?: boolean;
  /** Animation when the condition flips. */
  animate?: Anim;
  children: ReactNode;
}

const variants = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slide: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
} as const satisfies Record<"fade" | "slide" | "scale", MotionProps>;

function useVisible({
  above,
  below,
  between,
  device,
  orientation,
  touch,
}: Omit<ShowProps, "children" | "animate">) {
  const isAboveMin = useIsAbove(between ? between[0] : (above ?? "sm"));
  const isBelowMax = useIsBelow(between ? between[1] : (below ?? "2xl"));
  const currentDevice = useDevice();
  const portrait = useIsPortrait();
  const landscape = useIsLandscape();
  const isTouch = useIsTouch();

  // All conditions must pass. Missing condition = any.
  let ok = true;
  if (between) ok = ok && isAboveMin && isBelowMax;
  else if (above && below) ok = ok && isAboveMin && isBelowMax;
  else if (above) ok = ok && isAboveMin;
  else if (below) ok = ok && isBelowMax;

  if (device) {
    const list = Array.isArray(device) ? device : [device];
    ok = ok && list.includes(currentDevice);
  }
  if (orientation === "portrait") ok = ok && portrait;
  if (orientation === "landscape") ok = ok && landscape;
  if (touch !== undefined) ok = ok && isTouch === touch;

  return ok;
}

/** Conditionally render children based on viewport size, with optional
 *  animation when the condition flips. Mounts only when visible — good
 *  for heavy components you don't want on mobile. */
export function Show({
  above,
  below,
  between,
  animate = "fade",
  children,
}: ShowProps) {
  const visible = useVisible({ above, below, between });
  if (animate === false) return visible ? <>{children}</> : null;

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          {...variants[animate]}
          transition={{ duration: 0.2, ease: [0.22, 0.7, 0.2, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Inverse of Show — hides at a breakpoint and above (or whatever). */
export function Hide({
  above,
  below,
  between,
  animate = "fade",
  children,
}: ShowProps) {
  const visible = useVisible({ above, below, between });
  const shouldRender = !visible;
  if (animate === false) return shouldRender ? <>{children}</> : null;

  return (
    <AnimatePresence initial={false}>
      {shouldRender ? (
        <motion.div
          {...variants[animate]}
          transition={{ duration: 0.2, ease: [0.22, 0.7, 0.2, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
