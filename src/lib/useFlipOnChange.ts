import { useLayoutEffect, useRef, type RefObject } from "react";

export interface UseFlipOnChangeOptions {
  /** CSS selector (scoped to direct children by default) to find items. */
  selector?: string;
  /** Animation duration, ms. */
  durationMs?: number;
  /** CSS timing function. */
  easing?: string;
}

/** Manual FLIP: cache each child's logical position (offsetLeft/Top) every
 *  render, and when `dep` changes, animate from the cached "before" to the
 *  freshly-measured "after" with a CSS `transform` transition.
 *
 * Why not Framer Motion `layout`? During a continuous-drag resize, FM's
 * per-render measurement gets out of sync with `layoutDependency` triggers,
 * so animations snap. Here we decide ourselves exactly when to measure
 * ("before" is whatever was cached on the previous render) and when to
 * animate (only on dep change), so slow window-drags produce clean from→to
 * transitions at each threshold crossing.
 */
export function useFlipOnChange<T>(
  containerRef: RefObject<HTMLElement | null>,
  dep: T,
  options: UseFlipOnChangeOptions = {},
): void {
  const {
    selector = ":scope > [data-flip]",
    durationMs = 450,
    easing = "cubic-bezier(0.32, 0.72, 0, 1)",
  } = options;

  const prevPos = useRef<Map<string, { left: number; top: number }>>(new Map());
  const prevDep = useRef<T>(dep);
  const initialized = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>(selector),
    );

    const capture = () => {
      const m = new Map<string, { left: number; top: number }>();
      for (const item of items) {
        const id = item.dataset.flip;
        if (!id) continue;
        m.set(id, { left: item.offsetLeft, top: item.offsetTop });
      }
      return m;
    };

    if (!initialized.current) {
      initialized.current = true;
      prevPos.current = capture();
      prevDep.current = dep;
      return;
    }

    const nextPos = capture();

    if (!Object.is(dep, prevDep.current)) {
      // Invert: apply a transform that visually holds each item at its
      // previous (pre-layout-change) position.
      for (const item of items) {
        const id = item.dataset.flip;
        if (!id) continue;
        const prev = prevPos.current.get(id);
        const curr = nextPos.get(id);
        if (!prev || !curr) continue;
        const dx = prev.left - curr.left;
        const dy = prev.top - curr.top;
        if (dx === 0 && dy === 0) {
          item.style.transition = "none";
          item.style.transform = "";
          continue;
        }
        item.style.transition = "none";
        item.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      // Force reflow so the pre-animation transform is applied before we
      // swap to the animated one.
      void container.offsetWidth;

      // Play: next frame, remove the inversion with a transition — items
      // animate from the held position back to their new logical slot.
      requestAnimationFrame(() => {
        for (const item of items) {
          item.style.transition = `transform ${durationMs}ms ${easing}`;
          item.style.transform = "";
        }
      });

      prevDep.current = dep;
    }

    prevPos.current = nextPos;
  });
}
