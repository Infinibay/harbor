import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { cn } from "../../lib/cn";

export interface CompareSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  defaultValue?: number;
  className?: string;
}

export function CompareSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  defaultValue = 50,
  className,
}: CompareSliderProps) {
  const [pct, setPct] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  function update(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setPct(x * 100);
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    update(e.clientX);
  }

  return (
    <div
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={(e) => dragging && update(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={cn(
        "relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 select-none cursor-col-resize",
        className,
      )}
    >
      <img src={before} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <img
          src={after}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          style={{ width: ref.current?.clientWidth ?? "100%", maxWidth: "none" }}
        />
      </div>

      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-medium text-white/85">
        {beforeLabel}
      </span>
      <span
        className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[11px] font-medium text-white/85"
        style={{ opacity: pct > 50 ? 1 : 0.4 }}
      >
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-0.5 bg-white pointer-events-none"
        style={{ left: `${pct}%`, boxShadow: "0 0 24px rgba(255,255,255,0.35)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-black grid place-items-center text-xs font-bold shadow-lg">
          ⇆
        </div>
      </div>
    </div>
  );
}
