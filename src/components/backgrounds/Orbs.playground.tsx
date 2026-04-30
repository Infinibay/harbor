import { Orbs, type OrbsProps } from "./Orbs";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function OrbsDemo(props: OrbsProps) {
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
      <Orbs {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: OrbsDemo as never,
  importPath: "@infinibay/harbor/backgrounds",
  controls: {
    count: { type: "number", default: 7, min: 1, max: 30 },
    glow: { type: "number", default: 40, min: 0, max: 120 },
    blend: {
      type: "select",
      options: ["screen", "plus-lighter", "lighten", "overlay", "normal"],
      default: "screen",
    },
    speed: { type: "number", default: 1, min: 0, max: 3 },
    intensity: { type: "number", default: 0.5, min: 0, max: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Lots, small", props: { count: 20, glow: 25 } },
    { label: "Few, huge", props: { count: 3, glow: 90 } },
  ],
};
