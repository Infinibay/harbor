import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: ReactNode;
  tone?: "purple" | "green" | "amber" | "rose";
}

const gradients = {
  purple: ["#a855f7", "#38bdf8"],
  green: ["#10b981", "#34d399"],
  amber: ["#f59e0b", "#fbbf24"],
  rose: ["#f43f5e", "#fb7185"],
};

export function ProgressRing({
  value,
  max = 100,
  size = 96,
  stroke = 8,
  label,
  tone = "purple",
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const id = `ring-grad-${tone}`;
  const [g1, g2] = gradients[tone];
  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-white font-semibold">
        {label ?? `${Math.round(pct * 100)}%`}
      </div>
    </div>
  );
}
