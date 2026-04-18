import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";
import type { SnapGuide } from "../../lib/canvas-snap";

export interface CanvasSnapGuidesProps {
  /** Stroke color for the guides. Default fuchsia. */
  color?: string;
  className?: string;
}

/** Subscribes to the Canvas snap bus and draws the live pink guide
 *  lines whenever an item drag is snapping. Render inside the Canvas
 *  `overlay` slot. A no-op if `snap` isn't enabled on the Canvas. */
export function CanvasSnapGuides({
  color = "rgb(236 72 153)",
  className,
}: CanvasSnapGuidesProps) {
  const ctx = useCanvas();
  const [guides, setGuides] = useState<SnapGuide[]>([]);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!ctx?.snap) return;
    return ctx.snap.subscribe((g) => setGuides(g));
  }, [ctx]);

  useEffect(() => {
    const el = ctx?.viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setVp({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setVp({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, [ctx]);

  if (!ctx?.snap) return null;

  const z = ctx.zoom.get();
  const px = ctx.x.get();
  const py = ctx.y.get();

  // Subscribe to pan/zoom changes to re-project — cheap because guides
  // only exist while dragging, and dragging already re-publishes.
  return (
    <svg
      aria-hidden
      className={cn("absolute inset-0 pointer-events-none", className)}
      width={vp.w}
      height={vp.h}
      style={{ overflow: "visible" }}
    >
      <AnimatePresence>
        {guides.map((g) => {
          const key = `${g.kind}:${g.axis}:${g.position.toFixed(1)}:${g.refId ?? ""}`;
          const screenPos =
            g.axis === "x" ? g.position * z + px : g.position * z + py;
          // Guide extent on perpendicular axis. If from/to aren't
          // provided (grid), span the full viewport.
          const from =
            g.from !== undefined
              ? (g.axis === "x" ? g.from * z + py : g.from * z + px)
              : 0;
          const to =
            g.to !== undefined
              ? (g.axis === "x" ? g.to * z + py : g.to * z + px)
              : g.axis === "x"
                ? vp.h
                : vp.w;
          return (
            <motion.line
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              x1={g.axis === "x" ? screenPos : from}
              y1={g.axis === "x" ? from : screenPos}
              x2={g.axis === "x" ? screenPos : to}
              y2={g.axis === "x" ? to : screenPos}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="4 4"
              shapeRendering="crispEdges"
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
