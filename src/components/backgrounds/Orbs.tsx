import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface OrbsProps extends BackgroundCommonProps {
  /** Number of orbs. Default 7. */
  count?: number;
  /** Min / max radius in px. Default [40, 180]. */
  sizeRange?: [number, number];
  /** Extra glow blur in px. Default 40. */
  glow?: number;
  /** Mix mode for the orbs layer. Default "screen" (bright-adds). */
  blend?: "screen" | "plus-lighter" | "lighten" | "overlay" | "normal";
}

/** Pulsing glow orbs — CSS + Framer. Very cheap; each orb is one
 *  animated `motion.div` with a blur filter. Blend mode is `screen`
 *  by default so overlapping orbs brighten without muddying. */
export function Orbs({
  count = 7,
  sizeRange = [40, 180],
  glow = 40,
  blend = "screen",
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion = true,
  className,
  style,
}: OrbsProps) {
  const staticMode = paused || (respectReducedMotion && prefersReducedMotion());

  const orbs = useMemo(() => {
    const [minR, maxR] = sizeRange;
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 2654435761 ^ 42;
      const rnd = (k: number) => {
        const x = Math.sin(seed + k) * 10000;
        return x - Math.floor(x);
      };
      return {
        id: i,
        color: palette[i % palette.length],
        size: minR + rnd(1) * (maxR - minR),
        left: rnd(2) * 100,
        top: rnd(3) * 100,
        dx: (rnd(4) - 0.5) * 40,
        dy: (rnd(5) - 0.5) * 40,
        duration: 8 + rnd(6) * 14,
        scaleMax: 1.1 + rnd(7) * 0.4,
        opacityBase: 0.3 + rnd(8) * 0.4,
      };
    });
  }, [count, sizeRange, palette]);

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{ ...style, mixBlendMode: blend as React.CSSProperties["mixBlendMode"] }}
    >
      {orbs.map((o) => (
        <motion.div
          key={o.id}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: `calc(${o.left}% - ${o.size / 2}px)`,
            top: `calc(${o.top}% - ${o.size / 2}px)`,
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            filter: `blur(${glow}px)`,
            opacity: o.opacityBase * (0.4 + intensity),
            willChange: "transform, opacity",
          }}
          animate={
            staticMode
              ? undefined
              : {
                  x: [0, o.dx, -o.dx * 0.7, 0],
                  y: [0, -o.dy, o.dy * 0.8, 0],
                  scale: [1, o.scaleMax, 1],
                }
          }
          transition={{
            duration: o.duration / speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
