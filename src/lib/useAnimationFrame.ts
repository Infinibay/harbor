import { useEffect, useRef, useState } from "react";

export interface AnimationFrameOptions {
  /** Default `true`. Turn off entirely — no rAF loop is registered. */
  enabled?: boolean;
  /** Default `true`. When the tab / document is hidden, skip calling the
   *  callback (the rAF loop keeps running so we resume instantly). */
  pauseWhenHidden?: boolean;
  /** Default `true`. When the user has `prefers-reduced-motion: reduce`,
   *  don't run the loop at all. The component should render a static
   *  fallback in that case. */
  respectReducedMotion?: boolean;
  /** Default `true`. When the target element isn't in the viewport,
   *  skip invoking the callback (cheaper than unmounting). Requires a
   *  ref via the return value's `register()` function. */
  pauseWhenOutOfView?: boolean;
}

export interface AnimationFrameHandle {
  /** Ref setter for the element that should be observed for visibility. */
  register: (el: Element | null) => void;
  /** `true` when the loop is *not* running due to reduced motion. */
  reducedMotion: boolean;
}

export type AnimationFrameCallback = (dt: number, now: number) => void;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * requestAnimationFrame loop with sensible lifecycle defaults for
 * decorative animations: pause when hidden / out-of-view / reduced
 * motion is requested. The callback receives the frame delta in ms
 * (useful for time-based animations that work at any FPS).
 */
export function useAnimationFrame(
  callback: AnimationFrameCallback,
  options: AnimationFrameOptions = {},
): AnimationFrameHandle {
  const {
    enabled = true,
    pauseWhenHidden = true,
    respectReducedMotion = true,
    pauseWhenOutOfView = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const elRef = useRef<Element | null>(null);
  const inViewRef = useRef(true);
  const [reduced, setReduced] = useState(() =>
    respectReducedMotion ? prefersReducedMotion() : false,
  );

  // Watch prefers-reduced-motion changes.
  useEffect(() => {
    if (!respectReducedMotion || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // Visibility observer — only when a node has been registered.
  useEffect(() => {
    if (!pauseWhenOutOfView) {
      inViewRef.current = true;
      return;
    }
    const el = elRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      inViewRef.current = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pauseWhenOutOfView]);

  // Main loop.
  useEffect(() => {
    if (!enabled || reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const hidden = pauseWhenHidden && typeof document !== "undefined" && document.hidden;
      const outOfView = pauseWhenOutOfView && !inViewRef.current;
      if (!hidden && !outOfView) {
        callbackRef.current(dt, now);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, reduced, pauseWhenHidden, pauseWhenOutOfView]);

  return {
    register: (el) => {
      elRef.current = el;
    },
    reducedMotion: reduced,
  };
}

/** Pair with `useAnimationFrame` to get a Canvas DOM node + correct DPR
 *  sizing. Returns a ref setter and a {ctx, width, height} snapshot. */
export function useCanvasSetup<T extends HTMLCanvasElement>(): {
  ref: (el: T | null) => void;
  resize: (width: number, height: number) => void;
} {
  const canvasRef = useRef<T | null>(null);
  const sized = useRef({ w: 0, h: 0 });

  return {
    ref: (el) => {
      canvasRef.current = el;
    },
    resize(width, height) {
      const el = canvasRef.current;
      if (!el) return;
      if (sized.current.w === width && sized.current.h === height) return;
      sized.current = { w: width, h: height };
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      const ctx = el.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
  };
}
