import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CanvasConnectionProps {
  /** World-space start point. */
  from: { x: number; y: number };
  /** World-space end point. */
  to: { x: number; y: number };
  curve?: "straight" | "bezier" | "orthogonal" | "smart";
  color?: string;
  thickness?: number;
  /** Dashed + flowing animation (great for "data is moving" visuals). */
  animated?: boolean;
  /** Label rendered at the midpoint, in world coords. */
  label?: ReactNode;
  /** Show an arrowhead at `to`. */
  arrow?: boolean;
  /** Obstacles for `curve="smart"` — the routing tries to bend around
   *  these rectangles. No effect for the other curve modes. */
  obstacles?: ReadonlyArray<{ x: number; y: number; width: number; height: number }>;
  /** Padding around obstacles (world units). Default 12. */
  obstaclePadding?: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function padRect(r: Rect, pad: number): Rect {
  return {
    x: r.x - pad,
    y: r.y - pad,
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  };
}

function segIntersectsRect(a: Point, b: Point, r: Rect): boolean {
  const { x, y, width, height } = r;
  // Bbox reject
  if (Math.max(a.x, b.x) < x || Math.min(a.x, b.x) > x + width) return false;
  if (Math.max(a.y, b.y) < y || Math.min(a.y, b.y) > y + height) return false;
  // Axis-aligned segments are the common case for orthogonal routing —
  // do a direct check, no fancy line-segment intersection needed.
  if (a.x === b.x) {
    return a.x >= x && a.x <= x + width;
  }
  if (a.y === b.y) {
    return a.y >= y && a.y <= y + height;
  }
  // Fallback for diagonals — use line-rect clipping (Liang-Barsky).
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let t0 = 0;
  let t1 = 1;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x - x, x + width - a.x, a.y - y, y + height - a.y];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return true;
}

function clean(a: Point, b: Point, obstacles: ReadonlyArray<Rect>): boolean {
  for (const o of obstacles) {
    if (segIntersectsRect(a, b, o)) return false;
  }
  return true;
}

/** Smart orthogonal router — tries H-V, then V-H elbows; falls back to
 *  a three-segment detour that goes above / below the cluster of
 *  obstacles between `from` and `to`. Heuristic (not optimal) but good
 *  enough for node editors and flowcharts. */
function routeSmart(
  from: Point,
  to: Point,
  rawObstacles: ReadonlyArray<Rect>,
  pad: number,
): Point[] {
  const obstacles = rawObstacles.map((r) => padRect(r, pad));

  const hvElbow: Point = { x: to.x, y: from.y };
  if (clean(from, hvElbow, obstacles) && clean(hvElbow, to, obstacles)) {
    return [from, hvElbow, to];
  }

  const vhElbow: Point = { x: from.x, y: to.y };
  if (clean(from, vhElbow, obstacles) && clean(vhElbow, to, obstacles)) {
    return [from, vhElbow, to];
  }

  // Three-segment detour. Decide whether to route above or below based
  // on which side has fewer obstacles between `from` and `to`.
  const xMin = Math.min(from.x, to.x);
  const xMax = Math.max(from.x, to.x);
  const inRangeX = obstacles.filter((o) => o.x + o.width >= xMin && o.x <= xMax);
  const baselineY = Math.min(from.y, to.y);

  let aboveY = baselineY - pad;
  for (const o of inRangeX) {
    if (o.y < aboveY) aboveY = o.y - pad;
  }

  let belowY = Math.max(from.y, to.y) + pad;
  for (const o of inRangeX) {
    if (o.y + o.height > belowY) belowY = o.y + o.height + pad;
  }

  const aboveDist = Math.abs(baselineY - aboveY);
  const belowDist = Math.abs(belowY - baselineY);
  const routeY = aboveDist <= belowDist ? aboveY : belowY;

  return [
    from,
    { x: from.x, y: routeY },
    { x: to.x, y: routeY },
    to,
  ];
}

