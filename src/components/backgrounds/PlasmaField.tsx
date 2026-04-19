import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface PlasmaFieldProps extends BackgroundCommonProps {
  /** Pixel scale — the canvas renders at `width / scale` × `height / scale`
   *  then is stretched with CSS. Higher = smoother, lower = cheaper.
   *  Default 8. */
  scale?: number;
  /** Turbulence frequency. Default 0.02. */
  frequency?: number;
  /** Blur applied to the upscale result for a smooth look. Default 18. */
  blur?: number;
}

function parseHex(hex: string): [number, number, number] {
  let h = hex.trim();
  if (h.startsWith("#")) h = h.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Classic plasma — a continuous color field from summed sines. Renders
 *  at a low resolution (default 1/8) and is upscaled with CSS blur, so
 *  the per-pixel loop runs on thousands of pixels instead of millions.
 *
 *  Note: the canvas is sized to the *low* resolution (not DPR-scaled)
 *  since CSS upscales it anyway. A DPR-scaled canvas would only fill
 *  the top-left quadrant at DPR=2 because `putImageData` ignores
 *  canvas transforms. */
export function PlasmaField({
  scale = 8,
  frequency = 0.02,
  blur = 18,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: PlasmaFieldProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useContainerSize(wrapRef);
  const lowW = Math.max(1, Math.floor(width / scale));
  const lowH = Math.max(1, Math.floor(height / scale));

  const paletteRGB = useRef<[number, number, number][]>([]);
  useEffect(() => {
    paletteRGB.current = palette.map(parseHex);
  }, [palette]);

  // Size the canvas to the LOW resolution. No DPR scaling — CSS scales
  // the canvas to fit the container anyway, and `putImageData` ignores
  // canvas transforms.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || lowW === 0 || lowH === 0) return;
    if (c.width !== lowW) c.width = lowW;
    if (c.height !== lowH) c.height = lowH;
  }, [lowW, lowH]);

  const imgRef = useRef<ImageData | null>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || lowW === 0 || lowH === 0) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    imgRef.current = ctx.createImageData(lowW, lowH);
  }, [lowW, lowH]);

  const { register } = useAnimationFrame(
    (_dt, now) => {
      const c = canvasRef.current;
      const img = imgRef.current;
      if (!c || !img || lowW === 0 || lowH === 0) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const t = now * 0.001 * speed;
      const pal = paletteRGB.current;
      if (pal.length === 0) return;
      const f = frequency * scale;
      const data = img.data;
      for (let y = 0; y < lowH; y++) {
        for (let x = 0; x < lowW; x++) {
          const v =
            Math.sin(x * f + t) +
            Math.sin(y * f * 0.9 + t * 0.7) +
            Math.sin((x + y) * f * 0.55 + t * 0.5) +
            Math.sin(Math.sqrt(x * x + y * y) * f * 0.8 + t * 1.3);
          const norm = (v + 4) / 8;
          const slot = norm * pal.length;
          const pi = Math.floor(slot) % pal.length;
          const nx = slot - Math.floor(slot);
          const c0 = pal[pi];
          const c1 = pal[(pi + 1) % pal.length];
          const idx = (y * lowW + x) * 4;
          data[idx] = c0[0] + (c1[0] - c0[0]) * nx;
          data[idx + 1] = c0[1] + (c1[1] - c0[1]) * nx;
          data[idx + 2] = c0[2] + (c1[2] - c0[2]) * nx;
          data[idx + 3] = Math.round(255 * (0.5 + intensity * 0.5));
        }
      }
      ctx.putImageData(img, 0, 0);
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
      style={style}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "auto",
          filter: `blur(${blur}px)`,
          display: "block",
        }}
      />
    </div>
  );
}
