import { useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";

export interface LineSeries {
  id: string;
  label?: string;
  color?: string;
  data: number[];
}

export interface LineChartProps {
  series: LineSeries[];
  labels?: string[];
  height?: number;
  yTicks?: number;
  area?: boolean;
  className?: string;
  formatY?: (v: number) => string;
}

const defaultColors = [
  "rgb(var(--harbor-chart-1))",
  "rgb(var(--harbor-chart-2))",
  "rgb(var(--harbor-chart-3))",
  "rgb(var(--harbor-chart-4))",
  "rgb(var(--harbor-chart-5))",
];

export function LineChart({
  series,
  labels,
  height = 220,
  yTicks = 4,
  area = true,
  className,
  formatY = (v) => String(Math.round(v)),
}: LineChartProps) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const padX = 40;
  const padY = 16;
  const width = 600;
  const innerW = width - padX - 8;
  const innerH = height - padY - 20;

  const { min, rangeY } = useMemo(() => {
    const all = series.flatMap((s) => s.data);
    if (!all.length) return { min: 0, rangeY: 1 };
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = (hi - lo) * 0.1 || 1;
    return { min: lo - pad, rangeY: hi - lo + 2 * pad };
  }, [series]);

  const pointCount = series[0]?.data.length ?? 0;
  const stepX = pointCount > 1 ? innerW / (pointCount - 1) : 0;

  function yFor(v: number) {
    return padY + innerH - ((v - min) / rangeY) * innerH;
  }
  function xFor(i: number) {
    return padX + i * stepX;
  }

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + (rangeY * i) / yTicks);

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
        role="img"
        aria-label="Line chart"
        onMouseLeave={() => setHover(null)}
      >
        {/* Y grid */}
        {ticks.map((t, i) => {
          const y = yFor(t);
          return (
            <g key={i}>
              <line
                x1={padX}
                x2={width - 8}
                y1={y}
                y2={y}
                stroke="var(--harbor-chart-grid)"
                strokeWidth={1}
              />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={10}
                fill="var(--harbor-chart-axis)"
                fontFamily="ui-monospace, monospace"
              >
                {formatY(t)}
              </text>
            </g>
          );
        })}

        {/* Series */}
        {series.map((s, si) => {
          const color = s.color ?? defaultColors[si % defaultColors.length];
          const pts = s.data.map((v, i) => [xFor(i), yFor(v)] as const);
          const path = pts
            .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
            .join(" ");
          const areaPath = `${path} L${xFor(s.data.length - 1)},${padY + innerH} L${padX},${padY + innerH} Z`;
          return (
            <g key={s.id}>
              {area ? (
                <>
                  <defs>
                    <linearGradient id={`lg-${id}-${si}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill={`url(#lg-${id}-${si})`} />
                </>
              ) : null}
              <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* Hover bar */}
        {hover !== null ? (
          <g>
            <line
              x1={xFor(hover)}
              x2={xFor(hover)}
              y1={padY}
              y2={padY + innerH}
              stroke="var(--harbor-chart-axis)"
              strokeDasharray="2 3"
            />
            {series.map((s, si) => {
              const color = s.color ?? defaultColors[si % defaultColors.length];
              return (
                <circle key={s.id} cx={xFor(hover)} cy={yFor(s.data[hover])} r={3.5} fill={color} />
              );
            })}
          </g>
        ) : null}

        {/* Hit zones */}
        {Array.from({ length: pointCount }).map((_, i) => (
          <rect
            key={i}
            x={xFor(i) - stepX / 2}
            y={padY}
            width={stepX || 10}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}

        {/* X labels */}
        {labels?.map((lb, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={height - 4}
            textAnchor="middle"
            fontSize={10}
            fill="var(--harbor-chart-axis)"
          >
            {i % Math.ceil(labels.length / 6) === 0 ? lb : ""}
          </text>
        ))}
      </svg>

      {hover !== null ? (
        <div className="mt-2 flex flex-wrap gap-4 text-xs">
          <span className="text-[color:var(--harbor-text-tertiary)] font-mono">{labels?.[hover] ?? `#${hover}`}</span>
          {series.map((s, si) => {
            const color = s.color ?? defaultColors[si % defaultColors.length];
            return (
              <span key={s.id} className="inline-flex items-center gap-1.5 text-[color:var(--harbor-text-secondary)]">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {s.label ?? s.id}
                <span className="font-mono text-[color:var(--harbor-text-primary)] tabular-nums">
                  {formatY(s.data[hover])}
                </span>
              </span>
            );
          })}
        </div>
      ) : series.length > 1 ? (
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-[color:var(--harbor-text-tertiary)]">
          {series.map((s, si) => {
            const color = s.color ?? defaultColors[si % defaultColors.length];
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
