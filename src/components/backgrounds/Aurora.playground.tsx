import { Aurora, type AuroraProps } from "./Aurora";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function AuroraDemo(props: AuroraProps) {
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
      <Aurora {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: AuroraDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    bands: { type: "number", default: 3, min: 1, max: 8 },
    amplitude: { type: "number", default: 0.22, min: 0, max: 0.5 },
    resolution: { type: "number", default: 64, min: 8, max: 256 },
    bandPhase: { type: "number", default: 0.9, min: 0, max: 6.28 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
    paused: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Calm", props: { bands: 2, amplitude: 0.12, speed: 0.4, intensity: 0.35 } },
    { label: "Loud", props: { bands: 5, amplitude: 0.32, intensity: 0.85 } },
  ],
};
