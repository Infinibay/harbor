import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { CopyButton } from "../buttons/CopyButton";

export interface ColorPickerProps {
  value?: string;
  onChange?: (hex: string) => void;
  swatches?: string[];
  className?: string;
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hexToHsv(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return { h: 260, s: 1, v: 1 };
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

export function ColorPicker({
  value = "#a855f7",
  onChange,
  swatches = [
    "#a855f7",
    "#38bdf8",
    "#f472b6",
    "#34d399",
    "#fbbf24",
    "#fb7185",
    "#94a3b8",
    "#ffffff",
    "#000000",
  ],
  className,
}: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const saturationRef = useRef<HTMLDivElement | null>(null);
  const hueRef = useRef<HTMLDivElement | null>(null);
  const [draggingSv, setDraggingSv] = useState(false);
  const [draggingHue, setDraggingHue] = useState(false);

  useEffect(() => {
    setHsv((prev) => {
      const next = hexToHsv(value);
      return next.h === prev.h && next.s === prev.s && next.v === prev.v
        ? prev
        : next;
    });
  }, [value]);

  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  function emit(next: typeof hsv) {
    setHsv(next);
    const c = hsvToRgb(next.h, next.s, next.v);
    onChange?.(rgbToHex(c.r, c.g, c.b));
  }

  function onSvDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingSv(true);
    updateSv(e.clientX, e.clientY);
  }
  function updateSv(cx: number, cy: number) {
    const r = saturationRef.current?.getBoundingClientRect();
    if (!r) return;
    const s = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    const v = 1 - Math.max(0, Math.min(1, (cy - r.top) / r.height));
    emit({ ...hsv, s, v });
  }

  function onHueDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingHue(true);
    updateHue(e.clientX);
  }
  function updateHue(cx: number) {
    const r = hueRef.current?.getBoundingClientRect();
    if (!r) return;
    const h = Math.max(0, Math.min(1, (cx - r.left) / r.width)) * 360;
    emit({ ...hsv, h });
  }

  useEffect(() => {
    function stop() {
      setDraggingSv(false);
      setDraggingHue(false);
    }
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  return (
    <div
      className={cn(
        "w-64 p-3 rounded-2xl bg-[#14141c] border border-white/10 space-y-3",
        className,
      )}
    >
      <div
        ref={saturationRef}
        onPointerDown={onSvDown}
        onPointerMove={(e) => draggingSv && updateSv(e.clientX, e.clientY)}
        className="relative h-40 rounded-lg overflow-hidden cursor-crosshair select-none"
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))
          `,
        }}
      >
        <motion.span
          animate={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none"
          style={{ translate: "-50% -50%", background: hex }}
        />
      </div>
      <div
        ref={hueRef}
        onPointerDown={onHueDown}
        onPointerMove={(e) => draggingHue && updateHue(e.clientX)}
        className="relative h-3 rounded-full cursor-pointer select-none"
        style={{
          background:
            "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
      >
        <motion.span
          animate={{ left: `${(hsv.h / 360) * 100}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none"
          style={{ translate: "-50% -50%", background: `hsl(${hsv.h},100%,50%)` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md border border-white/10"
          style={{ background: hex }}
        />
        <input
          value={hex}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#?[0-9a-f]{6}$/i.test(v.replace(/^#/, "")))
              emit(hexToHsv(v.startsWith("#") ? v : "#" + v));
          }}
          className="flex-1 px-2 py-1.5 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-white outline-none focus:border-fuchsia-400/60"
        />
        <CopyButton size="sm" value={hex} />
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-white/50">
        <Channel label="R" value={rgb.r} />
        <Channel label="G" value={rgb.g} />
        <Channel label="B" value={rgb.b} />
      </div>
      {swatches?.length ? (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
            Swatches
          </div>
          <div className="grid grid-cols-9 gap-1">
            {swatches.map((c) => (
              <button
                key={c}
                onClick={() => emit(hexToHsv(c))}
                className={cn(
                  "w-full aspect-square rounded-md border border-white/10 hover:scale-110 transition-transform",
                  hex.toLowerCase() === c.toLowerCase() && "ring-2 ring-white",
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Channel({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
      <span>{label}</span>
      <span className="font-mono text-white ml-auto">{value}</span>
    </div>
  );
}
