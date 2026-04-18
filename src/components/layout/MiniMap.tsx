import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { cn } from "../../lib/cn";

export interface MiniMapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  color?: string;
}

export interface MiniMapProps {
  world: { w: number; h: number };
  viewport: MiniMapRect;
  items?: MiniMapRect[];
  onNavigate?: (x: number, y: number) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function MiniMap({
  world,
  viewport,
  items,
  onNavigate,
  width = 180,
  height = 120,
  className,
}: MiniMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const scaleX = width / world.w;
  const scaleY = height / world.h;

  function emit(clientX: number, clientY: number) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (clientX - r.left) / scaleX - viewport.w / 2;
    const y = (clientY - r.top) / scaleY - viewport.h / 2;
    onNavigate?.(
      Math.max(0, Math.min(world.w - viewport.w, x)),
      Math.max(0, Math.min(world.h - viewport.h, y)),
    );
  }

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    emit(e.clientX, e.clientY);
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (dragging) emit(e.clientX, e.clientY);
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
    <div
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      style={{ width, height }}
      className={cn(
        "relative rounded-lg bg-black/40 border border-white/10 overflow-hidden cursor-crosshair",
        className,
      )}
    >
      {items?.map((it, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: it.x * scaleX,
            top: it.y * scaleY,
            width: Math.max(2, it.w * scaleX),
            height: Math.max(2, it.h * scaleY),
            background: it.color ?? "rgba(168, 85, 247, 0.4)",
            borderRadius: 2,
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          left: viewport.x * scaleX,
          top: viewport.y * scaleY,
          width: viewport.w * scaleX,
          height: viewport.h * scaleY,
          border: "1.5px solid rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          pointerEvents: "none",
          boxShadow: "0 0 0 2px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}
