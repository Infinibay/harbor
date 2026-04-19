import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { StatusDot, type Status } from "./StatusDot";

export interface GraphNode {
  id: string;
  label: string;
  status?: Status;
  group?: string;
  /** Static color override. */
  color?: string;
  /** Initial position hint (falls back to circular auto-layout). */
  x?: number;
  y?: number;
  /** Fix this node — physics won't move it. */
  fixed?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  thickness?: number;
  /** Dashed + flowing animation. */
  animated?: boolean;
  color?: string;
  label?: string;
}

export interface NetworkGraphProps {
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  /** Layout algorithm. Default `"force"`. */
  layout?: "force" | "circular" | "hierarchical";
  /** Container height. Default 480. */
  height?: number;
  /** Called on node click. */
  onNodeClick?: (node: GraphNode) => void;
  /** Called on edge click. */
  onEdgeClick?: (edge: GraphEdge) => void;
  /** Overlay slot (absolute positioned, viewport-space). */
  overlay?: ReactNode;
  className?: string;
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
  data: GraphNode;
}

const DAMPING = 0.85;
const REPULSION = 18000;
const SPRING_K = 0.015;
const SPRING_REST = 140;
const GRAVITY = 0.005;

function initialLayout(nodes: readonly GraphNode[], layout: NetworkGraphProps["layout"]): SimNode[] {
  const n = nodes.length;
  const radius = 180 + n * 4;
  return nodes.map((node, i) => {
    if (node.x !== undefined && node.y !== undefined) {
      return { id: node.id, x: node.x, y: node.y, vx: 0, vy: 0, pinned: Boolean(node.fixed), data: node };
    }
    if (layout === "circular") {
      const angle = (i / Math.max(1, n)) * Math.PI * 2;
      return {
        id: node.id,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        pinned: Boolean(node.fixed),
        data: node,
      };
    }
    if (layout === "hierarchical") {
      // Simple grid — callers can pre-position for better results.
      const cols = Math.ceil(Math.sqrt(n));
      return {
        id: node.id,
        x: (i % cols) * 160 - (cols - 1) * 80,
        y: Math.floor(i / cols) * 120 - Math.floor(n / cols) * 60,
        vx: 0,
        vy: 0,
        pinned: Boolean(node.fixed),
        data: node,
      };
    }
    // Force: random scatter around origin.
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 80 + 40;
    return {
      id: node.id,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      vx: 0,
      vy: 0,
      pinned: Boolean(node.fixed),
      data: node,
    };
  });
}

