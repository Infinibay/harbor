import { useState } from "react";
import { Canvas } from "./Canvas";
import { CanvasBrush, type BrushStroke } from "./CanvasBrush";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasBrushDemo(props: any) {
  const [strokes, setStrokes] = useState<BrushStroke[]>([]);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas grid="dots" cursor="crosshair">
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              stroke={s.color}
              strokeWidth={s.thickness}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
        <CanvasBrush
          {...props}
          onStroke={(s) => setStrokes((prev) => [...prev, s])}
        />
      </Canvas>
      <button
        onClick={() => setStrokes([])}
        className="absolute top-3 right-3 px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10"
      >
        Clear
      </button>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasBrushDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    enabled: { type: "boolean", default: true },
    color: { type: "color", default: "#f0abfc" },
    thickness: { type: "number", default: 3, min: 1, max: 24, step: 1 },
    smoothing: { type: "number", default: 0.5, min: 0, max: 1, step: 0.1, description: "0 = angular, 1 = max smoothing." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Thick magenta", props: { thickness: 8, color: "#f472b6" } },
    { label: "Angular", props: { smoothing: 0 } },
  ],
  events: [],
  notes: "Hold and drag on the canvas to draw. Pan/zoom is disabled here so the cursor is always drawing.",
};
