import { useEffect, useState } from "react";
import { useCanvas } from "./Canvas";

export interface BrushStroke {
  /** SVG path commands in world coordinates. */
  d: string;
  color: string;
  thickness: number;
}

export interface CanvasBrushProps {
  /** When false the brush doesn't listen — flip this with your tool mode. */
  enabled?: boolean;
  thickness?: number;
  color?: string;
  /** 0 = angular (dot-to-dot), 1 = max smoothing via Catmull-Rom. Default 0.5. */
  smoothing?: number;
  /** Fires with the final path on release. Store it in your own state
   *  and render the strokes inside the Canvas however you like. */
  onStroke?: (stroke: BrushStroke) => void;
}

/** Freehand pen tool. Listens on the viewport for left-drag when
 *  `enabled`, collects a polyline, and emits a smoothed SVG path on
 *  release. Renders a live preview stroke while drawing.
 *
 *  ```tsx
 *  const [strokes, setStrokes] = useState<BrushStroke[]>([]);
 *  <Canvas>
 *    <svg style={{ position: "absolute", overflow: "visible", width: 0, height: 0 }}>
 *      {strokes.map((s, i) => (
 *        <path key={i} d={s.d} stroke={s.color} strokeWidth={s.thickness}
 *              fill="none" strokeLinecap="round" strokeLinejoin="round" />
 *      ))}
 *    </svg>
 *    <CanvasBrush
 *      enabled={tool === "draw"}
 *      onStroke={(s) => setStrokes((prev) => [...prev, s])}
 *    />
 *  </Canvas>
 *  ``` */
export function CanvasBrush({
  enabled = true,
  thickness = 2,
  color = "#fff",
  smoothing = 0.5,
  onStroke,
}: CanvasBrushProps) {
  const ctx = useCanvas();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!enabled || !ctx) return;
    const vp = ctx.viewportRef.current;
    if (!vp) return;

    function screenToWorld(clientX: number, clientY: number) {
      const r = vp!.getBoundingClientRect();
      const z = ctx!.zoom.get();
      return {
        x: (clientX - r.left - ctx!.x.get()) / z,
        y: (clientY - r.top - ctx!.y.get()) / z,
      };
    }

    function onDown(e: MouseEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-canvas-bounds]")) return;
      if (target.closest("[data-canvas-no-marquee]")) return;

      const start = screenToWorld(e.clientX, e.clientY);
      let live: { x: number; y: number }[] = [start];
      setPoints(live);
      e.preventDefault();

      function onMove(ev: MouseEvent) {
        const p = screenToWorld(ev.clientX, ev.clientY);
        // Skip duplicate / near-duplicate points to keep the path clean.
        const last = live[live.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) < 0.5) return;
        live = [...live, p];
        setPoints(live);
      }
      function onUp() {
        if (live.length > 1 && onStroke) {
          onStroke({
            d: smoothPath(live, smoothing),
            color,
            thickness,
          });
        }
        setPoints([]);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }

    vp.addEventListener("mousedown", onDown);
    return () => {
      vp.removeEventListener("mousedown", onDown);
    };
  }, [enabled, ctx, smoothing, color, thickness, onStroke]);

  if (points.length < 2) return null;
  const d = smoothPath(points, smoothing);
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Catmull-Rom → Bezier conversion. Produces a smooth SVG path string
 *  from a polyline; `tension` controls how tightly the curve hugs the
 *  points (0 = angular, 1 = very smooth). */
export function smoothPath(
  points: ReadonlyArray<{ x: number; y: number }>,
  tension = 0.5,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  const d: string[] = [`M${points[0].x},${points[0].y}`];
  const t = tension;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + ((p2.x - p0.x) / 6) * t;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * t;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * t;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * t;
    d.push(`C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x},${p2.y}`);
  }
  return d.join(" ");
}
