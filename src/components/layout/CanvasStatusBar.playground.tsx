import { Canvas, CanvasItem } from "./Canvas";
import { CanvasStatusBar } from "./CanvasStatusBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasStatusBarDemo(props: any) {
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas
        grid="dots"
        overlay={
          <CanvasStatusBar
            {...props}
            left={
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                3 selected
              </span>
            }
            right={<span className="text-white/50">v1 · saved 2s ago</span>}
          />
        }
      >
        <CanvasItem x={140} y={120} draggable>
          <div className="px-4 py-3 rounded-lg bg-fuchsia-500/25 border border-fuchsia-300/40 text-sm">
            Pan / zoom me
          </div>
        </CanvasItem>
        <CanvasItem x={420} y={260} draggable>
          <div className="px-4 py-3 rounded-lg bg-sky-500/25 border border-sky-300/40 text-sm">
            Watch the bar
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasStatusBarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    showCoords: { type: "boolean", default: true },
    showZoom: { type: "boolean", default: true },
    floating: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Zoom only", props: { showCoords: false } },
    { label: "Coords only", props: { showZoom: false } },
  ],
  events: [],
  notes: "The left and right slots are filled in the demo with a selection indicator and a save status.",
};
