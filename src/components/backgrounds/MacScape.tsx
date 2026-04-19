import { useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface MacScapeProps extends BackgroundCommonProps {
  /** Number of color layers. Default 4. */
  layers?: number;
  /** Base vertical position per layer, fraction of height (0=top, 1=bottom).
   *  Defaults stack them from upper-third down. */
  baseY?: readonly number[];
  /** Ambient blur on the whole scene for the dreamy Apple-wallpaper
   *  glow. Default 6. Use 0 for sharper layered look. */
  blur?: number;
  /** Horizontal resolution of each layer's path. Default 48. */
  resolution?: number;
}

/** "macOS wallpaper" background — a few large flowing color hills that
 *  slowly morph into each other. Fewer / bigger / slower than
 *  `<Waves>`, closer to Big Sur / Monterey dynamic wallpapers. SVG +
 *  path recomputation per frame. */
export function MacScape({
  layers = 4,
  baseY,
  blur = 6,
  resolution = 48,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: MacScapeProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [, bump] = useState(0);

  const defaultBaseY = useMemo(
    () => Array.from({ length: layers }, (_, i) => 0.28 + i * 0.22 + i * 0.02),
    [layers],
  );
  const bys = baseY ?? defaultBaseY;

  const layerSpecs = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => ({
        color: palette[i % palette.length],
        phase: i * 1.3,
        amp1: 0.05 + (i % 2) * 0.02,
        amp2: 0.03 + ((i + 1) % 2) * 0.015,
        amp3: 0.015,
        f1: 0.6 + (i * 0.25) % 1,
        f2: 1.3 + i * 0.2,
        f3: 2.4 + i * 0.15,
        s1: 0.22 + i * 0.05,
        s2: 0.17 - i * 0.015,
        s3: 0.11 + i * 0.02,
      })),
    [layers, palette],
  );

  const { register } = useAnimationFrame(
    (_dt, now) => {
      const t = now * 0.001 * speed;
      for (let i = 0; i < layers; i++) {
        const el = pathRefs.current[i];
        if (!el) continue;
        const spec = layerSpecs[i];
        const y0 = bys[i % bys.length];
        el.setAttribute("d", buildMacPath(t, spec, y0, resolution));
      }
    },
    {
      enabled: !paused,
      respectReducedMotion,
      pauseWhenHidden,
      pauseWhenOutOfView,
    },
  );

  const setHost = (el: HTMLDivElement | null) => {
    hostRef.current = el;
    register(el);
  };

  if (pathRefs.current.length !== layers) {
    pathRefs.current = new Array(layers).fill(null);
    setTimeout(() => bump((n) => n + 1), 0);
  }

  return (
    <div
      aria-hidden
      ref={setHost}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{
        ...style,
        background: `linear-gradient(180deg, ${palette[0]}88, ${palette[1]}44 50%, ${palette[2] ?? palette[0]}55)`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)` }}
      >
        {layerSpecs.map((spec, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
              if (el && !el.getAttribute("d")) {
                el.setAttribute(
                  "d",
                  buildMacPath(0, spec, bys[i % bys.length], resolution),
                );
              }
            }}
            fill={spec.color}
            opacity={0.55 + intensity * 0.3 - i * 0.05}
          />
        ))}
      </svg>
    </div>
  );
}

interface Spec {
  phase: number;
  amp1: number;
  amp2: number;
  amp3: number;
  f1: number;
  f2: number;
  f3: number;
  s1: number;
  s2: number;
  s3: number;
}

function buildMacPath(t: number, s: Spec, y0: number, resolution: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= resolution; i++) {
    const x = i / resolution;
    const y =
      y0 +
      s.amp1 * Math.sin(x * Math.PI * 2 * s.f1 + t * s.s1 + s.phase) +
      s.amp2 * Math.sin(x * Math.PI * 2 * s.f2 + t * s.s2 + s.phase * 1.4) +
      s.amp3 * Math.sin(x * Math.PI * 2 * s.f3 + t * s.s3 + s.phase * 0.7);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(4)},${y.toFixed(4)}`);
  }
  parts.push("L1,1 L0,1 Z");
  return parts.join(" ");
}