function step(sim: SimNode[], edges: readonly GraphEdge[]) {
  // Repulsion
  for (let i = 0; i < sim.length; i++) {
    for (let j = i + 1; j < sim.length; j++) {
      const a = sim[i];
      const b = sim[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = Math.max(25, dx * dx + dy * dy);
      const d = Math.sqrt(d2);
      const f = REPULSION / d2;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      if (!a.pinned) {
        a.vx -= fx;
        a.vy -= fy;
      }
      if (!b.pinned) {
        b.vx += fx;
        b.vy += fy;
      }
    }
  }
  // Springs
  const byId = new Map(sim.map((n) => [n.id, n]));
  for (const e of edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const f = SPRING_K * (d - SPRING_REST);
    const fx = (dx / d) * f;
    const fy = (dy / d) * f;
    if (!a.pinned) {
      a.vx += fx;
      a.vy += fy;
    }
    if (!b.pinned) {
      b.vx -= fx;
      b.vy -= fy;
    }
  }
  // Gravity + integrate
  let energy = 0;
  for (const n of sim) {
    if (!n.pinned) {
      n.vx -= n.x * GRAVITY;
      n.vy -= n.y * GRAVITY;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
    }
    energy += n.vx * n.vx + n.vy * n.vy;
  }
  return energy;
}

/** Standalone force-directed graph. Renders its own SVG with wheel-zoom
 *  and space-drag pan — no Canvas dependency. Drag a node to pin it;
 *  Shift+drag to release. */
export function NetworkGraph({
  nodes,
  edges,
  layout = "force",
  height = 480,
  onNodeClick,
  onEdgeClick,
  overlay,
  className,
}: NetworkGraphProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<SimNode[]>([]);
  const [, bump] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.7);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  // Seed / re-seed simulation when nodes change identity.
  useEffect(() => {
    simRef.current = initialLayout(nodes, layout);
    bump((n) => n + 1);
  }, [nodes, layout]);

  // Physics loop (only for force layout; others are static).
  useEffect(() => {
    if (layout !== "force") return;
    let raf = 0;
    let ticks = 0;
    const loop = () => {
      const e = step(simRef.current, edges);
      bump((n) => n + 1);
      ticks++;
      if (ticks < 600 && e > 0.05) {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [edges, layout, nodes.length]);

  // Edges with resolved positions
  const positioned = useMemo(() => {
    const sim = simRef.current;
    const byId = new Map(sim.map((n) => [n.id, n]));
    const es = edges.map((e) => ({
      edge: e,
      a: byId.get(e.from),
      b: byId.get(e.to),
    }));
    return { sim, es };
  }, [edges, pan.x, pan.y, zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pan / zoom handlers on the wrapper.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function onDown(e: MouseEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-graph-node]")) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPan = pan;
      function onMove(ev: MouseEvent) {
        setPan({ x: startPan.x + (ev.clientX - startX), y: startPan.y + (ev.clientY - startY) });
      }
      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    function onWheel(e: WheelEvent) {
      if (!el) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.001);
      const newZoom = Math.max(0.2, Math.min(3, zoom * factor));
      // Keep the point under cursor stationary.
      const worldX = (mx - pan.x) / zoom;
      const worldY = (my - pan.y) / zoom;
      setPan({ x: mx - worldX * newZoom, y: my - worldY * newZoom });
      setZoom(newZoom);
    }
    el.addEventListener("mousedown", onDown);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("wheel", onWheel);
    };
  }, [pan, zoom]);

  const startNodeDrag = useCallback(
    (nodeId: string) => (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const sim = simRef.current;
      const idx = sim.findIndex((n) => n.id === nodeId);
      if (idx < 0) return;
      const node = sim[idx];
      const startClientX = e.clientX;
      const startClientY = e.clientY;
      const startNodeX = node.x;
      const startNodeY = node.y;
      const shiftRelease = e.shiftKey && node.pinned;
      if (shiftRelease) {
        node.pinned = false;
        bump((n) => n + 1);
        return;
      }
      node.pinned = true;
      function onMove(ev: MouseEvent) {
        node.x = startNodeX + (ev.clientX - startClientX) / zoom;
        node.y = startNodeY + (ev.clientY - startClientY) / zoom;
        node.vx = 0;
        node.vy = 0;
        bump((n) => n + 1);
      }
      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [zoom],
  );

  return (
    <div
      ref={wrapRef}
      style={{ height, cursor: "grab" }}
      className={cn(
        "relative w-full overflow-hidden select-none rounded-2xl border border-white/10 bg-[#0d0d14]",
        className,
      )}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1.2px)",
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />
      <svg
        width="100%"
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {positioned.es.map((p, i) => {
            if (!p.a || !p.b) return null;
            const color = p.edge.color ?? "rgba(168,85,247,0.55)";
            const highlight = hoverNode && (hoverNode === p.edge.from || hoverNode === p.edge.to);
            return (
              <g key={`e-${i}`}>
                <line
                  x1={p.a.x}
                  y1={p.a.y}
                  x2={p.b.x}
                  y2={p.b.y}
                  stroke={color}
                  strokeWidth={(p.edge.thickness ?? 1.5) + (highlight ? 0.8 : 0)}
                  strokeLinecap="round"
                  strokeDasharray={p.edge.animated ? "6 5" : undefined}
                  opacity={hoverNode && !highlight ? 0.2 : 1}
                  onClick={() => onEdgeClick?.(p.edge)}
                  style={{ cursor: onEdgeClick ? "pointer" : undefined }}
                >
                  {p.edge.animated ? (
                    <animate
                      attributeName="stroke-dashoffset"
                      from={0}
                      to={-11}
                      dur="0.7s"
                      repeatCount="indefinite"
                    />
                  ) : null}
                </line>
                {p.edge.label ? (
                  <text
                    x={(p.a.x + p.b.x) / 2}
                    y={(p.a.y + p.b.y) / 2 - 4}
                    fontSize={10}
                    fill="rgba(255,255,255,0.55)"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                  >
                    {p.edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* Nodes */}
          {positioned.sim.map((n) => {
            const dimmed = hoverNode && hoverNode !== n.id;
            return (
              <g
                key={n.id}
                data-graph-node
                transform={`translate(${n.x} ${n.y})`}
                onMouseEnter={() => setHoverNode(n.id)}
                onMouseLeave={() => setHoverNode(null)}
                onMouseDown={startNodeDrag(n.id)}
                onClick={() => onNodeClick?.(n.data)}
                style={{ cursor: "grab" }}
                opacity={dimmed ? 0.35 : 1}
              >
                <circle
                  r={n.pinned ? 22 : 20}
                  fill={n.data.color ?? "rgba(168,85,247,0.18)"}
                  stroke={n.data.color ?? "rgba(168,85,247,0.7)"}
                  strokeWidth={n.pinned ? 2 : 1.5}
                />
                <text
                  y={36}
                  fontSize={11}
                  fill="rgba(255,255,255,0.85)"
                  textAnchor="middle"
                  fontFamily="ui-sans-serif, system-ui"
                >
                  {n.data.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Status chips — rendered as HTML overlay so they stay crisp + clickable */}
      <div className="absolute inset-0 pointer-events-none">
        {positioned.sim.map((n) => {
          if (!n.data.status) return null;
          const screenX = n.x * zoom + pan.x + 16;
          const screenY = n.y * zoom + pan.y - 26;
          return (
            <span
              key={`s-${n.id}`}
              style={{ position: "absolute", left: screenX, top: screenY }}
            >
              <StatusDot status={n.data.status} size={6} label={null} />
            </span>
          );
        })}
      </div>

      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/40 pointer-events-none">
        drag empty area to pan · wheel to zoom · drag node to pin · shift-drag to release
      </div>

      {overlay ? (
        <div className="absolute inset-0 pointer-events-none">{overlay}</div>
      ) : null}
    </div>
  );
}
