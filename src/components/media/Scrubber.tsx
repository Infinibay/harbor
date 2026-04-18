import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ScrubberMarker {
  time: number;
  label?: string;
  color?: string;
}

export interface ScrubberProps {
  value: number;
  duration: number;
  onSeek: (t: number) => void;
  buffered?: number;
  markers?: ScrubberMarker[];
  waveform?: number[];
  className?: string;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function Scrubber({
  value,
  duration,
  onSeek,
  buffered,
  markers,
  waveform,
  className,
}: ScrubberProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const pct = Math.min(1, Math.max(0, value / duration));
  const bufPct = buffered !== undefined ? buffered / duration : 0;

  function calc(clientX: number) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return 0;
    const x = (clientX - r.left) / r.width;
    return Math.max(0, Math.min(1, x)) * duration;
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    onSeek(calc(e.clientX));
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    setHover(calc(e.clientX));
    if (dragging) onSeek(calc(e.clientX));
  }
  function onUp(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  useEffect(() => {
    function stop() {
      setDragging(false);
    }
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onPointerUp={onUp}
        className="relative h-10 cursor-pointer select-none group"
      >
        {waveform ? (
          <div className="absolute inset-y-1 inset-x-0 flex items-center gap-px pointer-events-none">
            {waveform.map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${v * 90 + 10}%`,
                  background:
                    i / waveform.length < pct
                      ? "linear-gradient(180deg,#a855f7,#38bdf8)"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <span className="absolute inset-y-[17px] left-0 right-0 rounded-full bg-white/5" />
            {buffered !== undefined ? (
              <span
                className="absolute inset-y-[17px] left-0 rounded-full bg-white/15"
                style={{ width: `${bufPct * 100}%` }}
              />
            ) : null}
            <motion.span
              className="absolute inset-y-[17px] left-0 rounded-full"
              style={{
                width: `${pct * 100}%`,
                background: "linear-gradient(90deg,#a855f7,#38bdf8)",
              }}
            />
          </>
        )}
        {markers?.map((m, i) => (
          <span
            key={i}
            title={m.label}
            className="absolute top-1 bottom-1 w-0.5 rounded-full"
            style={{
              left: `${(m.time / duration) * 100}%`,
              background: m.color ?? "rgba(244, 114, 182, 0.8)",
            }}
          />
        ))}
        <motion.span
          style={{ left: `${pct * 100}%` }}
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg ring-2 ring-fuchsia-400/40"
        />
        {hover !== null ? (
          <div
            className="absolute -top-7 pointer-events-none"
            style={{ left: `${(hover / duration) * 100}%` }}
          >
            <div className="-translate-x-1/2 text-[11px] font-mono text-white bg-[#1c1c26] border border-white/10 px-1.5 py-0.5 rounded-md">
              {fmt(hover)}
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-baseline justify-between text-[11px] text-white/50 font-mono mt-1">
        <span>{fmt(value)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}
