import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";

export interface HeatmapCell {
  r: number;
  c: number;
  v: number;
}

export interface MetricHeatmapProps {
  /** Row labels (top-to-bottom). */
  rows: string[];
  /** Column labels (left-to-right). */
  cols: string[];
  /** Sparse cells — missing (r, c) combinations render as empty. */
  cells: readonly HeatmapCell[];
  /** `v` formatter for the tooltip + axis (optional). */
  formatV?: (v: number) => string;
  /** Anchor-midpoint + max for the color scale. Default: min/max of data. */
  scale?: { min?: number; mid?: number; max?: number };
  /** Click handler on a cell. */
  onCellClick?: (cell: HeatmapCell | null, rc: { r: number; c: number }) => void;
  /** Cell size in pixels. Default 22. */
  cellSize?: number;
  className?: string;
}

const COLOR_COLD = [14, 116, 144]; // sky-700ish
const COLOR_MID = [168, 85, 247]; // fuchsia
const COLOR_HOT = [244, 63, 94]; // rose

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r} ${g} ${bl})`;
}

/** Hour × day (or any 2D categorical) heatmap. Distinct from the
 *  calendar-shaped `HeatmapCalendar`: `MetricHeatmap` is a generic
 *  matrix view over named rows/cols. */
export function MetricHeatmap({
  rows,
  cols,
  cells,
  formatV = (v) => v.toFixed(2),
  scale,
  onCellClick,
  cellSize = 22,
  className,
}: MetricHeatmapProps) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const { min, mid, max, grid } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    const g: (HeatmapCell | undefined)[][] = Array.from({ length: rows.length }, () =>
      new Array(cols.length).fill(undefined),
    );
    for (const c of cells) {
      if (c.r < 0 || c.r >= rows.length) continue;
      if (c.c < 0 || c.c >= cols.length) continue;
      g[c.r][c.c] = c;
      if (c.v < lo) lo = c.v;
      if (c.v > hi) hi = c.v;
    }
    if (!isFinite(lo)) {
      lo = 0;
      hi = 1;
    }
    const sMin = scale?.min ?? lo;
    const sMax = scale?.max ?? hi;
    const sMid = scale?.mid ?? (sMin + sMax) / 2;
    return { min: sMin, mid: sMid, max: sMax, grid: g };
  }, [rows.length, cols.length, cells, scale]);

  function colorFor(v: number): string {
    if (!isFinite(v)) return "transparent";
    if (v <= min) return lerpColor(COLOR_COLD, COLOR_MID, 0);
    if (v >= max) return lerpColor(COLOR_MID, COLOR_HOT, 1);
    if (v < mid) {
      const t = (v - min) / Math.max(1e-9, mid - min);
      return lerpColor(COLOR_COLD, COLOR_MID, t);
    }
    const t = (v - mid) / Math.max(1e-9, max - mid);
    return lerpColor(COLOR_MID, COLOR_HOT, t);
  }

  const leftGutter = 72;
  const topGutter = 26;
  const width = leftGutter + cols.length * cellSize;
  const height = topGutter + rows.length * cellSize;

  const hoverCell = hover ? grid[hover.r]?.[hover.c] : undefined;

  return (
    <div className={cn("inline-flex flex-col gap-1 w-full overflow-auto", className)}>
      <svg width={width} height={height} className="block">
        {/* Column headers */}
        {cols.map((label, c) => (
          <text
            key={`ch-${c}`}
            x={leftGutter + c * cellSize + cellSize / 2}
            y={topGutter - 8}
            textAnchor="middle"
            fontSize={10}
            fill="rgba(255,255,255,0.5)"
            fontFamily="ui-monospace, monospace"
          >
            {label}
          </text>
        ))}
        {/* Row headers + cells */}
        {rows.map((label, r) => (
          <g key={`r-${r}`}>
            <text
              x={leftGutter - 8}
              y={topGutter + r * cellSize + cellSize / 2 + 3}
              textAnchor="end"
              fontSize={10}
              fill="rgba(255,255,255,0.5)"
              fontFamily="ui-monospace, monospace"
            >
              {label}
            </text>
            {cols.map((_, c) => {
              const cell = grid[r]?.[c];
              const highlighted = hover && hover.r === r && hover.c === c;
              return (
                <rect
                  key={`c-${c}`}
                  x={leftGutter + c * cellSize + 1}
                  y={topGutter + r * cellSize + 1}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  rx={2}
                  fill={cell ? colorFor(cell.v) : "rgba(255,255,255,0.04)"}
                  fillOpacity={cell ? 0.85 : 1}
                  stroke={highlighted ? "rgba(255,255,255,0.9)" : "transparent"}
                  strokeWidth={1}
                  onMouseEnter={() => setHover({ r, c })}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onCellClick?.(cell ?? null, { r, c })}
                  style={{ cursor: onCellClick ? "pointer" : undefined }}
                />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="text-xs text-white/60 tabular-nums font-mono min-h-[1.25rem]">
        {hover ? (
          <>
            <span className="text-white/40">
              {rows[hover.r]} · {cols[hover.c]}
            </span>
            {hoverCell ? (
              <span className="text-white ml-3">{formatV(hoverCell.v)}</span>
            ) : (
              <span className="text-white/30 ml-3">(no data)</span>
            )}
          </>
        ) : (
          <>
            <span>
              min <span className="text-white/40">{formatV(min)}</span>
            </span>
            <span className="ml-4">
              max <span className="text-white/40">{formatV(max)}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
