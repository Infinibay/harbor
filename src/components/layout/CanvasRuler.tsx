import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

export interface CanvasRulerProps {
  orientation: "horizontal" | "vertical";
  /** Thickness in pixels (height for horizontal, width for vertical). */
  thickness?: number;
  /** Approximate pixel distance between labeled ticks. Default 100. */
  targetTickSpacing?: number;
  className?: string;
}

/** Pixel ruler that scrolls with pan and rescales with zoom. Shows
 *  major labeled ticks at "nice" world-unit intervals (1, 2, 5 × 10^n). */
export function CanvasRuler({
  orientation,
  thickness = 22,
  targetTickSpacing = 100,
  className,
}: CanvasRulerProps) {
  const ctx = useCanvas();
  const [s, setS] = useState({ pan: 0, zoom: 1, size: 0 });

  useEffect(() => {
    if (!ctx) return;
    const vp = ctx.viewportRef.current;
    if (!vp) return;

    function update() {
      if (!vp) return;
      setS({
        pan:
          orientation === "horizontal" ? ctx!.x.get() : ctx!.y.get(),
        zoom: ctx!.zoom.get(),
        size:
          orientation === "horizontal" ? vp.clientWidth : vp.clientHeight,
      });
    }
    update();
    const ux = ctx.x.on("change", update);
    const uy = ctx.y.on("change", update);
    const uz = ctx.zoom.on("change", update);
    const ro = new ResizeObserver(update);
    ro.observe(vp);
    return () => {
      ux();
      uy();
      uz();
      ro.disconnect();
    };
  }, [ctx, orientation]);

  if (!ctx || s.size === 0) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bg-[#14141c]/70 border-white/10",
          orientation === "horizontal"
            ? "top-0 left-0 right-0 border-b"
            : "top-0 left-0 bottom-0 border-r",
          className,
        )}
        style={
          orientation === "horizontal"
            ? { height: thickness }
            : { width: thickness }
        }
      />
    );
  }

  // Choose a nice interval: base is targetTickSpacing world-pixels / zoom
  // → round to 1, 2 or 5 × 10^n.
  const raw = targetTickSpacing / s.zoom;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  const major = frac >= 5 ? 5 * pow : frac >= 2 ? 2 * pow : pow;
  const minor = major / 5;

  const worldStart = -s.pan / s.zoom;
  const worldEnd = (s.size - s.pan) / s.zoom;

  // Generate minor ticks within view
  const ticks: { pos: number; world: number; isMajor: boolean }[] = [];
  const firstMinor = Math.ceil(worldStart / minor) * minor;
  for (let w = firstMinor; w <= worldEnd; w += minor) {
    const pos = w * s.zoom + s.pan;
    const isMajor = Math.abs(Math.round(w / major) * major - w) < 0.001;
    ticks.push({ pos, world: w, isMajor });
  }

  const isH = orientation === "horizontal";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bg-[#14141c]/70 backdrop-blur-sm border-white/10 overflow-hidden",
        isH ? "top-0 left-0 right-0 border-b" : "top-0 left-0 bottom-0 border-r",
        className,
      )}
      style={isH ? { height: thickness } : { width: thickness }}
    >
      <svg
        width={isH ? s.size : thickness}
        height={isH ? thickness : s.size}
        style={{ display: "block" }}
      >
        {ticks.map((t, i) => {
          const len = t.isMajor ? thickness * 0.6 : thickness * 0.3;
          return (
            <g key={i}>
              <line
                x1={isH ? t.pos : thickness - len}
                y1={isH ? thickness - len : t.pos}
                x2={isH ? t.pos : thickness}
                y2={isH ? thickness : t.pos}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1}
              />
              {t.isMajor ? (
                <text
                  x={isH ? t.pos + 3 : thickness / 2}
                  y={isH ? thickness - 7 : t.pos - 3}
                  fill="rgba(255,255,255,0.55)"
                  fontSize={9}
                  fontFamily="ui-monospace, Menlo, monospace"
                  textAnchor={isH ? "start" : "middle"}
                  transform={
                    isH ? undefined : `rotate(-90 ${thickness / 2} ${t.pos})`
                  }
                >
                  {Math.round(t.world)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
