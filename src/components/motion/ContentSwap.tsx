import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

/**
 * ContentSwap — generic transition wrapper for any content that gets
 * replaced on a discriminator change (route pathname, tab id, drawer
 * view, wizard step…). Framework-agnostic: caller supplies the `id`.
 *
 * Behaviour model:
 *   - `mode="wait"` (default): old content fully exits BEFORE the new
 *     one mounts. Gives a clean "old leaves → new arrives" rhythm and
 *     lets the gap stretch naturally while a code-split chunk loads.
 *   - `mode="sync"`: new content mounts immediately; old exits over it.
 *     Snappier but can look crowded on slow exits.
 *
 * Variants ship as named presets but callers can pass their own Framer
 * Motion variants via `customVariants` for full control.
 *
 * Reduced-motion: respected by default. When the user has
 * `prefers-reduced-motion: reduce`, transitions collapse to an instant
 * swap with no animation — set `respectReducedMotion={false}` to force
 * motion regardless.
 */

export type ContentSwapVariant =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "scale"
  | "blur"
  | "slide-left"
  | "slide-right"
  | "none";

export interface ContentSwapProps {
  /** The discriminator. When it changes, the transition fires. Pass the
   *  route pathname, the active tab id, or whatever identifies the
   *  currently-displayed content. */
  id: string | number;
  /** Named preset for the enter/exit animation. Default: "fade". */
  variant?: ContentSwapVariant;
  /** "wait" (sequential) or "sync" (overlap). Default: "wait". */
  mode?: "wait" | "sync";
  /** Single-side duration in milliseconds. Default: 160. */
  duration?: number;
  /** Skip animation when `prefers-reduced-motion: reduce`. Default true. */
  respectReducedMotion?: boolean;
  /** Escape hatch: Framer Motion variants. Overrides `variant`. */
  customVariants?: Variants;
  /** Run the enter animation on the very first mount. Default true. */
  animateInitial?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const DISTANCE = 8;

const VARIANTS: Record<ContentSwapVariant, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "fade-up": {
    initial: { opacity: 0, y: DISTANCE },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -DISTANCE / 2 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -DISTANCE },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: DISTANCE / 2 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.01 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(6px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(6px)" },
  },
  "slide-left": {
    initial: { opacity: 0, x: DISTANCE * 2 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -DISTANCE * 2 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -DISTANCE * 2 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: DISTANCE * 2 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

export function ContentSwap({
  id,
  variant = "fade",
  mode = "wait",
  duration = 160,
  respectReducedMotion = true,
  customVariants,
  animateInitial = true,
  className,
  style,
  children,
}: ContentSwapProps) {
  const prefersReduced =
    respectReducedMotion &&
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const v: Variants = customVariants ?? VARIANTS[prefersReduced ? "none" : variant];

  return (
    <AnimatePresence mode={mode} initial={animateInitial}>
      <motion.div
        key={id}
        variants={v}
        initial={animateInitial ? "initial" : false}
        animate="animate"
        exit="exit"
        transition={{
          duration: duration / 1000,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
