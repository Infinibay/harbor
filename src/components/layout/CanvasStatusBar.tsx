import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

export interface CanvasStatusBarProps {
  /** Extra content shown on the left (after the built-ins). */
  left?: ReactNode;
  /** Extra content shown on the right. */
  right?: ReactNode;
  showCoords?: boolean;
  showZoom?: boolean;
  /** Float pinned to the bottom of the Canvas `overlay`. */
  floating?: boolean;
  className?: string;
}

/** Thin info bar that shows live x/y/zoom coords and hosts custom
 *  slots. Subscribes to the Canvas context. */
export function CanvasStatusBar({
  left,
  right,
  showCoords = true,
  showZoom = true,
  floating = true,
  className,
}: CanvasStatusBarProps) {
  const ctx = useCanvas();
  const [s, setS] = useState({ x: 0, y: 0, z: 1 });

  useEffect(() => {
    if (!ctx) return;
    function update() {
      setS({ x: ctx!.x.get(), y: ctx!.y.get(), z: ctx!.zoom.get() });
    }
    update();
    const ux = ctx.x.on("change", update);
    const uy = ctx.y.on("change", update);
    const uz = ctx.zoom.on("change", update);
    return () => {
      ux();
      uy();
      uz();
    };
  }, [ctx]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-4 px-3 h-7 rounded-md bg-[#14141c]/85 backdrop-blur-md border border-white/10 text-[11px] text-white/60",
        floating && "absolute bottom-3 left-3 right-3",
        className,
      )}
    >
      {left}
      {showCoords ? (
        <span className="tabular-nums font-mono flex items-center gap-3">
          <span>
            <span className="text-white/30">x</span> {s.x.toFixed(0)}
          </span>
          <span>
            <span className="text-white/30">y</span> {s.y.toFixed(0)}
          </span>
        </span>
      ) : null}
      <span className="flex-1" />
      {showZoom ? (
        <span className="tabular-nums font-mono">
          <span className="text-white/30">zoom</span> {(s.z * 100).toFixed(0)}%
        </span>
      ) : null}
      {right}
    </div>
  );
}
