import { Canvas, CanvasItem } from "./Canvas";
import { CanvasZoomControls } from "./CanvasZoomControls";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasZoomControlsDemo(props: any) {
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas grid="dots" overlay={<CanvasZoomControls {...props} />}>
        <CanvasItem x={120} y={140} draggable>
          <div className="px-4 py-3 rounded-lg bg-fuchsia-500/25 border border-fuchsia-300/40 text-sm">
            Node A
          </div>
        </CanvasItem>
        <CanvasItem x={420} y={260} draggable>
          <div className="px-4 py-3 rounded-lg bg-sky-500/25 border border-sky-300/40 text-sm">
            Node B
          </div>
        </CanvasItem>
        <CanvasItem x={260} y={380} draggable>
          <div className="px-4 py-3 rounded-lg bg-emerald-500/25 border border-emerald-300/40 text-sm">
            Node C
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasZoomControlsDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    position: {
      type: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      default: "bottom-right",
    },
    floating: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Top-right", props: { position: "top-right" } },
  ],
  events: [],
  notes: "Pan/zoom the canvas, then click Fit to frame every node, or 1:1 to reset.",
};
