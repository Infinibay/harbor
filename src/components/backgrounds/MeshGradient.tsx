import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface MeshGradientProps extends BackgroundCommonProps {
  /** Number of soft color blobs. Default 4. */
  blobs?: number;
  /** Blob size as a fraction of the viewport's shorter side. Default 0.7. */
  blobSize?: number;
  /** Blur amount in px. Default 80. */
  blur?: number;
}

/** Animated mesh gradient — a handful of large soft-colored blobs that
 *  drift around. Pure CSS + Framer; very cheap, looks premium. */
export function MeshGradient({
  blobs = 4,
  blobSize = 0.7,
  blur = 80,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion = true,
  pauseWhenHidden,
  className,
  style,
}: MeshGradientProps) {
  const blobSpecs = useMemo(() => {
    // Stable pseudo-random layout.
    return Array.from({ length: blobs }, (_, i) => {
      const seed = i * 2654435761;
      const r = (a: number, b: number) => {
        const x = Math.sin(seed + a) * 10000;
        return (x - Math.floor(x)) * (b - a) + a;
      };
      return {
        id: i,
        color: palette[i % palette.length],
        size: r(1, 0.7) * blobSize,
        startX: r(2, 5) * 20 - 30,
        startY: r(3, 7) * 20 - 30,
        dx: r(4, 9) * 30,
        dy: r(5, 11) * 30,
        duration: 14 + r(6, 13) * 10,
      };
    });
  }, [blobs, blobSize, palette]);

  const staticMode = paused || (respectReducedMotion && prefersReducedMotion());
  void pauseWhenHidden;

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{ ...style, filter: `blur(${blur}px)` }}
    >
      {blobSpecs.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            background: b.color,
            width: `${b.size * 100}%`,
            height: `${b.size * 100}%`,
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            opacity: 0.35 + intensity * 0.4,
            willChange: "transform",
          }}
          animate={
            staticMode
              ? undefined
              : {
                  x: [0, b.dx * 4, -b.dx * 3, 0],
                  y: [0, -b.dy * 3, b.dy * 4, 0],
                }
          }
          transition={{
            duration: b.duration / speed,
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
