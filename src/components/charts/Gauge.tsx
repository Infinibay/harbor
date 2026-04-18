import { cn } from "../../lib/cn";

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
  thresholds?: { at: number; color: string }[];
  className?: string;
}

const defaultThresholds = [
  { at: 0, color: "#34d399" },
  { at: 0.6, color: "#fbbf24" },
  { at: 0.85, color: "#f87171" },
];

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  size = 180,
  thresholds = defaultThresholds,
  className,
}: GaugeProps) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const start = Math.PI;
  const end = 2 * Math.PI;

  function pointOn(t: number) {
    const a = start + (end - start) * t;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const color = [...thresholds].reverse().find((t) => pct >= t.at)?.color ?? "#a855f7";
  const trackStart = pointOn(0);
  const trackEnd = pointOn(1);
  const fillEnd = pointOn(pct);
  // Gauge total sweep is exactly 180°, so the filled arc is always ≤ 180°:
  // large-arc-flag must always be 0, otherwise SVG picks the long way around.
  const largeArc = 0;

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
        <path
          d={`M${trackStart.x} ${trackStart.y} A${r} ${r} 0 ${largeArc} 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {pct > 0.005 ? (
          <path
            d={`M${trackStart.x} ${trackStart.y} A${r} ${r} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            style={{ transition: "stroke 200ms ease" }}
          />
        ) : null}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={fillEnd.x}
          y2={fillEnd.y}
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.85}
        />
        <circle cx={cx} cy={cy} r={4} fill="#fff" />
      </svg>
      <div className="flex flex-col items-center -mt-8">
        <span className="text-3xl font-semibold text-white font-mono tabular-nums">
          {Math.round(value)}
          {unit ? (
            <span className="text-sm text-white/45 ml-0.5 font-normal">{unit}</span>
          ) : null}
        </span>
        {label ? (
          <span className="text-xs uppercase tracking-wider text-white/50 mt-0.5">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
