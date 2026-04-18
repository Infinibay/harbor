import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { cn } from "../../lib/cn";

export interface SignaturePadProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  onChange?: (dataUrl: string | null) => void;
  className?: string;
}

export function SignaturePad({
  width = 480,
  height = 180,
  color = "#fff",
  strokeWidth = 2,
  onChange,
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [empty, setEmpty] = useState(true);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio ?? 1;
    c.width = width * dpr;
    c.height = height * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
  }, [width, height, color, strokeWidth]);

  function pos(e: RPointerEvent<HTMLCanvasElement>) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onDown(e: RPointerEvent<HTMLCanvasElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrawing(true);
    lastRef.current = pos(e);
  }

  function onMove(e: RPointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastRef.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    setEmpty(false);
  }

  function onUp() {
    setDrawing(false);
    lastRef.current = null;
    onChange?.(canvasRef.current?.toDataURL("image/png") ?? null);
  }

  function clear() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange?.(null);
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden",
        className,
      )}
      style={{ width }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className="block cursor-crosshair touch-none"
        style={{ width, height }}
      />
      {empty ? (
        <div className="absolute inset-0 pointer-events-none grid place-items-center text-white/30 text-sm">
          Sign here
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-between border-t border-white/8 bg-black/20">
        <span className="text-[11px] text-white/40">Pointer to sign</span>
        <button
          onClick={clear}
          className="text-xs text-white/70 hover:text-white px-2 py-0.5 rounded hover:bg-white/5"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
