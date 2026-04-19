import { useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface WavesProps extends BackgroundCommonProps {
  /** Number of stacked waves. Default 4. */
  count?: number;
  /** Relative amplitude (0..1 of viewport height). Default 0.1. */
  amplitude?: number;
  /** Horizontal frequency — more = tighter peaks. Default 2.2. */
  frequency?: number;
  /** Path resolution. Default 80. */
  resolution?: number;
}

/** Parallax sine waves layered with transparency. SVG paths written
 *  imperatively per frame — one `d` attribute per wave, no React churn. */
export function Waves({
  count = 4,
  amplitude = 0.1,
  frequency = 2.2,
  resolution = 80,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: WavesProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [, bump] = useState(0);

  const waves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        color: palette[i % palette.length],
        phase: i * 0.7,
        yOffset: 0.45 + i * 0.08,
        speedMul: 0.6 + i * 0.25,
      })),
    [count, palette],
  );

  const { register } = useAnimationFrame(
    (_dt, now) => {
      const t = now * 0.001 * speed;
      for (let i = 0; i < count; i++) {
        const el = pathRefs.current[i];
        if (!el) continue;
        const w = waves[i];
        el.setAttribute(
          "d",
          buildWave(
            t * w.speedMul,
            w.phase,
            amplitude,
            frequency,
            resolution,
            w.yOffset,
          ),
        );
      }
    },
    {
      enabled: !paused,
      respectReducedMotion,
      pauseWhenHidden,
      pauseWhenOutOfView,
    },
  );

  const setWrap = (el: HTMLDivElement | null) => {
    wrapRef.current = el;
    register(el);
  };

  // Force one remount so ref callbacks fire.
  if (pathRefs.current.length !== count) {
    pathRefs.current = new Array(count).fill(null);
    setTimeout(() => bump((n) => n + 1), 0);
  }

  return (
    <div
      aria-hidden
      ref={setWrap}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={style}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        {waves.map((w, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
              if (el && !el.getAttribute("d")) {
                el.setAttribute("d", buildWave(0, w.phase, amplitude, frequency, resolution, w.yOffset));
              }
            }}
            fill={w.color}
            opacity={(0.12 + intensity * 0.22) * (1 - i / (count * 1.4))}
          />
        ))}
      </svg>
    </div>
  );
}

function buildWave(
  t: number,
  phase: number,
  amp: number,
  freq: number,
  resolution: number,
  yOffset: number,
): string {
  const parts: string[] = [];
  for (let i = 0; i <= resolution; i++) {
    const x = i / resolution;
    const y =
      yOffset +
      amp * Math.sin(x * Math.PI * 2 * freq + t + phase) +
      amp * 0.4 * Math.sin(x * Math.PI * 2 * freq * 1.7 + t * 0.8 + phase * 1.2);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(4)},${y.toFixed(4)}`);
  }
  parts.push("L1,1 L0,1 Z");
  return parts.join(" ");
}
