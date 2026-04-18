import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type RefObject,
} from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

type Ctx = {
  /** Viewport X of the cursor (or -9999 when not present). */
  x: MotionValue<number>;
  /** Viewport Y of the cursor. */
  y: MotionValue<number>;
};

const CursorCtx = createContext<Ctx | null>(null);

/**
 * Tracks the cursor globally and exposes motion values so any component can
 * react to proximity without each attaching its own mousemove listener.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function onOut() {
      x.set(-9999);
      y.set(-9999);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onOut);
    document.addEventListener("mouseleave", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onOut);
      document.removeEventListener("mouseleave", onOut);
    };
  }, [x, y]);

  return (
    <CursorCtx.Provider value={{ x, y }}>{children}</CursorCtx.Provider>
  );
}

export function useGlobalCursor(): Ctx | null {
  return useContext(CursorCtx);
}

export interface CursorProximity {
  /** Normalized direction from element center to cursor, clamped at radius. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** Cursor position within the element (0..1 horizontally/vertically). */
  localX: MotionValue<number>;
  localY: MotionValue<number>;
  /** 0..1 — 1 when cursor is at element center, 0 when outside `radius`. */
  proximity: MotionValue<number>;
  /** 0..1 — 1 when the cursor is directly inside the element's rect. */
  inside: MotionValue<number>;
}

/**
 * Returns motion values describing how close the global cursor is to this
 * element. Use inside small, reactive components (buttons, icons, avatars)
 * to add subtle "living" responses without per-element event listeners.
 */
export function useCursorProximity<T extends HTMLElement>(
  ref: RefObject<T | null>,
  radius = 140,
): CursorProximity {
  const ctx = useContext(CursorCtx);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const localX = useMotionValue(0.5);
  const localY = useMotionValue(0.5);
  const proximity = useMotionValue(0);
  const inside = useMotionValue(0);

  useEffect(() => {
    if (!ctx) return;
    function compute() {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const mx = ctx!.x.get();
      const my = ctx!.y.get();

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);

      localX.set((mx - r.left) / r.width);
      localY.set((my - r.top) / r.height);

      const isInside =
        mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
      inside.set(isInside ? 1 : 0);

      if (dist > radius) {
        proximity.set(0);
        nx.set(0);
        ny.set(0);
      } else {
        proximity.set(1 - dist / radius);
        nx.set(dx / radius);
        ny.set(dy / radius);
      }
    }
    compute();
    const uX = ctx.x.on("change", compute);
    const uY = ctx.y.on("change", compute);
    return () => {
      uX();
      uY();
    };
  }, [ctx, radius, ref, nx, ny, localX, localY, proximity, inside]);

  return { nx, ny, localX, localY, proximity, inside };
}
