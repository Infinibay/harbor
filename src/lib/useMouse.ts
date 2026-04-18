import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks mouse position over an element and writes CSS vars --mx / --my (px
 * within the element) plus --nx / --ny (normalized -1..1 from center).
 * Optional onMove callback with the same payload.
 */
export function useMouseVars<T extends HTMLElement>(
  options: {
    onMove?: (p: {
      x: number;
      y: number;
      nx: number;
      ny: number;
      w: number;
      h: number;
    }) => void;
  } = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { onMove } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handle(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = rect.width ? (x / rect.width) * 2 - 1 : 0;
      const ny = rect.height ? (y / rect.height) * 2 - 1 : 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--nx", nx.toFixed(3));
      el.style.setProperty("--ny", ny.toFixed(3));
      onMove?.({ x, y, nx, ny, w: rect.width, h: rect.height });
    }

    el.addEventListener("mousemove", handle);
    return () => {
      el.removeEventListener("mousemove", handle);
    };
  }, [onMove]);

  return ref;
}
