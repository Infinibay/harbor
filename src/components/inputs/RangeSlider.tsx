import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (v: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function RangeSlider({
  value,
  defaultValue = [20, 80],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className,
}: RangeSliderProps) {
  const [internal, setInternal] = useState<[number, number]>(
    value ?? defaultValue,
  );
  const current = value ?? internal;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const pctA = ((current[0] - min) / (max - min)) * 100;
  const pctB = ((current[1] - min) / (max - min)) * 100;

  function pickClosest(clientX: number) {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return null;
    const ratio = (clientX - r.left) / r.width;
    const val = min + ratio * (max - min);
    return Math.abs(val - current[0]) < Math.abs(val - current[1])
      ? "a"
      : "b";
  }

  function update(thumb: "a" | "b", clientX: number) {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    let ratio = (clientX - r.left) / r.width;
    ratio = Math.max(0, Math.min(1, ratio));
    let v = min + ratio * (max - min);
    v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    let next: [number, number] = [...current];
    if (thumb === "a") next[0] = Math.min(v, current[1]);
    else next[1] = Math.max(v, current[0]);
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    const which = pickClosest(e.clientX);
    if (!which) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(which);
    update(which, e.clientX);
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    update(dragging, e.clientX);
  }
  function onUp(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(null);
  }

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline mb-2">
          {label ? (
            <span className="text-xs text-white/60">{label}</span>
          ) : null}
          {showValue ? (
            <span className="text-xs font-mono text-white tabular-nums">
              {current[0]} – {current[1]}
            </span>
          ) : null}
        </div>
      )}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className="relative h-9 flex items-center select-none cursor-pointer"
      >
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ left: `${pctA}%`, right: `${100 - pctB}%` }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute top-0 h-full"
            style={{
              background: "linear-gradient(90deg,#a855f7,#38bdf8)",
            }}
          />
        </div>
        <Thumb pct={pctA} dragging={dragging === "a"} label={current[0]} />
        <Thumb pct={pctB} dragging={dragging === "b"} label={current[1]} />
      </div>
    </div>
  );
}

function Thumb({
  pct,
  dragging,
  label,
}: {
  pct: number;
  dragging: boolean;
  label: number;
}) {
  return (
    <motion.span
      animate={{ left: `${pct}%`, scale: dragging ? 1.3 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute w-5 h-5 rounded-full bg-white shadow-lg ring-2 ring-fuchsia-400/40"
      style={{ translate: "-50% 0" }}
    >
      {dragging ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white bg-[#1c1c26] border border-white/10 px-2 py-0.5 rounded-md"
        >
          {label}
        </motion.span>
      ) : null}
    </motion.span>
  );
}
