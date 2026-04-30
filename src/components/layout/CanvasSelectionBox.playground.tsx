import { useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
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
  { id: "a", x: 80, y: 80, width: 140, height: 90, color: "#a855f7" },
  { id: "b", x: 280, y: 180, width: 140, height: 90, color: "#38bdf8" },
  { id: "c", x: 480, y: 90, width: 140, height: 90, color: "#f472b6" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasSelectionBoxDemo(props: any) {
  const [nodes, setNodes] = useState<Node[]>(INITIAL);
  const [selected] = useState<string[]>(["a", "b"]);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas
        grid="dots"
        overlay={
          <CanvasSelectionBox
            ids={selected}
            items={nodes}
            onMove={(d, phase) => {
              if (phase !== "drag") return;
              setNodes((prev) =>
                prev.map((n) =>
                  selected.includes(n.id) ? { ...n, x: n.x + d.dx, y: n.y + d.dy } : n,
                ),
              );
            }}
            {...props}
          />
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
  component: CanvasSelectionBoxDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    showHandles: { type: "boolean", default: false, description: "Force handles even with multi-selection." },
    padding: { type: "number", default: 0, min: 0, max: 32, step: 2 },
  },
  variants: [
    { label: "Multi-select", props: {} },
    { label: "Padded", props: { padding: 12 } },
    { label: "Handles forced", props: { showHandles: true } },
  ],
  events: [],
  notes:
    "Two of three blocks ('A' and 'B') are pre-selected. Drag the box body to translate the group — the box follows pan/zoom automatically.",
};
