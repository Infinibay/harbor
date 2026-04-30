import { Canvas, CanvasItem } from "./Canvas";
import { CanvasRuler } from "./CanvasRuler";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasRulerDemo(props: any) {
  const thickness = Number(props.thickness ?? 22);
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas
        grid="dots"
        overlay={
          <>
            <CanvasRuler orientation="horizontal" {...props} />
            <CanvasRuler orientation="vertical" {...props} />
          </>
        }
      >
        <CanvasItem x={thickness + 40} y={thickness + 40} draggable>
          <div className="px-4 py-3 rounded-lg bg-fuchsia-500/25 border border-fuchsia-300/40 text-sm">
            Drag · pan · zoom
          </div>
        </CanvasItem>
        <CanvasItem x={thickness + 320} y={thickness + 220} draggable>
          <div className="px-4 py-3 rounded-lg bg-sky-500/25 border border-sky-300/40 text-sm">
            Watch the ruler scale
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasRulerDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    thickness: { type: "number", min: 14, max: 40, step: 1, default: 22 },
    targetTickSpacing: { type: "number", min: 50, max: 200, step: 10, default: 100 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tight ticks", props: { targetTickSpacing: 60 } },
    { label: "Thick rail", props: { thickness: 32 } },
  ],
  events: [],
  notes: "Demo renders both orientations together — the typical design-tool layout.",
};
