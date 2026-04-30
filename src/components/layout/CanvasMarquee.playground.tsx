import { useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasMarquee } from "./CanvasMarquee";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const NODES = [
  { id: "a", x: 60, y: 60, width: 100, height: 80, color: "#a855f7" },
  { id: "b", x: 220, y: 100, width: 100, height: 80, color: "#38bdf8" },
  { id: "c", x: 380, y: 60, width: 100, height: 80, color: "#f472b6" },
  { id: "d", x: 140, y: 240, width: 100, height: 80, color: "#facc15" },
  { id: "e", x: 320, y: 260, width: 100, height: 80, color: "#34d399" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasMarqueeDemo(props: any) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas grid="dots">
        {NODES.map((n) => {
          const isSel = selected.includes(n.id);
          return (
            <CanvasItem key={n.id} id={n.id} x={n.x} y={n.y}>
              <div
                style={{
                  width: n.width,
                  height: n.height,
                  background: n.color,
                  outline: isSel ? "2px solid #fff" : "none",
                  outlineOffset: 2,
                }}
                className="rounded-lg shadow-lg grid place-items-center text-white text-sm font-medium"
              >
                {n.id.toUpperCase()}
              </div>
            </CanvasItem>
          );
        })}
        <CanvasMarquee
          items={NODES}
          onSelectionDrag={setSelected}
          onSelection={setSelected}
          {...props}
        />
      </Canvas>
      <div className="absolute top-3 left-3 px-2 py-1 text-[11px] rounded-md bg-black/60 text-white/80 border border-white/10">
        Selected: {selected.length ? selected.join(", ") : "—"}
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasMarqueeDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    modifier: { type: "select", options: ["none", "shift", "alt", "ctrl"], default: "none" },
    enabled: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Shift to marquee", props: { modifier: "shift" } },
  ],
  events: [],
  notes: "Drag on empty canvas to lasso blocks. The selection set updates live and persists on release.",
};
