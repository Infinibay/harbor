import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { formatAbsolute } from "../../lib/format";

export interface TimeSeriesPoint {
  t: Date | number;
  v: number;
}

export interface TimeSeries {
  id: string;
  label?: string;
  color?: string;
  data: readonly TimeSeriesPoint[];
}

export interface TimeSeriesRange {
  from: Date;
  to: Date;
}

export interface TimeSeriesChartProps {
  series: readonly TimeSeries[];
  /** Explicit x-axis range. Default: inferred from data. */
  xDomain?: TimeSeriesRange;
  /** Explicit y-axis range. Default: inferred from data with 10 % padding. */
  yDomain?: [number, number];
  /** Draw filled areas under each line. Default true. */
  area?: boolean;
  /** Stack areas (Y values of later series stack on top of earlier). */
  stacked?: boolean;
  /** Number of Y axis ticks. Default 4. */
  yTicks?: number;
  height?: number;
  /** `v` formatter for axis + tooltip. */
  formatY?: (v: number) => string;
  /** Emitted when the user brushes a range (mousedown-drag-release) on the chart. */
  onRangeSelect?: (range: TimeSeriesRange) => void;
  /** Disable brushing (defaults to enabled when `onRangeSelect` is set). */
  brushEnabled?: boolean;
  /** `<TimeSeriesMarker at={date} label="..." color="..." />` children for annotations. */
  children?: ReactNode;
  className?: string;
}

const DEFAULT_COLORS = ["#a855f7", "#38bdf8", "#f472b6", "#34d399", "#fbbf24"];

// =====================================================================
// TimeSeriesMarker — vertical annotation line
// =====================================================================

export interface TimeSeriesMarkerProps {
  at: Date | number;
  label?: string;
  color?: string;
  /** `"solid"` | `"dashed"`. Default `"dashed"`. */
  stroke?: "solid" | "dashed";
}

// Marker is a marker: rendered by TimeSeriesChart, not directly into DOM.
export function TimeSeriesMarker(_props: TimeSeriesMarkerProps): null {
  return null;
}

function toMs(v: Date | number): number {
  return typeof v === "number" ? v : v.getTime();
}

// =====================================================================
// TimeSeriesChart
// =====================================================================

