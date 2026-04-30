import { Bubbles, type BubblesProps } from "./Bubbles";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function BubblesDemo(props: BubblesProps) {
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
      <Bubbles {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BubblesDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    count: { type: "number", default: 10, min: 1, max: 40 },
    drift: { type: "number", default: 36, min: 0, max: 200 },
    gooeyness: { type: "number", default: 18, min: 1, max: 40 },
    mergeRadius: { type: "number", default: 14, min: 1, max: 40 },
    gradient: { type: "boolean", default: false },
    backdrop: { type: "color", default: "#0a0a14" },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Many small", props: { count: 25, drift: 60 } },
    { label: "Gradient", props: { gradient: true, count: 8 } },
    { label: "Loose (low gooeyness)", props: { gooeyness: 6 } },
  ],
};