function polylineToPath(points: ReadonlyArray<Point>, radius = 6): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;
  const d: string[] = [`M${points[0].x},${points[0].y}`];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    // Trim the corner by `radius` to get a smooth bend.
    const d1 = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const d2 = Math.hypot(next.x - cur.x, next.y - cur.y);
    const r = Math.min(radius, d1 / 2, d2 / 2);
    const t1 = r / d1;
    const t2 = r / d2;
    const bx = cur.x + (prev.x - cur.x) * t1;
    const by = cur.y + (prev.y - cur.y) * t1;
    const ax = cur.x + (next.x - cur.x) * t2;
    const ay = cur.y + (next.y - cur.y) * t2;
    d.push(`L${bx.toFixed(1)},${by.toFixed(1)}`);
    d.push(`Q${cur.x},${cur.y} ${ax.toFixed(1)},${ay.toFixed(1)}`);
  }
  const last = points[points.length - 1];
  d.push(`L${last.x},${last.y}`);
  return d.join(" ");
}

/** SVG edge between two world-space points. Meant to be rendered inside
 *  a `<Canvas>` as a sibling of `<CanvasItem>`s so it rides the world
 *  transform — pan/zoom naturally.
 *
 * For node editors, pass the two node centers (or their socket positions)
 * and the line follows them around. Set `curve="smart"` + `obstacles`
 * and the route bends around other nodes rather than crossing them. */
export function CanvasConnection({
  from,
  to,
  curve = "bezier",
  color = "rgba(168,85,247,0.75)",
  thickness = 2,
  animated,
  label,
  arrow,
  obstacles,
  obstaclePadding = 12,
  className,
}: CanvasConnectionProps) {
  let path: string;
  let bboxMinX: number;
  let bboxMinY: number;
  let bboxMaxX: number;
  let bboxMaxY: number;

  if (curve === "smart") {
    const points = routeSmart(from, to, obstacles ?? [], obstaclePadding);
    bboxMinX = Math.min(...points.map((p) => p.x));
    bboxMinY = Math.min(...points.map((p) => p.y));
    bboxMaxX = Math.max(...points.map((p) => p.x));
    bboxMaxY = Math.max(...points.map((p) => p.y));
    const local = points.map((p) => ({ x: p.x - bboxMinX, y: p.y - bboxMinY }));
    path = polylineToPath(local);
  } else {
    bboxMinX = Math.min(from.x, to.x);
    bboxMinY = Math.min(from.y, to.y);
    bboxMaxX = Math.max(from.x, to.x);
    bboxMaxY = Math.max(from.y, to.y);
    const x1 = from.x - bboxMinX;
    const y1 = from.y - bboxMinY;
    const x2 = to.x - bboxMinX;
    const y2 = to.y - bboxMinY;
    if (curve === "straight") {
      path = `M${x1},${y1} L${x2},${y2}`;
    } else if (curve === "orthogonal") {
      const midX = (x1 + x2) / 2;
      path = `M${x1},${y1} L${midX},${y1} L${midX},${y2} L${x2},${y2}`;
    } else {
      const handle = Math.max(40, Math.abs(x2 - x1) / 2);
      path = `M${x1},${y1} C${x1 + handle},${y1} ${x2 - handle},${y2} ${x2},${y2}`;
    }
  }

  const width = Math.max(1, bboxMaxX - bboxMinX);
  const height = Math.max(1, bboxMaxY - bboxMinY);
  const markerId = `ch-arrow-${bboxMinX}-${bboxMinY}-${from.x}-${to.x}`.replace(/\./g, "_");
  const midX = (from.x + to.x) / 2 - bboxMinX;
  const midY = (from.y + to.y) / 2 - bboxMinY;

  return (
    <div
      style={{
        position: "absolute",
        left: bboxMinX,
        top: bboxMinY,
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
          strokeLinejoin="round"
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
