import { useEffect, useMemo, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame, useCanvasSetup } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface StarfieldProps extends BackgroundCommonProps {
  /** Stars per 10 000 px². Default 1.2. */
  density?: number;
  /** Parallax layers. More = smoother depth illusion. Default 3. */
  depth?: number;
  /** Base radius (px). Farthest layer is 0.3× this. Default 1.4. */
  size?: number;
  /** Direction of drift in radians. Default -π/2 (upward). */
  direction?: number;
  /** Base drift speed (px / s). Default 18. */
  drift?: number;
  /** Twinkle strength, 0..1. Default 0.6. */
  twinkle?: number;
}

interface Star {
  x: number;
  y: number;
  layer: number;
  twinkle: number;
  hue: string;
}

/** Classic parallax starfield. Canvas 2D. Supports thousands of stars
 *  at 60 fps easily — we render one `fillRect` per star (not arcs). */
export function Starfield({
  density = 1.2,
  depth = 3,
  size = 1.4,
  direction = -Math.PI / 2,
  drift = 18,
  twinkle = 0.6,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: StarfieldProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useContainerSize(wrapRef);
  const { ref: canvasRef, resize } = useCanvasSetup<HTMLCanvasElement>();
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const stars = useRef<Star[]>([]);
  const seededFor = useRef({ w: 0, h: 0 });

  // Seed stars when container size changes.
  useEffect(() => {
    if (width === 0 || height === 0) return;
    if (seededFor.current.w === width && seededFor.current.h === height) return;
    seededFor.current = { w: width, h: height };
    const count = Math.round((width * height / 10_000) * density);
    const next: Star[] = [];
    for (let i = 0; i < count; i++) {
      next.push({
        x: Math.random() * width,
        y: Math.random() * height,
        layer: Math.floor(Math.random() * depth),
        twinkle: Math.random(),
        hue: palette[Math.floor(Math.random() * palette.length)],
      });
    }
    stars.current = next;
    resize(width, height);
  }, [width, height, density, depth, palette, resize]);

  const dx = useMemo(() => Math.cos(direction), [direction]);
  const dy = useMemo(() => Math.sin(direction), [direction]);

  const { register } = useAnimationFrame(
    (dt, now) => {
      const c = canvasElRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Optional faint background tint to make stars pop.
      const dtSec = dt / 1000;
      const s = stars.current;
      for (let i = 0; i < s.length; i++) {
        const star = s[i];
        const layerSpeed = 0.3 + (star.layer / Math.max(1, depth - 1)) * 0.7;
        star.x += dx * drift * speed * layerSpeed * dtSec;
        star.y += dy * drift * speed * layerSpeed * dtSec;
        if (star.x < 0) star.x += width;
        else if (star.x > width) star.x -= width;
        if (star.y < 0) star.y += height;
        else if (star.y > height) star.y -= height;
        const tw = twinkle > 0
          ? 0.5 + 0.5 * Math.sin(now * 0.003 + star.twinkle * 10)
          : 1;
        const opacity = (0.3 + star.layer * 0.25) * (0.6 + intensity * 0.4) * (1 - twinkle + twinkle * tw);
        const r = size * (0.35 + star.layer * 0.25);
        ctx.fillStyle = star.hue;
        ctx.globalAlpha = Math.min(1, opacity);
        ctx.fillRect(star.x - r, star.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    },
    {
      enabled: !paused,
      respectReducedMotion,
      pauseWhenHidden,
      pauseWhenOutOfView,
    },
  );

  // Wire container + canvas refs.
  const setWrap = (el: HTMLDivElement | null) => {
    wrapRef.current = el;
    register(el);
  };
  const setCanvas = (el: HTMLCanvasElement | null) => {
    canvasElRef.current = el;
    canvasRef(el);
  };

  return (
    <div
      aria-hidden
      ref={setWrap}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none bg-[#0a0a10]",
        className,
      )}
      style={style}
    >
      <canvas ref={setCanvas} />
    </div>
  );
}
