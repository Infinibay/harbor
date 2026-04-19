import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { useAnimationFrame, useCanvasSetup } from "../../lib/useAnimationFrame";
import { useContainerSize } from "../../lib/useContainerSize";
import { DEFAULT_PALETTE, type BackgroundCommonProps } from "./types";

export interface ConstellationsProps extends BackgroundCommonProps {
  /** Nodes per 10 000 px². Default 0.6. */
  density?: number;
  /** Pixel distance below which two nodes are connected by a line. Default 140. */
  maxDistance?: number;
  /** Node radius (px). Default 1.8. */
  nodeSize?: number;
  /** Drift speed (px / s). Default 14. */
  drift?: number;
  /** Line color override. */
  lineColor?: string;
  /** React to the cursor — nodes within `cursorRadius` get highlighted. */
  cursorReactive?: boolean;
  /** Cursor reach (px). Default 160. */
  cursorRadius?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

/** Drifting points with lines between nearby pairs. Optionally glows
 *  toward the cursor. Canvas 2D; complexity is O(n²) per frame so keep
 *  the count reasonable (< 120 nodes recommended). */
export function Constellations({
  density = 0.6,
  maxDistance = 140,
  nodeSize = 1.8,
  drift = 14,
  lineColor,
  cursorReactive = true,
  cursorRadius = 160,
  speed = 1,
  intensity = 0.5,
  palette = DEFAULT_PALETTE,
  paused,
  respectReducedMotion,
  pauseWhenHidden,
  pauseWhenOutOfView,
  className,
  style,
}: ConstellationsProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useContainerSize(wrapRef);
  const { ref: canvasRef, resize } = useCanvasSetup<HTMLCanvasElement>();
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const nodes = useRef<Node[]>([]);
  const seededFor = useRef({ w: 0, h: 0 });
  const cursor = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (width === 0 || height === 0) return;
    if (seededFor.current.w === width && seededFor.current.h === height) return;
    seededFor.current = { w: width, h: height };
    const count = Math.round(((width * height) / 10_000) * density);
    const next: Node[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const s = drift * (0.3 + Math.random() * 0.7);
      next.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }
    nodes.current = next;
    resize(width, height);
  }, [width, height, density, drift, palette, resize]);

  // Track cursor (opt-in).
  useEffect(() => {
    if (!cursorReactive) return;
    const el = wrapRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      cursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onLeave() {
      cursor.current = null;
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [cursorReactive]);

  const { register } = useAnimationFrame(
    (dt) => {
      const c = canvasElRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const dtSec = dt / 1000;
      const ns = nodes.current;
      // Update + draw nodes.
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        n.x += n.vx * speed * dtSec;
        n.y += n.vy * speed * dtSec;
        if (n.x < 0) n.x += width;
        else if (n.x > width) n.x -= width;
        if (n.y < 0) n.y += height;
        else if (n.y > height) n.y -= height;
      }
      // Draw lines.
      const maxD2 = maxDistance * maxDistance;
      const cursorD2 = cursorRadius * cursorRadius;
      const cur = cursor.current;
      const lc = lineColor ?? "rgba(168,85,247,1)";
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i];
          const b = ns[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const alpha = (1 - d2 / maxD2) * (0.15 + intensity * 0.4);
            ctx.strokeStyle = lc;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // Draw nodes.
      for (const n of ns) {
        let boost = 0;
        if (cur) {
          const dx = n.x - cur.x;
          const dy = n.y - cur.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < cursorD2) boost = 1 - d2 / cursorD2;
        }
        ctx.fillStyle = n.color;
        ctx.globalAlpha = Math.min(1, 0.6 + intensity * 0.4 + boost);
        const r = nodeSize + boost * 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    {
      enabled: !paused,
      respectReducedMotion,
      pauseWhenHidden,
      pauseWhenOutOfView,
    },
  );

  const setWrap = (el: HTMLDivElement | null) => {
    wrapRef.current = el;
    register(el);
  };
  const setCanvas = (el: HTMLCanvasElement | null) => {
    canvasElRef.current = el;
    canvasRef(el);
  };

  return (
    <div
      aria-hidden
      ref={setWrap}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={style}
    >
      <canvas ref={setCanvas} />
    </div>
  );
}
