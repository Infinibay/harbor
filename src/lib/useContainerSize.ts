import { useEffect, useRef, useState, type RefObject } from "react";

export interface ContainerSize {
  width: number;
  height: number;
}

export interface UseContainerSizeOptions {
  /** Debounce updates to once every N ms. Useful for smooth layout
   *  animations during a window resize — Framer Motion re-measures on
   *  each render, so 60 renders/sec kills animations. */
  debounceMs?: number;
}

/** Observe an element's content-box size. Drives layout recalculations and
 *  forces re-renders so Framer Motion `layout` animations can pick up
 *  position changes on reflow. */
export function useContainerSize<T extends Element>(
  ref: RefObject<T | null>,
  options: UseContainerSizeOptions = {},
): ContainerSize {
  const { debounceMs = 0 } = options;
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number, h: number) =>
      setSize((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h },
      );

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (debounceMs <= 0) {
        apply(width, height);
        return;
      }
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => apply(width, height), debounceMs);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [ref, debounceMs]);

  return size;
}

/** Re-renders only when a *derived* discrete value (computed from size)
 *  changes. Perfect companion for layout animations: during a smooth
 *  resize the grid keeps its current column count, and only when the
 *  count actually changes does the component update — giving Framer
 *  Motion a clean from→to to animate. */
export function useContainerDerived<T extends Element, R>(
  ref: RefObject<T | null>,
  compute: (size: ContainerSize) => R,
  isEqual: (a: R, b: R) => boolean = Object.is,
): R {
  const [value, setValue] = useState<R>(() => compute({ width: 0, height: 0 }));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = compute(entry.contentRect);
      setValue((prev) => (isEqual(prev, next) ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, compute, isEqual]);

  return value;
}

/** True when the container is at or above the given width (container query
 *  without the CSS). Pair with `useContainerSize` for fine-grained control. */
export function useContainerAbove<T extends Element>(
  ref: RefObject<T | null>,
  minWidth: number,
): boolean {
  const { width } = useContainerSize(ref);
  return width >= minWidth;
}
