import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CanvasConnectionProps {
  /** World-space start point. */
  from: { x: number; y: number };
  /** World-space end point. */
  to: { x: number; y: number };
  curve?: "straight" | "bezier" | "orthogonal";
  color?: string;
  thickness?: number;
  /** Dashed + flowing animation (great for "data is moving" visuals). */
  animated?: boolean;
  /** Label rendered at the midpoint, in world coords. */
  label?: ReactNode;
  /** Show an arrowhead at `to`. */
  arrow?: boolean;
  className?: string;
}

/** SVG edge between two world-space points. Meant to be rendered inside
 *  a `<Canvas>` as a sibling of `<CanvasItem>`s so it rides the world
 *  transform — pan/zoom naturally.
 *
 * For node editors, pass the two node centers (or their socket positions)
 * and the line follows them around. */
export function CanvasConnection({
  from,
  to,
  curve = "bezier",
  color = "rgba(168,85,247,0.75)",
  thickness = 2,
  animated,
  label,
  arrow,
  className,
}: CanvasConnectionProps) {
  const minX = Math.min(from.x, to.x);
  const minY = Math.min(from.y, to.y);
  const maxX = Math.max(from.x, to.x);
  const maxY = Math.max(from.y, to.y);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  const x1 = from.x - minX;
  const y1 = from.y - minY;
  const x2 = to.x - minX;
  const y2 = to.y - minY;

  let path: string;
  if (curve === "straight") {
    path = `M${x1},${y1} L${x2},${y2}`;
  } else if (curve === "orthogonal") {
    const midX = (x1 + x2) / 2;
    path = `M${x1},${y1} L${midX},${y1} L${midX},${y2} L${x2},${y2}`;
  } else {
    const handle = Math.max(40, Math.abs(x2 - x1) / 2);
    path = `M${x1},${y1} C${x1 + handle},${y1} ${x2 - handle},${y2} ${x2},${y2}`;
  }

  const markerId = `ch-arrow-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, "_");
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        width,
        height,
        pointerEvents: "none",
      }}
      className={className}
    >
      <svg
        width={width}
        height={height}
        style={{ overflow: "visible", position: "absolute", inset: 0 }}
      >
        {arrow ? (
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          </defs>
        ) : null}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={animated ? "6 5" : undefined}
          markerEnd={arrow ? `url(#${markerId})` : undefined}
        >
          {animated ? (
            <animate
              attributeName="stroke-dashoffset"
              from={0}
              to={-11}
              dur="0.7s"
              repeatCount="indefinite"
            />
          ) : null}
        </path>
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: midX,
            top: midY,
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
          }}
          className={cn(
            "px-1.5 py-0.5 rounded bg-[#14141c] border border-white/10 text-[10px] text-white/75 whitespace-nowrap",
          )}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
