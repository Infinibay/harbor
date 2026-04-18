import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

export interface CanvasMarqueeRect {
  /** World-space top-left. */
  x: number;
  y: number;
  /** World-space size. */
  width: number;
  height: number;
}

export interface CanvasMarqueeProps {
  /** Called while the user drags, on every frame. */
  onDrag?: (rect: CanvasMarqueeRect) => void;
  /** Called on release with the final rect. Always normalized (positive w/h). */
  onSelect?: (rect: CanvasMarqueeRect) => void;
  /** When provided, Marquee hit-tests these items against the drag rect
   *  and emits the intersecting IDs — both live (`onSelectionDrag`) and
   *  on release (`onSelection`). */
  items?: ReadonlyArray<{ id: string; x: number; y: number; width?: number; height?: number }>;
  /** Live stream of selected IDs as the drag grows/shrinks (requires `items`). */
  onSelectionDrag?: (ids: string[]) => void;
  /** Final selected IDs on release (requires `items`). */
  onSelection?: (ids: string[]) => void;
  /** Modifier that must be held to activate the marquee.
   *  - `none` (default): any left-drag on empty canvas
   *  - `shift` | `alt` | `ctrl`: require the key
   */
  modifier?: "none" | "shift" | "alt" | "ctrl";
  /** Disable the marquee (e.g., while another tool is active). */
  enabled?: boolean;
  className?: string;
}

/** Click-and-drag rubber-band select. Activates when the user starts a
 *  left-drag on empty canvas (not on a `CanvasItem`). Emits a world-space
 *  rect on every frame and on release — wire it up to your own selection
 *  logic.
 *
 * Compose with `<CanvasItem>` that reads a `selected` state from your
 * selection set to light them up. */
export function CanvasMarquee({
  onDrag,
  onSelect,
  items,
  onSelection,
  onSelectionDrag,
  modifier = "none",
  enabled = true,
  className,
}: CanvasMarqueeProps) {
  const ctx = useCanvas();
  const [rect, setRect] = useState<
    | null
    | { screenX: number; screenY: number; width: number; height: number }
  >(null);

  useEffect(() => {
    if (!ctx || !enabled) return;
    const vp = ctx.viewportRef.current;
    if (!vp) return;

    function modOk(e: MouseEvent): boolean {
      if (modifier === "none") return true;
      if (modifier === "shift") return e.shiftKey;
      if (modifier === "alt") return e.altKey;
      if (modifier === "ctrl") return e.ctrlKey || e.metaKey;
      return true;
    }

    function onDown(e: MouseEvent) {
      if (e.button !== 0 || !modOk(e)) return;
      const target = e.target as HTMLElement;
      // Skip when the click lands on a canvas item OR any element that
      // explicitly opts out of marquee (resize handles, panel headers,
      // etc. mark themselves with data-canvas-no-marquee).
      if (target.closest("[data-canvas-bounds]")) return;
      if (target.closest("[data-canvas-no-marquee]")) return;
      if (!vp) return;

      const vRect = vp.getBoundingClientRect();
      const startScreenX = e.clientX - vRect.left;
      const startScreenY = e.clientY - vRect.top;

      function toWorldRect(sx: number, sy: number, w: number, h: number): CanvasMarqueeRect {
        const z = ctx!.zoom.get();
        const nx = w < 0 ? sx + w : sx;
        const ny = h < 0 ? sy + h : sy;
        const nw = Math.abs(w);
        const nh = Math.abs(h);
        return {
          x: (nx - ctx!.x.get()) / z,
          y: (ny - ctx!.y.get()) / z,
          width: nw / z,
          height: nh / z,
        };
      }

      function hitIds(rect: CanvasMarqueeRect): string[] {
        if (!items) return [];
        const out: string[] = [];
        for (const it of items) {
          if (
            rectContains(rect, {
              x: it.x,
              y: it.y,
              width: it.width ?? 0,
              height: it.height ?? 0,
            })
          ) {
            out.push(it.id);
          }
        }
        return out;
      }
      function onMove(ev: MouseEvent) {
        const w = ev.clientX - vRect.left - startScreenX;
        const h = ev.clientY - vRect.top - startScreenY;
        setRect({
          screenX: startScreenX,
          screenY: startScreenY,
          width: w,
          height: h,
        });
        const world = toWorldRect(startScreenX, startScreenY, w, h);
        onDrag?.(world);
        if (onSelectionDrag && items) onSelectionDrag(hitIds(world));
      }
      function onUp(ev: MouseEvent) {
        const w = ev.clientX - vRect.left - startScreenX;
        const h = ev.clientY - vRect.top - startScreenY;
        const world = toWorldRect(startScreenX, startScreenY, w, h);
        onSelect?.(world);
        if (onSelection && items) onSelection(hitIds(world));
        setRect(null);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      e.preventDefault();
    }

    vp.addEventListener("mousedown", onDown);
    return () => {
      vp.removeEventListener("mousedown", onDown);
    };
  }, [ctx, enabled, modifier, onDrag, onSelect, items, onSelection, onSelectionDrag]);

  if (!rect) return null;
  const nx = rect.width < 0 ? rect.screenX + rect.width : rect.screenX;
  const ny = rect.height < 0 ? rect.screenY + rect.height : rect.screenY;
  const nw = Math.abs(rect.width);
  const nh = Math.abs(rect.height);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        left: nx,
        top: ny,
        width: nw,
        height: nh,
        pointerEvents: "none",
      }}
      className={cn(
        "border border-fuchsia-400/70 bg-fuchsia-400/10 rounded-[2px] shadow-[0_0_20px_-4px_rgba(168,85,247,0.7)]",
        className,
      )}
    />
  );
}

/** Utility: does a (world-space) rect contain an item at (x, y)? */
export function rectContains(
  rect: CanvasMarqueeRect,
  item: { x: number; y: number; width?: number; height?: number },
): boolean {
  const ix2 = item.x + (item.width ?? 0);
  const iy2 = item.y + (item.height ?? 0);
  const rx2 = rect.x + rect.width;
  const ry2 = rect.y + rect.height;
  return item.x < rx2 && ix2 > rect.x && item.y < ry2 && iy2 > rect.y;
}
