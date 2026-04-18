import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

export interface CanvasZoomControlsProps {
  /** Preset zoom levels shown in the dropdown/display. */
  presets?: number[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  floating?: boolean;
  className?: string;
}

/** Floating zoom widget: − · 100% · + · fit. Reads + mutates the canvas
 *  via context, so drop it anywhere inside a `<Canvas>` (in the overlay
 *  slot or as a child). */
export function CanvasZoomControls({
  presets = [0.25, 0.5, 1, 1.5, 2, 4],
  position = "bottom-right",
  floating = true,
  className,
}: CanvasZoomControlsProps) {
  const ctx = useCanvas();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!ctx) return;
    setZoom(ctx.zoom.get());
    const u = ctx.zoom.on("change", () => setZoom(ctx.zoom.get()));
    return () => u();
  }, [ctx]);

  if (!ctx) return null;

  const posCls = floating
    ? {
        "bottom-right": "absolute bottom-4 right-4",
        "bottom-left": "absolute bottom-4 left-4",
        "top-right": "absolute top-4 right-4",
        "top-left": "absolute top-4 left-4",
      }[position]
    : "";

  const nextUp = presets.find((p) => p > zoom + 0.001) ?? ctx.maxZoom;
  const nextDown = [...presets].reverse().find((p) => p < zoom - 0.001) ?? ctx.minZoom;

  return (
    <div
      className={cn(
        "pointer-events-auto inline-flex items-center gap-0 p-0.5 rounded-lg bg-[#14141c]/85 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)] text-sm",
        posCls,
        className,
      )}
    >
      <button
        onClick={() => ctx.api.zoomTo(nextDown)}
        className="w-8 h-8 grid place-items-center rounded-md text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-30"
        disabled={zoom <= ctx.minZoom + 0.001}
        aria-label="Zoom out"
      >
        −
      </button>
      <div className="w-14 text-center tabular-nums font-mono text-xs text-white/80 select-none">
        {(zoom * 100).toFixed(0)}%
      </div>
      <button
        onClick={() => ctx.api.zoomTo(nextUp)}
        className="w-8 h-8 grid place-items-center rounded-md text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-30"
        disabled={zoom >= ctx.maxZoom - 0.001}
        aria-label="Zoom in"
      >
        +
      </button>
      <div className="w-px h-5 bg-white/10 mx-0.5" />
      <button
        onClick={() => ctx.api.fit()}
        className="h-8 px-2 rounded-md text-[11px] uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white"
        aria-label="Fit to content"
      >
        Fit
      </button>
      <button
        onClick={() => ctx.api.reset()}
        className="h-8 px-2 rounded-md text-[11px] uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white"
        aria-label="Reset view"
      >
        1:1
      </button>
    </div>
  );
}
