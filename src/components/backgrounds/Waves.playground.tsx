import { Waves, type WavesProps } from "./Waves";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function WavesDemo(props: WavesProps) {
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
      <Waves {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: WavesDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    count: { type: "number", default: 4, min: 1, max: 10 },
    amplitude: { type: "number", default: 0.1, min: 0, max: 0.5 },
    frequency: { type: "number", default: 2.2, min: 0.5, max: 8 },
    resolution: { type: "number", default: 80, min: 8, max: 256 },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Gentle", props: { amplitude: 0.05, frequency: 1.4, count: 3 } },
    { label: "Choppy", props: { amplitude: 0.18, frequency: 4, count: 6 } },
  ],
};
