import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type DistortionPreset =
  | "scanlines"
  | "crt"
  | "grain"
  | "vhs"
  | "pixel-grid"
  | "dither"
  | "vignette"
  | "bloom"
  | "interlace";

export interface BackgroundDistortionProps {
  /** Which distortion effect to overlay. */
  preset: DistortionPreset;
  /** Strength of the effect. `0` is invisible, `1` is intense. Default `0.5`. */
  intensity?: number;
  /** Enable the preset's motion sub-effects (scanline roll, CRT flicker,
   *  VHS tracking band). `false` renders a frozen version. Default `true`.
   *  Also automatically disabled when `prefers-reduced-motion: reduce`. */
  animated?: boolean;
  /** Tint applied to mono presets (scanlines, pixel-grid, dither).
   *  Accepts any CSS color. Default: black stripes / white grid. */
  tint?: string;
  /** Blend mode for the overlay. Pick the mode that reads well on top of
   *  your specific background. Defaults vary per preset. */
  blend?: CSSProperties["mixBlendMode"];
  /** Override the overall overlay opacity. Useful for fine-tuning past
   *  the `intensity` range. Default `1`. */
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

const WRAPPER_CLASS = "absolute inset-0 pointer-events-none overflow-hidden";

/** Layer a distortion effect on top of any animated background (or any
 *  positioned content). Purely a DOM / CSS overlay — it doesn't touch
 *  the content below, just adds a visual pass.
 *
 *  ```tsx
 *  <div className="relative h-80">
 *    <MeshGradient />
 *    <BackgroundDistortion preset="crt" intensity={0.6} />
 *  </div>
 *  ```
 *
 *  Presets:
 *  - `scanlines` — clean horizontal stripes, optional slow vertical roll.
 *  - `crt` — scanlines + vignette + flicker. The classic tube look.
 *  - `grain` — film grain (fractal-noise turbulence overlay).
 *  - `vhs` — RGB horizontal fringing + drifting tracking band + grain.
 *  - `pixel-grid` — fine grid overlay, LCD / phosphor feel.
 *  - `dither` — halftone dot pattern.
 *  - `vignette` — radial edge darkening.
 *  - `bloom` — soft blurred / saturated pass (samples content behind).
 *  - `interlace` — alternating even/odd line darkening (broadcast look).
 *
 *  Must sit inside a `position: relative` parent. Works with every
 *  `AnimatedBackground` variant and any regular DOM content. */
export function BackgroundDistortion({
  preset,
  intensity = 0.5,
  animated = true,
  tint,
  blend,
  opacity = 1,
  className,
  style,
}: BackgroundDistortionProps) {
  const i = clamp01(intensity);

  switch (preset) {
    case "scanlines":
      return renderScanlines({ i, animated, tint, blend, opacity, className, style });
    case "crt":
      return renderCRT({ i, animated, tint, blend, opacity, className, style });
    case "grain":
      return renderGrain({ i, animated, blend, opacity, className, style });
    case "vhs":
      return renderVHS({ i, animated, blend, opacity, className, style });
    case "pixel-grid":
      return renderPixelGrid({ i, tint, blend, opacity, className, style });
    case "dither":
      return renderDither({ i, tint, blend, opacity, className, style });
    case "vignette":
      return renderVignette({ i, opacity, className, style });
    case "bloom":
      return renderBloom({ i, opacity, className, style });
    case "interlace":
      return renderInterlace({ i, tint, blend, opacity, animated, className, style });
  }
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

interface RenderArgs {
  i: number;
  animated?: boolean;
  tint?: string;
  blend?: CSSProperties["mixBlendMode"];
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

function renderScanlines({ i, animated, tint, blend, opacity, className, style }: RenderArgs) {
  const color = tint ?? "rgba(0,0,0,1)";
  const alpha = 0.15 + i * 0.45;
  const gap = 3;

  return (
    <div
      aria-hidden
      className={cn(
        WRAPPER_CLASS,
        animated ? "harbor-distort-anim" : null,
        className,
      )}
      style={{
        opacity,
        mixBlendMode: blend ?? "multiply",
        backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha(color, alpha)} 0px, ${withAlpha(color, alpha)} 1px, transparent 1px, transparent ${gap}px)`,
        backgroundSize: `100% ${gap * 2}px`,
        animation: animated ? `harbor-scanline-roll 1.6s linear infinite` : undefined,
        // Keyframe step = gap * 2 so the roll seamlessly wraps.
        ["--harbor-scanline-step" as string]: `${gap * 2}px`,
        ...style,
      }}
    />
  );
}

function renderCRT({ i, animated, tint, blend, opacity, className, style }: RenderArgs) {
  const color = tint ?? "rgba(0,0,0,1)";
  const lineAlpha = 0.12 + i * 0.38;
  const vignetteDark = 0.2 + i * 0.55;
  const gap = 3;

  return (
    <div
      aria-hidden
      className={cn(
        WRAPPER_CLASS,
        animated ? "harbor-distort-anim" : null,
        className,
      )}
      style={{
        opacity,
        mixBlendMode: blend ?? "multiply",
        // Three stacked backgrounds: RGB fringe stripes, scanlines, vignette.
        backgroundImage: [
          // RGB sub-pixel triad — very faint, cycles every 3px horizontally.
          `repeating-linear-gradient(90deg,
            rgba(255,0,40,${0.05 + i * 0.1}) 0px,
            rgba(255,0,40,${0.05 + i * 0.1}) 1px,
            rgba(0,255,80,${0.05 + i * 0.1}) 1px,
            rgba(0,255,80,${0.05 + i * 0.1}) 2px,
            rgba(0,120,255,${0.05 + i * 0.1}) 2px,
            rgba(0,120,255,${0.05 + i * 0.1}) 3px)`,
          // Scanlines.
          `repeating-linear-gradient(0deg,
            ${withAlpha(color, lineAlpha)} 0px,
            ${withAlpha(color, lineAlpha)} 1px,
            transparent 1px,
            transparent ${gap}px)`,
          // Vignette.
          `radial-gradient(ellipse 120% 90% at 50% 50%,
            transparent 55%,
            rgba(0,0,0,${vignetteDark}) 100%)`,
        ].join(","),
        animation: animated ? `harbor-crt-flicker 2.8s steps(12, end) infinite` : undefined,
        ["--harbor-crt-flick" as string]: `${0.02 + i * 0.05}`,
        ...style,
      }}
    />
  );
}

// Inline SVG turbulence, URL-encoded for data URIs. baseFrequency tweaks
// grain size — higher = finer. 0.85 matches the existing `.grain` class.
function grainDataUrl(frequency: number, opacity: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' stitchTiles='stitch' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${opacity}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}

function renderGrain({ i, animated, blend, opacity, className, style }: RenderArgs) {
  return (
    <div
      aria-hidden
      className={cn(
        WRAPPER_CLASS,
        animated ? "harbor-distort-anim" : null,
        className,
      )}
      style={{
        opacity: (opacity ?? 1) * (0.15 + i * 0.55),
        mixBlendMode: blend ?? "overlay",
        backgroundImage: grainDataUrl(0.85, 0.6),
        // Animate the grain by sliding the texture — feels like film shudder.
        animation: animated ? `harbor-vhs-jitter 0.12s steps(1, end) infinite` : undefined,
        // Boost visibility via filter contrast, scaled by intensity.
        filter: `contrast(${1 + i * 0.6}) brightness(${1 + i * 0.15})`,
        ...style,
      }}
    />
  );
}

function renderVHS({ i, animated, blend, opacity, className, style }: RenderArgs) {
  const fringe = 0.1 + i * 0.25;
  const band = 0.35 + i * 0.55;

  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        mixBlendMode: blend ?? "screen",
        ...style,
      }}
    >
      {/* Horizontal RGB fringe bands. */}
      <div
        className={cn(
          "absolute inset-0",
          animated ? "harbor-distort-anim" : null,
        )}
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,
              rgba(255, 56, 96, ${fringe}) 0px,
              rgba(255, 56, 96, ${fringe}) 1px,
              transparent 1px,
              transparent 4px),
            repeating-linear-gradient(0deg,
              transparent 0px,
              transparent 2px,
              rgba(56, 180, 255, ${fringe * 0.8}) 2px,
              rgba(56, 180, 255, ${fringe * 0.8}) 3px,
              transparent 3px,
              transparent 6px)
          `,
          mixBlendMode: "screen",
          animation: animated
            ? `harbor-vhs-jitter 0.18s steps(1, end) infinite`
            : undefined,
        }}
      />
      {/* Grain noise. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grainDataUrl(1.1, 0.65),
          opacity: 0.2 + i * 0.4,
          mixBlendMode: "overlay",
        }}
      />
      {/* Tracking band — slow-drifting bright horizontal sweep. */}
      {animated ? (
        <div
          className="absolute inset-x-0 h-[18%] harbor-distort-anim"
          style={{
            top: 0,
            background: `linear-gradient(180deg,
              transparent 0%,
              rgba(255,255,255,${band * 0.12}) 25%,
              rgba(255,255,255,${band * 0.35}) 50%,
              rgba(255,255,255,${band * 0.12}) 75%,
              transparent 100%)`,
            mixBlendMode: "screen",
            animation: `harbor-vhs-track 7s linear infinite`,
          }}
        />
      ) : null}
    </div>
  );
}

function renderPixelGrid({ i, tint, blend, opacity, className, style }: RenderArgs) {
  const color = tint ?? "rgba(255,255,255,1)";
  const alpha = 0.04 + i * 0.14;
  const cell = 4;

  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        mixBlendMode: blend ?? "overlay",
        backgroundImage: `
          linear-gradient(${withAlpha(color, alpha)} 1px, transparent 1px),
          linear-gradient(90deg, ${withAlpha(color, alpha)} 1px, transparent 1px)
        `,
        backgroundSize: `${cell}px ${cell}px`,
        ...style,
      }}
    />
  );
}

