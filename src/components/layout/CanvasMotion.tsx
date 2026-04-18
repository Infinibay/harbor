import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Easing,
} from "framer-motion";
import { cn } from "../../lib/cn";

// =====================================================================
// CanvasOrbit — child travels on a circle around (cx, cy)
// =====================================================================

export interface CanvasOrbitProps {
  /** World-space center X of the orbit. */
  cx: number;
  /** World-space center Y of the orbit. */
  cy: number;
  radius: number;
  /** Seconds for one full revolution. */
  duration?: number;
  clockwise?: boolean;
  /** Initial angle, degrees (0 = right). */
  startAngle?: number;
  /** Center the child's box on the orbit point. Default: true. */
  centerChild?: boolean;
  paused?: boolean;
  children: ReactNode;
  className?: string;
}

/** Puts its child on a circular track around `(cx, cy)`. Render multiple
 *  with different radii or phase offsets (`startAngle`) to build
 *  planetary/satellite feels. */
export function CanvasOrbit({
  cx,
  cy,
  radius,
  duration = 6,
  clockwise = true,
  startAngle = 0,
  centerChild = true,
  paused,
  children,
  className,
}: CanvasOrbitProps) {
  const t = useMotionValue(0);

  useEffect(() => {
    if (paused) return;
    const controls = animate(t, 1, {
      duration,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [duration, paused, t]);

  const baseRad = (startAngle * Math.PI) / 180;
  const dir = clockwise ? 1 : -1;
  const x = useTransform(
    t,
    (v) => cx + Math.cos(baseRad + v * Math.PI * 2 * dir) * radius,
  );
  const y = useTransform(
    t,
    (v) => cy + Math.sin(baseRad + v * Math.PI * 2 * dir) * radius,
  );

  return (
    <motion.div
      data-canvas-bounds=""
      data-canvas-x={cx - radius}
      data-canvas-y={cy - radius}
      style={{ position: "absolute", top: 0, left: 0, x, y }}
      className={className}
    >
      <div
        style={{
          transform: centerChild ? "translate(-50%, -50%)" : undefined,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// =====================================================================
// CanvasPulse — rhythmic scale and/or opacity
// =====================================================================

export interface CanvasPulseProps {
  /** [min, max] scale tween target. */
  scale?: [number, number];
  /** [min, max] opacity tween target. */
  opacity?: [number, number];
  /** One full cycle (min → max → min) in seconds. */
  duration?: number;
  ease?: Easing | Easing[];
  paused?: boolean;
  children: ReactNode;
  className?: string;
}

/** Calm breathing motion — great for pinning attention ("this is alive"),
 *  notifications, status dots, selection highlights. */
export function CanvasPulse({
  scale = [1, 1.08],
  opacity,
  duration = 1.6,
  ease = "easeInOut",
  paused,
  children,
  className,
}: CanvasPulseProps) {
  if (paused) return <div className={className}>{children}</div>;
  const animateProps: Record<string, unknown> = { scale };
  if (opacity) animateProps.opacity = opacity;
  return (
    <motion.div
      animate={animateProps}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =====================================================================
// CanvasFloat — gentle vertical (or horizontal) bob
// =====================================================================

export interface CanvasFloatProps {
  /** Peak-to-trough travel in px. */
  amplitude?: number;
  duration?: number;
  axis?: "y" | "x";
  /** Offset relative to siblings so a group doesn't move in lockstep. */
  phase?: number;
  paused?: boolean;
  children: ReactNode;
  className?: string;
}

/** Gentle floating motion — a lighter cousin of Pulse for ambient life. */
export function CanvasFloat({
  amplitude = 8,
  duration = 3,
  axis = "y",
  phase = 0,
  paused,
  children,
  className,
}: CanvasFloatProps) {
  if (paused) return <div className={className}>{children}</div>;
  const range = [-amplitude, amplitude];
  return (
    <motion.div
      initial={{ [axis]: 0 }}
      animate={{ [axis]: range }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: phase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =====================================================================
// CanvasJiggle — procedural noise wobble
// =====================================================================

export interface CanvasJiggleProps {
  /** Max px offset in each axis. */
  amplitude?: number;
  /** Higher = faster twitch. */
  frequency?: number;
  /** Also wobble rotation by ~amplitude/4 degrees. */
  rotate?: boolean;
  paused?: boolean;
  children: ReactNode;
  className?: string;
}

/** Small, perpetual wobble driven by summed sines at incommensurate
 *  frequencies — looks organic, not looped. Good for "nervous"/"alive"
 *  markers or glitch aesthetics. */
export function CanvasJiggle({
  amplitude = 2,
  frequency = 3,
  rotate,
  paused,
  children,
  className,
}: CanvasJiggleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const r = useMotionValue(0);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const f = frequency;
      x.set(
        Math.sin(t * f * Math.PI) * amplitude +
          Math.sin(t * f * 1.73) * amplitude * 0.5,
      );
      y.set(
        Math.cos(t * f * 1.31 * Math.PI) * amplitude +
          Math.cos(t * f * 0.81) * amplitude * 0.5,
      );
      if (rotate) {
        r.set(Math.sin(t * f * 0.9) * (amplitude / 4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amplitude, frequency, rotate, paused, x, y, r]);

  return (
    <motion.div
      style={{ x, y, rotate: rotate ? r : undefined }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =====================================================================
// CanvasFollowPath — child walks an SVG path
// =====================================================================

export interface CanvasFollowPathProps {
  /** SVG path commands (M x y L x y C ...). World-space coordinates. */
  d: string;
  duration?: number;
  loop?: boolean;
  /** Rotate the child to match the path tangent. */
  rotate?: boolean;
  paused?: boolean;
  /** Draw the path as a faint stroke so you can see the trail. */
  showPath?: boolean;
  pathStroke?: string;
  children: ReactNode;
  className?: string;
}

/** Moves its child along an arbitrary SVG path. Uses
 *  `SVGPathElement.getPointAtLength` to sample positions per frame; if
 *  `rotate` is set, the child spins to face the path's tangent. */
export function CanvasFollowPath({
  d,
  duration = 4,
  loop = true,
  rotate,
  paused,
  showPath,
  pathStroke = "rgba(255,255,255,0.1)",
  children,
  className,
}: CanvasFollowPathProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);
  const t = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const angle = useMotionValue(0);

  useEffect(() => {
    if (!pathRef.current) return;
    setLength(pathRef.current.getTotalLength());
  }, [d]);

  useEffect(() => {
    if (length === 0 || paused) return;
    const controls = animate(t, 1, {
      duration,
      repeat: loop ? Infinity : 0,
      ease: "linear",
    });
    return () => controls.stop();
  }, [duration, loop, length, paused, t]);

  useEffect(() => {
    if (length === 0 || !pathRef.current) return;
    const el = pathRef.current;
    const unsub = t.on("change", (v) => {
      const p = el.getPointAtLength(v * length);
      x.set(p.x);
      y.set(p.y);
      if (rotate) {
        const ahead = el.getPointAtLength(Math.min(v + 0.001, 1) * length);
        angle.set(
          (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI,
        );
      }
    });
    // Seed initial position.
    const p0 = el.getPointAtLength(0);
    x.set(p0.x);
    y.set(p0.y);
    return unsub;
  }, [length, rotate, t, x, y, angle]);

  return (
    <>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          pointerEvents: "none",
          width: 0,
          height: 0,
        }}
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke={showPath ? pathStroke : "none"}
          strokeWidth={showPath ? 1 : 0}
          strokeDasharray={showPath ? "3 5" : undefined}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          rotate: rotate ? angle : undefined,
        }}
        className={cn(className)}
      >
        <div style={{ transform: "translate(-50%, -50%)" }}>{children}</div>
      </motion.div>
    </>
  );
}
