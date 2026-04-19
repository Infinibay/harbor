import { useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface AuroraProps extends BackgroundCommonProps {
  /** Number of color bands. Default 3. */
  bands?: number;
  /** Wave amplitude (0..1 of height). Default 0.22. */
  amplitude?: number;
  /** Horizontal resolution of the wave path. Default 64. */
  resolution?: number;
  /** Horizontal offset between bands, in radians. Default 0.9. */
  bandPhase?: number;
}

/** Flowing aurora-like ribbons, hand-built from animated SVG paths.
 *  Cheap: we update one `d` attribute per band per frame and rely on
 *  the browser's GPU compositor for the blur + blend. */
export function Aurora({
  bands = 3,
  amplitude = 0.22,
  resolution = 64,
  bandPhase = 0.9,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion = true,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: AuroraProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [, bump] = useState(0);

  const bandColors = useMemo(
    () => Array.from({ length: bands }, (_, i) => palette[i % palette.length]),
    [bands, palette],
  );

  const { register, reducedMotion } = useAnimationFrame(
    (_dt, now) => {
      for (let b = 0; b < bands; b++) {
        const el = pathRefs.current[b];
        if (!el) continue;
        el.setAttribute("d", buildWavePath(now * 0.001 * speed, b * bandPhase, amplitude, resolution));
      }
    },
    {
      enabled: !paused,
      respectReducedMotion,
      pauseWhenHidden,
      pauseWhenOutOfView,
    },
  );

  // Register the DOM node for visibility tracking.
  const setHost = (el: HTMLDivElement | null) => {
    hostRef.current = el;
    register(el);
  };

  // One-off: trigger re-render once so `ref={...}` gets attached to the
  // paths (strict mode safe).
  if (pathRefs.current.length !== bands) {
    pathRefs.current = new Array(bands).fill(null);
    setTimeout(() => bump((n) => n + 1), 0);
  }

  return (
    <div
      aria-hidden
      ref={setHost}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={style}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, filter: "blur(32px)" }}
      >
        <defs>
          {bandColors.map((color, b) => (
            <linearGradient key={b} id={`aurora-grad-${b}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0} />
              <stop offset="30%" stopColor={color} stopOpacity={0.9} />
              <stop offset="70%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {bandColors.map((_, b) => (
          <path
            key={b}
            ref={(el) => {
              pathRefs.current[b] = el;
              if (el && reducedMotion) {
                el.setAttribute("d", buildWavePath(b * bandPhase, 0, amplitude, resolution));
              } else if (el && paused) {
                el.setAttribute("d", buildWavePath(b * bandPhase, 0, amplitude, resolution));
              } else if (el && !el.getAttribute("d")) {
                el.setAttribute("d", buildWavePath(0, b * bandPhase, amplitude, resolution));
              }
            }}
            fill={`url(#aurora-grad-${b})`}
            opacity={0.3 + intensity * 0.6}
          />
        ))}
      </svg>
    </div>
  );
}

/** Build a closed-path wave that spans the unit viewBox. */
function buildWavePath(t: number, phase: number, amplitude: number, resolution: number): string {
  const yMid = 0.5;
  const parts: string[] = [];
  for (let i = 0; i <= resolution; i++) {
    const x = i / resolution;
    const y =
      yMid +
      amplitude *
        (0.55 * Math.sin(x * 6 + t + phase) +
          0.45 * Math.sin(x * 3.1 + t * 0.7 + phase * 1.3));
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(4)},${y.toFixed(4)}`);
  }
  parts.push("L1,1 L0,1 Z");
  return parts.join(" ");
}