function renderDither({ i, tint, blend, opacity, className, style }: RenderArgs) {
  const color = tint ?? "rgba(0,0,0,1)";
  const alpha = 0.1 + i * 0.4;
  const cell = 3;
  const dot = 1;

  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        mixBlendMode: blend ?? "multiply",
        backgroundImage: `radial-gradient(circle at center,
          ${withAlpha(color, alpha)} 0 ${dot}px,
          transparent ${dot + 0.3}px)`,
        backgroundSize: `${cell}px ${cell}px`,
        ...style,
      }}
    />
  );
}

function renderVignette({ i, opacity, className, style }: RenderArgs) {
  const dark = 0.25 + i * 0.75;
  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        background: `radial-gradient(ellipse 130% 95% at 50% 50%,
          transparent 45%,
          rgba(0,0,0,${dark * 0.5}) 75%,
          rgba(0,0,0,${dark}) 100%)`,
        ...style,
      }}
    />
  );
}

function renderBloom({ i, opacity, className, style }: RenderArgs) {
  const blur = 2 + i * 8;
  const sat = 1 + i * 0.85;
  const bright = 1 + i * 0.2;
  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        // A faint wash so backdrop-filter has an element to render onto;
        // without this some browsers skip applying the filter entirely.
        background: "rgba(255,255,255,0.01)",
        backdropFilter: `blur(${blur}px) saturate(${sat}) brightness(${bright})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}) brightness(${bright})`,
        ...style,
      }}
    />
  );
}

