import { useId } from "react";
import { cn } from "../../lib/cn";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  showDot?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 28,
  stroke = "#a855f7",
  fill = "rgba(168,85,247,0.15)",
  showDot = true,
  className,
}: SparklineProps) {
  const id = useId();
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * height] as const);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block overflow-visible", className)}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${id})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {showDot ? (
        <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />
      ) : null}
    </svg>
  );
}
