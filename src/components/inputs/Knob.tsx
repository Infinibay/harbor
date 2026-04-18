import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface KnobProps {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  label?: string;
  unit?: string;
  className?: string;
  /** degrees covered by full range (default 270°, -135°..135°) */
  arc?: number;
}

export function Knob({
  value,
  defaultValue = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 54,
  label,
  unit,
  className,
  arc = 270,
}: KnobProps) {
  const [internal, setInternal] = useState(value ?? defaultValue);
  const current = value ?? internal;
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ y: number; v: number } | null>(null);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const pct = (current - min) / (max - min);
  const startAngle = -arc / 2;
  const angle = startAngle + pct * arc;
  const r = size / 2;
  const stroke = 4;
  const trackR = r - stroke;

  function polar(deg: number, rr: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [r + rr * Math.cos(rad), r + rr * Math.sin(rad)];
  }

  function arcPath(from: number, to: number) {
    const [x1, y1] = polar(from, trackR);
    const [x2, y2] = polar(to, trackR);
    const large = Math.abs(to - from) > 180 ? 1 : 0;
    const sweep = to > from ? 1 : 0;
    return `M ${x1} ${y1} A ${trackR} ${trackR} 0 ${large} ${sweep} ${x2} ${y2}`;
  }

  function setValue(v: number) {
    v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, v: current };
    setDragging(true);
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    const dy = dragStart.current.y - e.clientY; // up = increase
    const range = max - min;
    const speed = e.shiftKey ? range / 800 : range / 200;
    const next = dragStart.current.v + dy * speed;
    setValue(next);
  }
  function onUp(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragStart.current = null;
    setDragging(false);
  }

  const indicatorLength = trackR - 6;
  const [ix, iy] = polar(angle, indicatorLength);

  return (
    <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={() => setValue(defaultValue)}
        className="relative cursor-ns-resize select-none"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="knob-grad" x1="0" x2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path
            d={arcPath(startAngle, startAngle + arc)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            d={arcPath(startAngle, angle)}
            stroke="url(#knob-grad)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx={r}
            cy={r}
            r={trackR - 4}
            fill="#14141c"
            stroke="rgba(255,255,255,0.08)"
          />
          <motion.line
            x1={r}
            y1={r}
            x2={ix}
            y2={iy}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {dragging ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white bg-[#1c1c26] border border-white/10 px-2 py-0.5 rounded-md"
          >
            {current}
            {unit ? <span className="text-white/40 ml-0.5">{unit}</span> : null}
          </motion.div>
        ) : null}
      </div>
      {label ? (
        <span className="text-[10px] uppercase tracking-wider text-white/55">
          {label}
        </span>
      ) : null}
    </div>
  );
}
