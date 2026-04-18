import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (v: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
  snap?: number[];
}

export function Slider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  snap,
  className,
}: SliderProps) {
  const [internal, setInternal] = useState(value ?? defaultValue);
  const current = value ?? internal;
  const pct = ((current - min) / (max - min)) * 100;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  function update(clientX: number) {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let ratio = (clientX - r.left) / r.width;
    ratio = Math.max(0, Math.min(1, ratio));
    let v = min + ratio * (max - min);
    v = Math.round(v / step) * step;
    if (snap) {
      const closest = snap.reduce((a, b) =>
        Math.abs(b - v) < Math.abs(a - v) ? b : a,
      );
      if (Math.abs(closest - v) / (max - min) < 0.03) v = closest;
    }
    v = Math.max(min, Math.min(max, v));
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    update(e.clientX);
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    update(e.clientX);
  }
  function onUp(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
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
              {current}
            </span>
          ) : null}
        </div>
      )}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        data-cursor="drag"
        className="relative h-9 flex items-center cursor-pointer select-none"
      >
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#a855f7,#38bdf8)",
            }}
          />
        </div>
        {snap?.map((s) => {
          const p = ((s - min) / (max - min)) * 100;
          return (
            <span
              key={s}
              className="absolute w-0.5 h-3 bg-white/20 rounded-full"
              style={{ left: `${p}%`, translate: "-50% 0" }}
            />
          );
        })}
        <motion.span
          animate={{
            left: `${pct}%`,
            scale: dragging ? 1.3 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute w-5 h-5 rounded-full bg-white shadow-lg ring-2 ring-fuchsia-400/40"
          style={{ translate: "-50% 0" }}
        />
        <AnimatePresence>
          {dragging ? (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -top-9 text-xs font-mono text-white bg-[#1c1c26] border border-white/10 px-2 py-1 rounded-md"
              style={{ left: `${pct}%`, translate: "-50% 0" }}
            >
              {current}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
