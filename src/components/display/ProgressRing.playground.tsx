import { ProgressRing } from "./ProgressRing";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ProgressRing as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    value: { type: "number", default: 64, min: 0, max: 100 },
    max: { type: "number", default: 100, min: 1, max: 1000 },
    size: { type: "number", default: 80, min: 32, max: 200, step: 8 },
    stroke: { type: "number", default: 6, min: 2, max: 16 },
    tone: { type: "select", options: ["purple", "green", "amber", "rose"], default: "purple" },
  },
  variants: [
    { label: "30%", props: { value: 30 } },
    { label: "75% green", props: { value: 75, tone: "green" } },
    { label: "Almost full", props: { value: 96, tone: "amber" } },
    { label: "Large", props: { value: 50, size: 160 } },
  ],
};
