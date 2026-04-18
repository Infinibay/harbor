import { useEffect, useState, type RefObject } from "react";

export interface ContainerSize {
  width: number;
  height: number;
}

/** Observe an element's content-box size. Drives layout recalculations and
 *  forces re-renders so Framer Motion `layout` animations can pick up
 *  position changes on reflow. */
export function useContainerSize<T extends Element>(
  ref: RefObject<T | null>,
): ContainerSize {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
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
