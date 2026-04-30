import { MeshGradient, type MeshGradientProps } from "./MeshGradient";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function MeshGradientDemo(props: MeshGradientProps) {
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
      <MeshGradient {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MeshGradientDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    blobs: { type: "number", default: 4, min: 1, max: 12 },
    blobSize: { type: "number", default: 0.7, min: 0.1, max: 1.5 },
    blur: { type: "number", default: 80, min: 0, max: 200 },
    drift: { type: "number", default: 0.08, min: 0, max: 0.5 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tight", props: { blobs: 6, blobSize: 0.4, blur: 50 } },
    { label: "Hazy", props: { blobs: 3, blobSize: 1.0, blur: 140 } },
  ],
};
