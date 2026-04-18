import { useId, useState } from "react";
import { cn } from "../../lib/cn";

export interface Bar {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  bars: Bar[];
  height?: number;
  orientation?: "vertical" | "horizontal";
  formatValue?: (v: number) => string;
  className?: string;
}

const defaultColor = "#a855f7";

export function BarChart({
  bars,
  height = 220,
  orientation = "vertical",
  formatValue = (v) => String(Math.round(v)),
  className,
}: BarChartProps) {
  const id = useId();
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...bars.map((b) => b.value), 1);

  if (orientation === "horizontal") {
    return (
      <div className={cn("w-full flex flex-col gap-1.5", className)}>
        {bars.map((b) => {
          const pct = (b.value / max) * 100;
          const color = b.color ?? defaultColor;
          return (
            <div
              key={b.id}
              className="flex items-center gap-3"
              onMouseEnter={() => setHover(b.id)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="w-24 text-xs text-white/60 truncate">{b.label}</span>
              <div className="flex-1 h-5 rounded bg-white/[0.04] overflow-hidden relative">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}cc, ${color}88)`,
                    boxShadow: hover === b.id ? `0 0 0 1px ${color}66` : undefined,
                  }}
                />
              </div>
              <span className="w-14 text-right text-xs text-white/70 font-mono tabular-nums">
                {formatValue(b.value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  const padX = 32;
  const padTop = 16;
  const padBot = 24;
  const width = Math.max(300, bars.length * 40);
  const innerW = width - padX - 8;
  const innerH = height - padTop - padBot;
  const gap = 6;
  const barW = Math.max(8, innerW / bars.length - gap);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block" style={{ minWidth: width }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padTop + innerH - t * innerH;
          return (
            <g key={t}>
              <line x1={padX} x2={width - 8} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={10}
                fill="rgba(255,255,255,0.4)"
                fontFamily="ui-monospace, monospace"
              >
                {formatValue(t * max)}
              </text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const h = (b.value / max) * innerH;
          const x = padX + i * (innerW / bars.length) + gap / 2;
          const y = padTop + innerH - h;
          const color = b.color ?? defaultColor;
          const isHover = hover === b.id;
          return (
            <g key={b.id} onMouseEnter={() => setHover(b.id)} onMouseLeave={() => setHover(null)}>
              <defs>
                <linearGradient id={`b-${id}-${i}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={isHover ? 1 : 0.85} />
                  <stop offset="100%" stopColor={color} stopOpacity={isHover ? 0.7 : 0.5} />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={3}
                fill={`url(#b-${id}-${i})`}
                style={{ transition: "y 150ms ease, height 150ms ease" }}
              />
              {isHover ? (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#fff"
                  fontFamily="ui-monospace, monospace"
                >
                  {formatValue(b.value)}
                </text>
              ) : null}
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={10}
                fill="rgba(255,255,255,0.55)"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
