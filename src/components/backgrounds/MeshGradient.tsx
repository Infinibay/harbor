import { useMemo, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface MeshGradientProps extends BackgroundCommonProps {
  /** Number of soft color blobs. Default 4. */
  blobs?: number;
  /** Blob size as a fraction of the shorter container axis. Default 0.7. */
  blobSize?: number;
  /** Blur amount in px. Default 80. */
  blur?: number;
  /** Base drift speed — container fractions per second. Default 0.08. */
  drift?: number;
}

interface BlobState {
  el: HTMLDivElement | null;
  x: number; // center, fraction of width (0..1)
  y: number; // center, fraction of height (0..1)
  vx: number;
  vy: number;
  color: string;
  size: number; // fraction of min(width, height)
}

/** Animated mesh gradient — soft blobs that drift and **bounce off the
 *  edges** so nothing ever escapes the frame. Blur makes neighbors
 *  melt into each other. Single rAF loop, zero React re-renders
 *  per frame. */
export function MeshGradient({
  blobs = 4,
  blobSize = 0.7,
  blur = 80,
  drift = 0.08,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: MeshGradientProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useContainerSize(wrapRef);

  const paletteKey = palette.join(",");
  const blobStates = useMemo<BlobState[]>(() => {
    const out: BlobState[] = [];
    for (let i = 0; i < blobs; i++) {
      const seed = i * 2654435761;
      const r = (k: number) => {
        const x = Math.sin(seed + k) * 10000;
        return x - Math.floor(x);
      };
      const size = blobSize * (0.7 + r(1) * 0.5);
      out.push({
        el: null,
        x: 0.15 + r(2) * 0.7,
        y: 0.15 + r(3) * 0.7,
        vx: (r(4) - 0.5) * 2 * drift,
        vy: (r(5) - 0.5) * 2 * drift,
        color: palette[i % palette.length],
        size,
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobs, blobSize, drift, paletteKey]);

  const { register } = useAnimationFrame(
    (dt) => {
      if (width === 0 || height === 0) return;
      const dtSec = dt / 1000;
      const s = Math.min(width, height);
      for (const b of blobStates) {
        const halfX = (b.size * s) / (2 * width);
        const halfY = (b.size * s) / (2 * height);
        b.x += b.vx * speed * dtSec;
        b.y += b.vy * speed * dtSec;
        if (b.x < halfX) {
          b.x = halfX;
          b.vx = Math.abs(b.vx);
        } else if (b.x > 1 - halfX) {
          b.x = 1 - halfX;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y < halfY) {
          b.y = halfY;
          b.vy = Math.abs(b.vy);
        } else if (b.y > 1 - halfY) {
          b.y = 1 - halfY;
          b.vy = -Math.abs(b.vy);
        }
        const el = b.el;
        if (el) {
          const bw = b.size * s;
          el.style.transform = `translate3d(${b.x * width - bw / 2}px, ${b.y * height - bw / 2}px, 0)`;
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

  return (
    <div
      aria-hidden
      ref={setWrap}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{ ...style, filter: `blur(${blur}px)` }}
    >
      {blobStates.map((b, i) => {
        const s = Math.min(width, height);
        const bw = b.size * s;
        return (
          <div
            key={i}
            ref={(el) => {
              b.el = el;
              if (el && width > 0 && height > 0) {
                el.style.width = `${bw}px`;
                el.style.height = `${bw}px`;
                el.style.left = "0";
                el.style.top = "0";
                el.style.transform = `translate3d(${b.x * width - bw / 2}px, ${b.y * height - bw / 2}px, 0)`;
              }
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              background: b.color,
              opacity: 0.35 + intensity * 0.45,
            }}
          />
        );
      })}
    </div>
  );
}
