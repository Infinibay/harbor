import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCanvas } from "./Canvas";

export interface VirtualItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasVirtualizedProps<T extends VirtualItem> {
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
  /** Extra world-space buffer around the viewport — items whose bbox
   *  intersects `viewport ± buffer` are rendered. Default 200. */
  buffer?: number;
  /** Override filtering when the items list is known to be small. */
  disabled?: boolean;
}

/** Only mounts children whose world-rect overlaps the viewport (± buffer).
 *  On pan/zoom, recomputes on the next animation frame so React doesn't
 *  re-render more often than the browser paints.
 *
 *  ```tsx
 *  <Canvas>
 *    <CanvasVirtualized
 *      items={items}
 *      renderItem={(it) => (
 *        <CanvasItem key={it.id} id={it.id} x={it.x} y={it.y}>
 *          <MyNode />
 *        </CanvasItem>
 *      )}
 *    />
 *  </Canvas>
 *  ``` */
export function CanvasVirtualized<T extends VirtualItem>({
  items,
  renderItem,
  buffer = 200,
  disabled,
}: CanvasVirtualizedProps<T>) {
  const ctx = useCanvas();
  const [visible, setVisible] = useState<readonly T[]>(items);
  const rafRef = useRef(0);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (disabled || !ctx) {
      setVisible(items);
      return;
    }
    const vp = ctx.viewportRef.current;
    if (!vp) return;

    const compute = () => {
      const z = ctx.zoom.get();
      const px = ctx.x.get();
      const py = ctx.y.get();
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const worldLeft = (-px - buffer) / z;
      const worldTop = (-py - buffer) / z;
      const worldRight = (vw - px + buffer) / z;
      const worldBottom = (vh - py + buffer) / z;
      const next: T[] = [];
      for (const it of items) {
        if (
          it.x + it.width >= worldLeft &&
          it.x <= worldRight &&
          it.y + it.height >= worldTop &&
          it.y <= worldBottom
        ) {
          next.push(it);
        }
      }
      setVisible(next);
    };

    const schedule = () => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      rafRef.current = requestAnimationFrame(() => {
        pendingRef.current = false;
        compute();
      });
    };

    compute();
    const u1 = ctx.x.on("change", schedule);
    const u2 = ctx.y.on("change", schedule);
    const u3 = ctx.zoom.on("change", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(vp);
    return () => {
      u1();
      u2();
      u3();
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [ctx, items, buffer, disabled]);

  return <>{visible.map((it) => renderItem(it))}</>;
}
