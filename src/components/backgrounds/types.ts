import type { CSSProperties } from "react";

/** Props common to every animated background variant. */
export interface BackgroundCommonProps {
  /** Pause the animation externally. */
  paused?: boolean;
  /** 0..2+ multiplier on the animation's inherent speed. Default 1. */
  speed?: number;
  /** 0..1 — how "loud" the visual is. Different variants interpret this
   *  differently (opacity, amplitude, density). Default 0.5. */
  intensity?: number;
  /** Color palette. Each variant picks what it needs from it. Default
   *  palette derives from Harbor's accent tokens. */
  palette?: readonly string[];
  /** Respect `prefers-reduced-motion: reduce`. Default true. When
   *  reduced motion is active, a still frame is rendered. */
  respectReducedMotion?: boolean;
  /** Skip animation work when the tab is hidden. Default true. */
  pauseWhenHidden?: boolean;
  /** Skip animation work when the element is off-screen. Default true. */
  pauseWhenOutOfView?: boolean;
  /** Extra style applied to the outer wrapper. */
  style?: CSSProperties;
  className?: string;
}

/** Default palette: Harbor's accents + complementary tones. */
export const DEFAULT_PALETTE = [
  "#a855f7", // fuchsia
  "#38bdf8", // sky
  "#f472b6", // pink
  "#34d399", // emerald
  "#fbbf24", // amber
] as const;
