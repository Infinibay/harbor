import { useId, useMemo, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface BubblesProps extends BackgroundCommonProps {
  /** Number of bubbles. Default 10. */
  count?: number;
  /** Min / max radius (px). Default [30, 110]. */
  sizeRange?: [number, number];
  /** Base drift speed (px / s). Default 36. */
  drift?: number;
  /** Gooeyness strength — higher stretches the alpha harder, making
   *  merges more abrupt. 5..20 is a sane range. Default 18. */
  gooeyness?: number;
  /** Blur radius inside the filter (controls merge distance). Default 14. */
  mergeRadius?: number;
  /** Use a radial gradient inside each bubble instead of flat color. */
  gradient?: boolean;
  /** Background color behind the bubbles (visible when they don't cover). */
  backdrop?: string;
}

interface BubbleState {
  el: SVGCircleElement | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

/** Bubbles that **merge** when they get close, then split again —
 *  classic SVG metaball effect. Crisp edges (no blur on the bubbles
 *  themselves): a gaussian-blur filter + alpha-stretch color-matrix
 *  inside the SVG squeezes the soft edges back into a sharp outline. */
export function Bubbles({
  count = 10,
  sizeRange = [30, 110],
  drift = 36,
  gooeyness = 18,
  mergeRadius = 14,
  gradient = false,
  backdrop,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: BubblesProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useContainerSize(wrapRef);
  const filterId = useId();
  const gradIdBase = useId();

  const bubblesState = useMemo<BubbleState[]>(() => {
    const [minR, maxR] = sizeRange;
    const out: BubbleState[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 2654435761 ^ 7;
      const rnd = (k: number) => {
        const x = Math.sin(seed + k) * 10000;
        return x - Math.floor(x);
      };
      const angle = rnd(1) * Math.PI * 2;
      const s = drift * (0.4 + rnd(2) * 0.8);
      out.push({
        el: null,
        x: 0.15 + rnd(3) * 0.7,
        y: 0.15 + rnd(4) * 0.7,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        r: minR + rnd(5) * (maxR - minR),
        color: palette[i % palette.length],
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, drift, sizeRange[0], sizeRange[1], palette.join(",")]);

  const { register } = useAnimationFrame(
    (dt) => {
      if (width === 0 || height === 0) return;
      const dtSec = dt / 1000;
      for (const b of bubblesState) {
        // Integrate in pixel space, bounce off walls (radius inset).
        let px = b.x * width + b.vx * speed * dtSec;
        let py = b.y * height + b.vy * speed * dtSec;
        if (px < b.r) {
          px = b.r;
          b.vx = Math.abs(b.vx);
        } else if (px > width - b.r) {
          px = width - b.r;
          b.vx = -Math.abs(b.vx);
        }
        if (py < b.r) {
          py = b.r;
          b.vy = Math.abs(b.vy);
        } else if (py > height - b.r) {
          py = height - b.r;
          b.vy = -Math.abs(b.vy);
        }
        b.x = px / width;
        b.y = py / height;
        if (b.el) {
          b.el.setAttribute("cx", String(px));
          b.el.setAttribute("cy", String(py));
        }
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

  // Alpha-stretch matrix: multiply alpha by `gooeyness`, then offset
  // enough that only near-opaque pixels survive the clamp.
  const offset = -gooeyness / 2;

  return (
    <div
      aria-hidden
      ref={setWrap}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{ ...style, background: backdrop }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={mergeRadius} result="blur" />
            <feColorMatrix
              in="blur"
              values={`1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 ${gooeyness} ${offset}`}
            />
          </filter>
          {gradient
            ? bubblesState.map((b, i) => (
                <radialGradient
                  key={i}
                  id={`${gradIdBase}-${i}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor={lighten(b.color, 0.25)} />
                  <stop offset="100%" stopColor={b.color} />
                </radialGradient>
              ))
            : null}
        </defs>
        <g filter={`url(#${filterId})`}>
          {bubblesState.map((b, i) => (
            <circle
              key={i}
              ref={(el) => {
                b.el = el;
                if (el && width > 0 && height > 0) {
                  el.setAttribute("cx", String(b.x * width));
                  el.setAttribute("cy", String(b.y * height));
                }
              }}
              r={b.r}
              fill={gradient ? `url(#${gradIdBase}-${i})` : b.color}
              opacity={0.7 + intensity * 0.3}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Slight tint lightener for gradient highlights. */
function lighten(hex: string, amount: number): string {
  let h = hex.trim();
  if (h.startsWith("#")) h = h.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const mix = (c: number) => Math.min(255, Math.round(c + (255 - c) * amount));
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}
