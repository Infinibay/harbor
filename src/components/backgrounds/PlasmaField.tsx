import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame, useCanvasSetup } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface PlasmaFieldProps extends BackgroundCommonProps {
  /** Pixel scale — the canvas renders at `width / scale` × `height / scale`
   *  then is stretched with CSS. Higher = smoother, lower = cheaper.
   *  Default 8. */
  scale?: number;
  /** Turbulence frequency. Default 0.02. */
  frequency?: number;
  /** Blur applied to the upscale result for a smooth look. Default 12. */
  blur?: number;
}

/** Classic plasma — a continuous color field rendered by per-pixel
 *  `sin` sums. Performance comes from rendering at low resolution
 *  (default 1/8) and letting CSS upscale with a blur, so the loop runs
 *  on thousands of pixels instead of millions. */
export function PlasmaField({
  scale = 8,
  frequency = 0.02,
  blur = 12,
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
  const { width, height } = useContainerSize(wrapRef);
  const { ref: canvasRef, resize } = useCanvasSetup<HTMLCanvasElement>();
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const lowW = Math.max(1, Math.round(width / scale));
  const lowH = Math.max(1, Math.round(height / scale));

  // Parse palette to RGB arrays once.
  const paletteRGB = useRef<[number, number, number][]>([]);
  useEffect(() => {
    paletteRGB.current = palette.map(parseHex);
  }, [palette]);

  // Resize canvas to low resolution when size changes.
  useEffect(() => {
    if (lowW === 0 || lowH === 0) return;
    resize(lowW, lowH);
  }, [lowW, lowH, resize]);

  const { register } = useAnimationFrame(
    (_dt, now) => {
      const c = canvasElRef.current;
      if (!c || lowW === 0 || lowH === 0) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const t = now * 0.001 * speed;
      const img = ctx.createImageData(lowW, lowH);
      const pal = paletteRGB.current;
      if (pal.length === 0) return;
      const f = frequency * scale; // restore effective frequency
      for (let y = 0; y < lowH; y++) {
        for (let x = 0; x < lowW; x++) {
          // Multi-octave sine sum.
          const v =
            Math.sin(x * f + t) +
            Math.sin((y * f + t * 0.7) * 0.9) +
            Math.sin((x * f + y * f + t * 0.5) * 1.1) +
            Math.sin(Math.sqrt(x * x + y * y) * f * 0.8 + t * 1.3);
          const norm = (v + 4) / 8; // 0..1
          const pi = Math.floor(norm * pal.length) % pal.length;
          const nx = (norm * pal.length) - Math.floor(norm * pal.length);
          const c0 = pal[pi];
          const c1 = pal[(pi + 1) % pal.length];
          const r = c0[0] + (c1[0] - c0[0]) * nx;
          const g = c0[1] + (c1[1] - c0[1]) * nx;
          const b = c0[2] + (c1[2] - c0[2]) * nx;
          const idx = (y * lowW + x) * 4;
          img.data[idx] = r;
          img.data[idx + 1] = g;
          img.data[idx + 2] = b;
          img.data[idx + 3] = Math.round(255 * (0.5 + intensity * 0.5));
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
  const setCanvas = (el: HTMLCanvasElement | null) => {
    canvasElRef.current = el;
    canvasRef(el);
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
        ref={setCanvas}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "auto",
          filter: `blur(${blur}px)`,
        }}
      />
    </div>
  );
}

function parseHex(hex: string): [number, number, number] {
  let h = hex.trim();
  if (h.startsWith("#")) h = h.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