function renderInterlace({ i, tint, blend, opacity, className, style }: RenderArgs) {
  const color = tint ?? "rgba(0,0,0,1)";
  const alpha = 0.1 + i * 0.5;
  return (
    <div
      aria-hidden
      className={cn(WRAPPER_CLASS, className)}
      style={{
        opacity,
        mixBlendMode: blend ?? "multiply",
        backgroundImage: `repeating-linear-gradient(0deg,
          ${withAlpha(color, alpha)} 0 1px,
          transparent 1px 2px)`,
        ...style,
      }}
    />
  );
}

/** Accept `rgba(r,g,b,a)`, `rgb(r,g,b)`, or `#rgb[a]` / `#rrggbb[aa]` and
 *  return the color with the given alpha applied. Minimal — enough for
 *  the styles used here. */
function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgba(")) {
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
  }
  if (color.startsWith("rgb(")) {
    return color.replace(/rgb\(([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${alpha})`);
  }
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const full =
      hex.length === 3
        ? hex.split("").map((c) => c + c).join("")
        : hex.length === 4
          ? hex.slice(0, 3).split("").map((c) => c + c).join("")
          : hex.slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

/** Wrap any content with a `BackgroundDistortion` overlay. Convenience
 *  for one-off compositions:
 *
 *  ```tsx
 *  <Distorted preset="crt" intensity={0.7}>
 *    <MeshGradient />
 *  </Distorted>
 *  ```
 */
export function Distorted({
  preset,
  intensity,
  animated,
  tint,
  blend,
  opacity,
  className,
  children,
}: BackgroundDistortionProps & { children: ReactNode }) {
  return (
    <div className={cn("absolute inset-0", className)}>
      {children}
      <BackgroundDistortion
        preset={preset}
        intensity={intensity}
        animated={animated}
        tint={tint}
        blend={blend}
        opacity={opacity}
      />
    </div>
  );
}
