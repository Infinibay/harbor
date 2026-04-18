import { useEffect, useState } from "react";

/** Harbor breakpoints. Aligned with Tailwind screens AND --harbor-bp-* CSS
 *  tokens. Change in one place, everything stays in sync. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** Subscribe to a media query. SSR-safe; defaults to false on the server. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** True when the viewport is at or above the given breakpoint.
 *
 *   const isDesktop = useIsAbove("lg");  // >= 1024px
 */
export function useIsAbove(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[bp]}px)`);
}

/** True when the viewport is strictly below the given breakpoint. */
export function useIsBelow(bp: Breakpoint): boolean {
  return useMediaQuery(`(max-width: ${breakpoints[bp] - 0.02}px)`);
}

/** The largest breakpoint that matches. Reruns only when the bracket
 *  actually changes, not on every resize. */
export function useBreakpoint(): Breakpoint | "xs" {
  const sm = useIsAbove("sm");
  const md = useIsAbove("md");
  const lg = useIsAbove("lg");
  const xl = useIsAbove("xl");
  const xxl = useIsAbove("2xl");
  if (xxl) return "2xl";
  if (xl) return "xl";
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  return "xs";
}

/** Broad device class — width-based so it can't be fooled by userAgent.
 *  Use for layout decisions (which columns / drawer vs. sidebar / …). */
export type Device = "phone" | "tablet" | "desktop";

export function useDevice(): Device {
  const md = useIsAbove("md"); // ≥ 768
  const lg = useIsAbove("lg"); // ≥ 1024
  if (lg) return "desktop";
  if (md) return "tablet";
  return "phone";
}

export function useIsPhone() {
  return useIsBelow("md");
}
export function useIsTablet() {
  const md = useIsAbove("md");
  const lg = useIsAbove("lg");
  return md && !lg;
}
export function useIsDesktop() {
  return useIsAbove("lg");
}

/** Screen orientation from CSS media queries — updates on device rotation. */
export type Orientation = "portrait" | "landscape";

export function useOrientation(): Orientation {
  const portrait = useMediaQuery("(orientation: portrait)");
  return portrait ? "portrait" : "landscape";
}

export function useIsPortrait() {
  return useMediaQuery("(orientation: portrait)");
}
export function useIsLandscape() {
  return useMediaQuery("(orientation: landscape)");
}

/** True on touch-first devices (phones, tablets, some laptops with touch). */
export function useIsTouch() {
  return useMediaQuery("(pointer: coarse)");
}

/** True when the primary pointer supports hover (desktops with a mouse). */
export function useHasHover() {
  return useMediaQuery("(hover: hover)");
}

/** True when the user prefers reduced motion. Respect this for animations. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Pick a value by breakpoint, with `base` as the <sm fallback.
 *
 *   const cols = useResponsiveValue({ base: 1, md: 2, xl: 4 });
 *
 * Inherits the last defined step going up — so you don't need to
 * repeat values for every breakpoint. */
export function useResponsiveValue<T>(
  values: Partial<Record<"base" | Breakpoint, T>>,
): T | undefined {
  const bp = useBreakpoint();
  const order: ("base" | Breakpoint)[] = ["base", "sm", "md", "lg", "xl", "2xl"];
  const currentIdx = bp === "xs" ? 0 : order.indexOf(bp) === -1 ? 0 : order.indexOf(bp);
  for (let i = currentIdx; i >= 0; i--) {
    const key = order[i];
    if (values[key] !== undefined) return values[key];
  }
  return values.base;
}
