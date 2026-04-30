import { Canvas, CanvasItem } from "./Canvas";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasDemo(props: any) {
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas {...props}>
        <CanvasItem x={80} y={80} draggable>
          <div className="px-4 py-3 rounded-xl bg-fuchsia-500/25 border border-fuchsia-300/40 text-sm">
            Drag me · world (80, 80)
          </div>
        </CanvasItem>
        <CanvasItem x={360} y={180} draggable>
          <div className="px-4 py-3 rounded-xl bg-sky-500/25 border border-sky-300/40 text-sm">
            Drag me · world (360, 180)
          </div>
        </CanvasItem>
        <CanvasItem x={200} y={320} draggable>
          <div className="px-4 py-3 rounded-xl bg-emerald-500/25 border border-emerald-300/40 text-sm">
            Drag me · world (200, 320)
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    grid: { type: "select", options: ["dots", "lines", "false"], default: "dots" },
    gridSize: { type: "number", min: 8, max: 128, step: 4, default: 32 },
    pan: { type: "select", options: ["both", "space", "middle", "always"], default: "both" },
    wheelZoom: { type: "boolean", default: true },
    minZoom: { type: "number", min: 0.05, max: 1, step: 0.05, default: 0.1 },
    maxZoom: { type: "number", min: 1, max: 16, step: 0.5, default: 8 },
  },
  variants: [
    { label: "Default · dots", props: {} },
    { label: "Lines grid", props: { grid: "lines" } },
    { label: "No grid", props: { grid: false } },
    { label: "Pan anywhere", props: { pan: "always" } },
  ],
  events: [],
  notes:
    "Pan with space+drag or middle-click; zoom with the wheel. Drag the colored boxes to move them in world space.",
};
