import { Constellations, type ConstellationsProps } from "./Constellations";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function ConstellationsDemo(props: ConstellationsProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 400,
        overflow: "hidden",
        borderRadius: 12,
        background: "#0a0a14",
      }}
    >
      <Constellations {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ConstellationsDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    density: { type: "number", default: 0.6, min: 0.05, max: 3 },
    maxDistance: { type: "number", default: 140, min: 20, max: 400 },
    nodeSize: { type: "number", default: 1.8, min: 0.5, max: 8 },
    drift: { type: "number", default: 14, min: 0, max: 80 },
    cursorReactive: { type: "boolean", default: true },
    cursorRadius: { type: "number", default: 160, min: 0, max: 400 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Dense web", props: { density: 1.4, maxDistance: 180 } },
    { label: "Sparse", props: { density: 0.25, maxDistance: 220 } },
  ],
};
