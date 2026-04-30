import { Canvas, CanvasItem } from "./Canvas";
import { CanvasMinimap } from "./CanvasMinimap";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const NODES = [
  { id: "a", x: 80, y: 60, hue: 280 },
  { id: "b", x: 320, y: 140, hue: 200 },
  { id: "c", x: 540, y: 80, hue: 150 },
  { id: "d", x: 200, y: 320, hue: 30 },
  { id: "e", x: 520, y: 360, hue: 340 },
  { id: "f", x: 760, y: 260, hue: 220 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasMinimapDemo(props: any) {
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas grid="dots" overlay={<CanvasMinimap {...props} />}>
        {NODES.map((n) => (
          <CanvasItem key={n.id} id={n.id} x={n.x} y={n.y} draggable>
            <div
              style={{
                background: `hsl(${n.hue} 80% 55% / 0.3)`,
                border: `1px solid hsl(${n.hue} 80% 70% / 0.55)`,
              }}
              className="px-4 py-3 rounded-lg text-sm w-32"
            >
              Node {n.id}
            </div>
          </CanvasItem>
        ))}
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasMinimapDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    size: { type: "number", min: 120, max: 360, step: 10, default: 200 },
    padding: { type: "number", min: 0, max: 240, step: 10, default: 80 },
    position: {
      type: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      default: "bottom-right",
    },
    floating: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Top-left, large", props: { position: "top-left", size: 280 } },
    { label: "Tight padding", props: { padding: 10 } },
  ],
  events: [],
  notes: "Click or drag inside the minimap to pan the main canvas. Drag the nodes to see the minimap update live.",
};
