import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

interface ParallaxCtx {
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  strength: number;
}

const ParallaxContext = createContext<ParallaxCtx | null>(null);

export interface ParallaxGroupProps {
  children: ReactNode;
  /** Max offset, in pixels, for a layer at depth=1. */
  strength?: number;
  /** Cursor-proximity radius, in px. */
  radius?: number;
  /** CSS `perspective` for layered 3D feel. Set to 0 to disable. */
  perspective?: number;
  className?: string;
}

/** A container that exposes cursor proximity to its `ParallaxLayer` children.
 *
 * Drop a few `ParallaxLayer`s inside with different `depth` values, stack
 * them absolutely, and they'll move at different rates as the cursor
 * approaches — the classic poster / hero effect, but coordinated through
 * the global cursor provider (one mousemove listener, not N). */
export function ParallaxGroup({
  children,
  strength = 24,
  radius = 420,
  perspective = 800,
  className,
}: ParallaxGroupProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { nx, ny } = useCursorProximity(ref, radius);

  return (
    <ParallaxContext.Provider value={{ nx, ny, strength }}>
      <div
        ref={ref}
        className={cn("relative", className)}
        style={perspective > 0 ? { perspective } : undefined}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

export interface ParallaxLayerProps {
  children: ReactNode;
  /** 0 = static; 1 = moves a full `strength` pixels at the rim; negative
   *  values translate opposite the cursor (foreground feel). */
  depth?: number;
  /** Rotate-in-3D intensity (0..1). Tilts the layer toward the cursor. */
  tilt?: number;
  /** Spring stiffness — higher = snappier follow. */
  stiffness?: number;
  /** Spring damping. */
  damping?: number;
  className?: string;
}

/** A layer inside `ParallaxGroup`. `depth` controls how much it moves. */
export function ParallaxLayer({
  children,
  depth = 0.5,
  tilt = 0,
  stiffness = 150,
  damping = 20,
  className,
}: ParallaxLayerProps) {
  const ctx = useContext(ParallaxContext);
  const fallback = useMotionValue(0);
  const nx = ctx?.nx ?? fallback;
  const ny = ctx?.ny ?? fallback;
  const strength = ctx?.strength ?? 0;

  const tx = useTransform(nx, (n) => -n * strength * depth);
  const ty = useTransform(ny, (n) => -n * strength * depth);
  const sx = useSpring(tx, { stiffness, damping, mass: 0.8 });
  const sy = useSpring(ty, { stiffness, damping, mass: 0.8 });

  const rotY = useTransform(nx, (n) => n * 10 * tilt);
  const rotX = useTransform(ny, (n) => -n * 10 * tilt);
  const srotX = useSpring(rotX, { stiffness, damping });
  const srotY = useSpring(rotY, { stiffness, damping });

  return (
    <motion.div
      style={{
        x: sx,
        y: sy,
        rotateX: tilt > 0 ? srotX : 0,
        rotateY: tilt > 0 ? srotY : 0,
        transformStyle: tilt > 0 ? "preserve-3d" : undefined,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
