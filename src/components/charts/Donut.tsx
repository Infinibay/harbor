import { useState } from "react";
import { cn } from "../../lib/cn";

export interface DonutSlice {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface DonutProps {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

const defaultColors = ["#a855f7", "#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#fb7185"];

export function Donut({
  slices,
  size = 180,
  thickness = 18,
  centerLabel,
  centerValue,
  className,
}: DonutProps) {
  const [hover, setHover] = useState<string | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - thickness / 2;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const arcs = slices.map((s, i) => {
    const start = acc / total;
    const end = (acc + s.value) / total;
    acc += s.value;
    const a0 = start * Math.PI * 2 - Math.PI / 2;
    const a1 = end * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = end - start > 0.5 ? 1 : 0;
    const d = `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
    return { ...s, d, color: s.color ?? defaultColors[i % defaultColors.length] };
  });

  const activeSlice = hover ? slices.find((s) => s.id === hover) : null;

  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
          {arcs.map((a) => (
            <path
              key={a.id}
              d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth={thickness}
              strokeLinecap="butt"
              style={{
                transition: "stroke-width 150ms ease, opacity 150ms ease",
                strokeWidth: hover === a.id ? thickness + 3 : thickness,
                opacity: hover && hover !== a.id ? 0.4 : 1,
              }}
              onMouseEnter={() => setHover(a.id)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-white/45">
            {activeSlice ? activeSlice.label : centerLabel}
          </span>
          <span className="text-2xl font-semibold text-white font-mono tabular-nums">
            {activeSlice
              ? `${Math.round((activeSlice.value / total) * 100)}%`
              : centerValue}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-white/75 justify-center">
        {arcs.map((a) => (
          <span
            key={a.id}
            className="inline-flex items-center gap-1.5 cursor-default"
            onMouseEnter={() => setHover(a.id)}
            onMouseLeave={() => setHover(null)}
            style={{ opacity: hover && hover !== a.id ? 0.4 : 1 }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
            {a.label}
            <span className="text-white/45 font-mono">
              {Math.round((a.value / total) * 100)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