export function TimeSeriesChart({
  series,
  xDomain,
  yDomain,
  area = true,
  stacked,
  yTicks = 4,
  height = 240,
  formatY = (v) => String(Math.round(v * 100) / 100),
  onRangeSelect,
  brushEnabled,
  children,
  className,
}: TimeSeriesChartProps) {
  const gradId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [brush, setBrush] = useState<{ from: number; to: number } | null>(null);
  const brushEnabledFinal = brushEnabled ?? Boolean(onRangeSelect);

  const padLeft = 48;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 24;
  const width = 720;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  // Flatten data for domain + stacking.
  const pointsBySeries = useMemo(
    () =>
      series.map((s) =>
        s.data.map((p) => ({ t: toMs(p.t), v: p.v })),
      ),
    [series],
  );

  const stackedPoints = useMemo(() => {
    if (!stacked) return pointsBySeries;
    // Assume series share the same timestamps; stack values.
    const acc: number[] = new Array(pointsBySeries[0]?.length ?? 0).fill(0);
    return pointsBySeries.map((ps) =>
      ps.map((p, i) => {
        const prev = acc[i] ?? 0;
        acc[i] = prev + p.v;
        return { t: p.t, v: acc[i] };
      }),
    );
  }, [pointsBySeries, stacked]);

  const xRange = useMemo<[number, number]>(() => {
    if (xDomain) return [toMs(xDomain.from), toMs(xDomain.to)];
    let lo = Infinity;
    let hi = -Infinity;
    for (const ps of pointsBySeries) for (const p of ps) {
      if (p.t < lo) lo = p.t;
      if (p.t > hi) hi = p.t;
    }
    if (!isFinite(lo)) return [Date.now() - 3600_000, Date.now()];
    return [lo, hi];
  }, [pointsBySeries, xDomain]);

  const yRange = useMemo<[number, number]>(() => {
    if (yDomain) return yDomain;
    let lo = Infinity;
    let hi = -Infinity;
    for (const ps of stackedPoints) for (const p of ps) {
      if (p.v < lo) lo = p.v;
      if (p.v > hi) hi = p.v;
    }
    if (!isFinite(lo)) return [0, 1];
    if (lo === hi) return [lo - 1, hi + 1];
    const pad = (hi - lo) * 0.1;
    return [lo - pad, hi + pad];
  }, [stackedPoints, yDomain]);

  const xFor = useCallback(
    (t: number) => {
      const [lo, hi] = xRange;
      if (hi === lo) return padLeft + innerW / 2;
      return padLeft + ((t - lo) / (hi - lo)) * innerW;
    },
    [xRange, padLeft, innerW],
  );
  const yFor = useCallback(
    (v: number) => {
      const [lo, hi] = yRange;
      if (hi === lo) return padTop + innerH / 2;
      return padTop + innerH - ((v - lo) / (hi - lo)) * innerH;
    },
    [yRange, padTop, innerH],
  );

  // Axis ticks.
  const yTickValues = useMemo(
    () => Array.from({ length: yTicks + 1 }, (_, i) => yRange[0] + ((yRange[1] - yRange[0]) * i) / yTicks),
    [yRange, yTicks],
  );
  const xTickValues = useMemo(() => {
    const [lo, hi] = xRange;
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => lo + ((hi - lo) * i) / steps);
  }, [xRange]);

  // ---- Brush --------------------------------------------------------
  const brushStateRef = useRef<{ startX: number; pxToT: (x: number) => number } | null>(null);

  function clientToChartX(e: { clientX: number }): number | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = 0;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const local = pt.matrixTransform(ctm.inverse());
    return local.x;
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!brushEnabledFinal || e.button !== 0) return;
    const x = clientToChartX(e);
    if (x == null || x < padLeft || x > padLeft + innerW) return;
    const [lo, hi] = xRange;
    const pxToT = (px: number) => lo + ((px - padLeft) / innerW) * (hi - lo);
    brushStateRef.current = { startX: x, pxToT };
    setBrush({ from: pxToT(x), to: pxToT(x) });
    e.preventDefault();
    function onMove(ev: MouseEvent) {
      const cx = clientToChartX(ev);
      if (cx == null) return;
      const clamped = Math.max(padLeft, Math.min(padLeft + innerW, cx));
      const { startX, pxToT: p } = brushStateRef.current!;
      const a = Math.min(startX, clamped);
      const b = Math.max(startX, clamped);
      setBrush({ from: p(a), to: p(b) });
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const state = brushStateRef.current;
      const current = brush;
      brushStateRef.current = null;
      if (state && current && Math.abs(current.to - current.from) > 1000) {
        onRangeSelect?.({
          from: new Date(Math.min(current.from, current.to)),
          to: new Date(Math.max(current.from, current.to)),
        });
      }
      setBrush(null);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (brushStateRef.current) return; // let the brush drive
    const x = clientToChartX(e);
    if (x == null || x < padLeft || x > padLeft + innerW) {
      setHover(null);
      return;
    }
    const [lo, hi] = xRange;
    const t = lo + ((x - padLeft) / innerW) * (hi - lo);
    setHover(t);
  }

  // Extract markers from children
  const markers = useMemo(() => {
    const out: TimeSeriesMarkerProps[] = [];
    Children.forEach(children, (c) => {
      if (!isValidElement<TimeSeriesMarkerProps>(c)) return;
      if (c.type !== TimeSeriesMarker) return;
      out.push(c.props);
    });
    return out;
  }, [children]);

  const defaultFormatT = (t: number) => formatAbsolute(t, { preset: "time" });

  // Find nearest point per series to the hover timestamp.
  const hoverValues = useMemo(() => {
    if (hover == null) return null;
    return series.map((s, si) => {
      const ps = stackedPoints[si];
      if (!ps || ps.length === 0) return { s, value: NaN, t: hover };
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < ps.length; i++) {
        const d = Math.abs(ps[i].t - hover);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return { s, value: ps[best].v, t: ps[best].t };
    });
  }, [hover, series, stackedPoints]);

  return (
    <div className={cn("w-full", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
        preserveAspectRatio="none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHover(null)}
        style={{ cursor: brushEnabledFinal ? "crosshair" : "default" }}
      >
        {/* Y grid */}
        {yTickValues.map((t, i) => {
          const y = yFor(t);
          return (
            <g key={`yt-${i}`}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={10}
                fill="rgba(255,255,255,0.45)"
                fontFamily="ui-monospace, monospace"
              >
                {formatY(t)}
              </text>
            </g>
          );
        })}

        {/* X ticks */}
        {xTickValues.map((t, i) => (
          <text
            key={`xt-${i}`}
            x={xFor(t)}
            y={height - 6}
            textAnchor="middle"
            fontSize={10}
            fill="rgba(255,255,255,0.4)"
            fontFamily="ui-monospace, monospace"
          >
            {defaultFormatT(t)}
          </text>
        ))}

        {/* Areas / lines (stacked reverse so bottom draws first) */}
        {series.map((s, si) => {
          const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
          const ps = stackedPoints[si];
          if (!ps || ps.length === 0) return null;
          const path = ps
            .map((p, i) => `${i === 0 ? "M" : "L"}${xFor(p.t).toFixed(1)},${yFor(p.v).toFixed(1)}`)
            .join(" ");
          const baseY = stacked && si > 0
            ? stackedPoints[si - 1].map((p) => yFor(p.v))
            : null;
          const areaPath = baseY
            ? `${path} L${xFor(ps[ps.length - 1].t).toFixed(1)},${baseY[baseY.length - 1].toFixed(1)} ${ps
                .slice()
                .reverse()
                .map((p, i) => `L${xFor(p.t).toFixed(1)},${baseY[ps.length - 1 - i].toFixed(1)}`)
                .join(" ")} Z`
            : `${path} L${xFor(ps[ps.length - 1].t).toFixed(1)},${padTop + innerH} L${xFor(ps[0].t).toFixed(1)},${padTop + innerH} Z`;

          return (
            <g key={s.id}>
              {area ? (
                <>
                  <defs>
                    <linearGradient id={`${gradId}-${si}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill={`url(#${gradId}-${si})`} />
                </>
              ) : null}
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Markers */}
        {markers.map((m, i) => {
          const x = xFor(toMs(m.at));
          const color = m.color ?? "rgba(244,114,182,0.85)";
          return (
            <g key={`marker-${i}`}>
              <line
                x1={x}
                x2={x}
                y1={padTop}
                y2={padTop + innerH}
                stroke={color}
                strokeWidth={1}
                strokeDasharray={m.stroke === "solid" ? undefined : "3 3"}
              />
              {m.label ? (
                <text
                  x={x + 4}
                  y={padTop + 12}
                  fontSize={10}
                  fill={color}
                  fontFamily="ui-monospace, monospace"
                >
                  {m.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Hover crosshair + points */}
        {hover != null ? (
          <g>
            <line
              x1={xFor(hover)}
              x2={xFor(hover)}
              y1={padTop}
              y2={padTop + innerH}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="2 3"
            />
            {hoverValues?.map(({ s, value, t }, si) => (
              <circle
                key={s.id}
                cx={xFor(t)}
                cy={yFor(value)}
                r={3.5}
                fill={s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length]}
              />
            ))}
          </g>
        ) : null}

        {/* Brush rect */}
        {brush ? (
          <rect
            x={xFor(Math.min(brush.from, brush.to))}
            y={padTop}
            width={Math.max(1, xFor(Math.max(brush.from, brush.to)) - xFor(Math.min(brush.from, brush.to)))}
            height={innerH}
            fill="rgba(168,85,247,0.18)"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth={1}
            pointerEvents="none"
          />
        ) : null}
      </svg>

      {hoverValues ? (
        <div className="mt-2 flex flex-wrap gap-4 text-xs">
          <span className="text-white/55 font-mono tabular-nums">
            {formatAbsolute(hover!, { preset: "datetime" })}
          </span>
          {hoverValues.map(({ s, value }, si) => {
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
            return (
              <span key={s.id} className="inline-flex items-center gap-1.5 text-white/85">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {s.label ?? s.id}
                <span className="font-mono text-white tabular-nums">{formatY(value)}</span>
              </span>
            );
          })}
        </div>
      ) : series.length > 1 ? (
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/55">
          {series.map((s, si) => {
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
            return (
              <span key={s.id} className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {s.label ?? s.id}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
