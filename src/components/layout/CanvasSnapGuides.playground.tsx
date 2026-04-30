import { Canvas, CanvasItem } from "./Canvas";
import { CanvasSnapGuides } from "./CanvasSnapGuides";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasSnapGuidesDemo(props: any) {
  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas
        grid="dots"
        snap={{ threshold: 8, edges: true }}
        overlay={<CanvasSnapGuides {...props} />}
      >
        <CanvasItem id="anchor1" x={120} y={120} draggable>
          <div className="w-32 h-24 rounded-lg bg-fuchsia-500/40 border border-fuchsia-300/40 grid place-items-center text-white text-sm">
            Drag me
          </div>
        </CanvasItem>
        <CanvasItem id="anchor2" x={360} y={220} draggable>
          <div className="w-40 h-28 rounded-lg bg-sky-500/40 border border-sky-300/40 grid place-items-center text-white text-sm">
            Or me
          </div>
        </CanvasItem>
        <CanvasItem id="anchor3" x={560} y={120} draggable>
          <div className="w-28 h-28 rounded-lg bg-amber-500/40 border border-amber-300/40 grid place-items-center text-white text-sm">
            Me too
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasSnapGuidesDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    color: { type: "text", default: "rgb(236 72 153)", description: "Stroke color for the guide lines." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Cyan guides", props: { color: "rgb(34 211 238)" } },
  ],
  events: [],
  notes:
    "Drag the blocks near each other's edges/centers — pink dashed guides flash when alignment snaps.",
};
