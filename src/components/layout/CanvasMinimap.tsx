import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasMinimapProps {
  /** Minimap side length in pixels (width; height derives from aspect). */
  size?: number;
  /** Explicit world bounds; defaults to auto (computed from items). */
  bounds?: Rect;
  /** Padding in world units added around the auto-bounds. */
  padding?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  floating?: boolean;
  className?: string;
}

/** A miniature of the world with a highlighted viewport rectangle.
 *  Click / drag inside it to pan the main canvas. Items are read from
 *  `[data-canvas-bounds]` children and shown as tiny rectangles. */
export function CanvasMinimap({
  size = 200,
  bounds: explicitBounds,
  padding = 80,
  position = "bottom-right",
  floating = true,
  className,
}: CanvasMinimapProps) {
  const ctx = useCanvas();
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({
    items: [] as Rect[],
    viewport: { x: 0, y: 0, width: 0, height: 0 },
    canvasZoom: 1,
    canvasPanX: 0,
    canvasPanY: 0,
  });

  useEffect(() => {
    if (!ctx) return;
    const vp = ctx.viewportRef.current;
    if (!vp) return;

    function measure() {
      if (!vp) return;
      const els = vp.querySelectorAll<HTMLElement>("[data-canvas-bounds]");
      const items: Rect[] = [];
      els.forEach((el) => {
        items.push({
          x: parseFloat(el.dataset.canvasX ?? "0"),
          y: parseFloat(el.dataset.canvasY ?? "0"),
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      });
      setState({
        items,
        viewport: {
          x: 0,
          y: 0,
          width: vp.clientWidth,
          height: vp.clientHeight,
        },
        canvasZoom: ctx!.zoom.get(),
        canvasPanX: ctx!.x.get(),
        canvasPanY: ctx!.y.get(),
      });
    }

    measure();
    const ux = ctx.x.on("change", measure);
    const uy = ctx.y.on("change", measure);
    const uz = ctx.zoom.on("change", measure);
    // Periodically re-measure items (their count/position may change).
    const iv = window.setInterval(measure, 400);
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => {
      ux();
      uy();
      uz();
      window.clearInterval(iv);
      ro.disconnect();
    };
  }, [ctx]);

  if (!ctx) return null;

  // Determine world bounds to display.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Viewport box in world coords:
  const vpWorldX = -state.canvasPanX / state.canvasZoom;
  const vpWorldY = -state.canvasPanY / state.canvasZoom;
  const vpWorldW = state.viewport.width / state.canvasZoom;
  const vpWorldH = state.viewport.height / state.canvasZoom;

  if (explicitBounds) {
    minX = explicitBounds.x;
    minY = explicitBounds.y;
    maxX = explicitBounds.x + explicitBounds.width;
    maxY = explicitBounds.y + explicitBounds.height;
  } else {
    for (const it of state.items) {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.width);
      maxY = Math.max(maxY, it.y + it.height);
    }
    // Include the current viewport, so the frame doesn't vanish when
    // the user pans off-world.
    minX = Math.min(minX, vpWorldX);
    minY = Math.min(minY, vpWorldY);
    maxX = Math.max(maxX, vpWorldX + vpWorldW);
    maxY = Math.max(maxY, vpWorldY + vpWorldH);
    if (!isFinite(minX)) {
      minX = vpWorldX;
      minY = vpWorldY;
      maxX = vpWorldX + vpWorldW;
      maxY = vpWorldY + vpWorldH;
    }
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
  }

  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);
  const aspect = worldW / worldH;
  const mmWidth = size;
  const mmHeight = size / aspect;
  const scale = mmWidth / worldW;

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (!ctx || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Target world point
    const wx = minX + mx / scale;
    const wy = minY + my / scale;
    // Center viewport on (wx, wy)
    const z = state.canvasZoom;
    ctx.api.panTo(
      state.viewport.width / 2 - wx * z,
      state.viewport.height / 2 - wy * z,
    );
  }

  const posCls = floating
    ? {
        "bottom-right": "absolute bottom-4 right-4",
        "bottom-left": "absolute bottom-4 left-4",
        "top-right": "absolute top-4 right-4",
        "top-left": "absolute top-4 left-4",
      }[position]
    : "";

  return (
    <div
      ref={ref}
      onMouseDown={handleClick}
      style={{ width: mmWidth, height: mmHeight }}
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-lg bg-[#14141c]/85 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)] cursor-crosshair",
        posCls,
        className,
      )}
    >
      {state.items.map((it, i) => (
        <div
          key={i}
          className="absolute rounded-[2px] bg-fuchsia-400/30 border border-fuchsia-300/50"
          style={{
            left: (it.x - minX) * scale,
            top: (it.y - minY) * scale,
            width: Math.max(2, it.width * scale),
            height: Math.max(2, it.height * scale),
          }}
        />
      ))}
      <div
        className="absolute border-2 border-sky-400/80 bg-sky-400/10 rounded-[2px] pointer-events-none"
        style={{
          left: (vpWorldX - minX) * scale,
          top: (vpWorldY - minY) * scale,
          width: vpWorldW * scale,
          height: vpWorldH * scale,
        }}
      />
    </div>
  );
}
