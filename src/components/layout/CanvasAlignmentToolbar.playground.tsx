import { useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasAlignmentToolbar } from "./CanvasAlignmentToolbar";
import { CanvasSelectionBox } from "./CanvasSelectionBox";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const INITIAL: Node[] = [
  { id: "a", x: 60, y: 60, width: 120, height: 80, color: "#a855f7" },
  { id: "b", x: 240, y: 130, width: 110, height: 70, color: "#38bdf8" },
  { id: "c", x: 420, y: 80, width: 130, height: 90, color: "#f472b6" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasAlignmentToolbarDemo(props: any) {
  const [nodes, setNodes] = useState<Node[]>(INITIAL);
  const ids = nodes.map((n) => n.id);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas
        grid="dots"
        overlay={
          <>
            <CanvasSelectionBox ids={ids} items={nodes} />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-auto">
              <CanvasAlignmentToolbar
                ids={ids}
                items={nodes}
                onChange={(positions) => {
                  setNodes((prev) =>
                    prev.map((n) => {
                      const p = positions.get(n.id);
                      return p ? { ...n, x: p.x, y: p.y } : n;
                    }),
                  );
                }}
                {...props}
              />
            </div>
          </>
        }
      >
        {nodes.map((n) => (
          <CanvasItem key={n.id} id={n.id} x={n.x} y={n.y}>
            <div
              style={{ width: n.width, height: n.height, background: n.color }}
              className="rounded-lg shadow-lg grid place-items-center text-white text-sm font-medium"
            >
              {n.id.toUpperCase()}
            </div>
          </CanvasItem>
        ))}
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasAlignmentToolbarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    showLabels: { type: "boolean", default: false, description: "Render labels next to icons." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "With labels", props: { showLabels: true } },
  ],
  events: [],
  notes:
    "All three blocks are 'selected' for demo purposes — click an alignment button to snap them.",
};
