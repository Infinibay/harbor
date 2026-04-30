import { MacScape, type MacScapeProps } from "./MacScape";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function MacScapeDemo(props: MacScapeProps) {
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
      <MacScape {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MacScapeDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    layers: { type: "number", default: 4, min: 1, max: 8 },
    blur: { type: "number", default: 6, min: 0, max: 40 },
    resolution: { type: "number", default: 48, min: 8, max: 200 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Sharp", props: { blur: 0, layers: 5 } },
    { label: "Dreamy", props: { blur: 20, layers: 6, intensity: 0.7 } },
  ],
};
