import { Canvas, CanvasItem } from "./Canvas";
import { CanvasConnection } from "./CanvasConnection";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const NODES = [
  { id: "src", x: 60, y: 80, w: 140, h: 70, label: "Source" },
  { id: "transform", x: 320, y: 200, w: 160, h: 70, label: "Transform" },
  { id: "sink", x: 580, y: 80, w: 140, h: 70, label: "Sink" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasConnectionDemo(props: any) {
  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas grid="dots">
        {NODES.map((n) => (
          <CanvasItem key={n.id} id={n.id} x={n.x} y={n.y}>
            <div
              style={{ width: n.w, height: n.h }}
              className="rounded-lg bg-[#1a1a24] border border-white/10 grid place-items-center text-sm text-white shadow-lg"
            >
              {n.label}
            </div>
          </CanvasItem>
        ))}
        <CanvasConnection
          from={{ x: NODES[0].x + NODES[0].w, y: NODES[0].y + NODES[0].h / 2 }}
          to={{ x: NODES[1].x, y: NODES[1].y + NODES[1].h / 2 }}
          label="emit"
          {...props}
        />
        <CanvasConnection
          from={{ x: NODES[1].x + NODES[1].w, y: NODES[1].y + NODES[1].h / 2 }}
          to={{ x: NODES[2].x, y: NODES[2].y + NODES[2].h / 2 }}
          {...props}
        />
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasConnectionDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    curve: { type: "select", options: ["bezier", "straight", "orthogonal", "smart"], default: "bezier" },
    color: { type: "text", default: "rgba(168,85,247,0.85)" },
    thickness: { type: "number", default: 2, min: 1, max: 8, step: 1 },
    animated: { type: "boolean", default: false, description: "Dashed flow animation." },
    arrow: { type: "boolean", default: true },
  },
  variants: [
    { label: "Bezier", props: { curve: "bezier" } },
    { label: "Straight", props: { curve: "straight" } },
    { label: "Orthogonal", props: { curve: "orthogonal" } },
    { label: "Animated", props: { curve: "bezier", animated: true } },
  ],
  events: [],
  notes: "Two connections wire Source → Transform → Sink. Pan the canvas with space-drag to confirm the lines ride the world transform.",
};
