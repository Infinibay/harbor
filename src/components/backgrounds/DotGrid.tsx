import { useMemo } from "react";
import { cn } from "../../lib/cn";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface DotGridProps extends BackgroundCommonProps {
  /** Grid cell size in px. Default 24. */
  size?: number;
  /** Dot radius in px. Default 1.2. */
  dotSize?: number;
  /** `"scroll"` drifts the grid diagonally; `"pulse"` breathes opacity; `"perspective"` tilts toward horizon. Default `"scroll"`. */
  motion?: "scroll" | "pulse" | "perspective";
  /** Override dot color (otherwise derived from the palette). */
  color?: string;
}

/** Infinite dot grid with pure-CSS animation. Cheap: one background-image
 *  + one keyframe, no rAF, no Canvas. Respects reduced-motion (static). */
export function DotGrid({
  size = 24,
  dotSize = 1.2,
  motion = "scroll",
  color,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion = true,
  className,
  style,
}: DotGridProps) {
  const dotColor = color ?? palette[0];
  const reduced = respectReducedMotion && prefersReducedMotion();

  const animationName =
    motion === "pulse"
      ? "harbor-dotgrid-pulse"
      : motion === "perspective"
        ? "harbor-dotgrid-scroll"
        : "harbor-dotgrid-scroll";

  const dur = useMemo(() => {
    const base = motion === "pulse" ? 3.2 : 22;
    return base / Math.max(0.2, speed);
  }, [motion, speed]);

  const bg = `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize + 0.8}px)`;
  const opacity = 0.25 + intensity * 0.55;

  if (motion === "perspective") {
    return (
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none [perspective:600px]",
          className,
        )}
        style={style}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateX(60deg) translateY(15%) scale(1.6)",
            transformOrigin: "50% 100%",
            backgroundImage: bg,
            backgroundSize: `${size}px ${size}px`,
            animation: paused || reduced ? undefined : `harbor-dotgrid-scroll ${dur}s linear infinite`,
            opacity,
            willChange: "background-position",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{
        ...style,
        backgroundImage: bg,
        backgroundSize: `${size}px ${size}px`,
        animation: paused || reduced ? undefined : `${animationName} ${dur}s ${motion === "pulse" ? "ease-in-out" : "linear"} infinite`,
        opacity,
        willChange: motion === "pulse" ? "opacity" : "background-position",
      }}
    />
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
