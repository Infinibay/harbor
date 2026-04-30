import { Canvas, CanvasItem } from "./Canvas";
import { CanvasPanel } from "./CanvasPanel";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasPanelDemo(props: any) {
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas
        overlay={
          <CanvasPanel {...props}>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">Width</span>
                <span className="tabular-nums">320</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Height</span>
                <span className="tabular-nums">200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Opacity</span>
                <span className="tabular-nums">100%</span>
              </div>
            </div>
          </CanvasPanel>
        }
      >
        <CanvasItem x={200} y={200}>
          <div className="px-4 py-3 rounded-xl bg-fuchsia-500/25 border border-fuchsia-300/40 text-sm">
            Selected node
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasPanelDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    title: { type: "text", default: "Inspector" },
    width: { type: "number", min: 160, max: 480, step: 10, default: 260 },
    defaultCollapsed: { type: "boolean", default: false },
    closable: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: { title: "Inspector" } },
    { label: "Collapsed", props: { title: "Layers", defaultCollapsed: true } },
    { label: "Closable", props: { title: "History", closable: true } },
  ],
  events: [],
  notes: "The panel lives in the Canvas overlay slot, so pan/zoom don't move it. Drag the header to reposition.",
};
