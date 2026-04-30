import { CountUp } from "./CountUp";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: CountUp as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    value: { type: "number", default: 12_540, min: 0 },
    duration: { type: "number", default: 1200, min: 200, max: 5000, step: 100 },
    prefix: { type: "text", default: "" },
    suffix: { type: "text", default: "" },
  },
  variants: [
    { label: "Counter", props: { value: 12540 } },
    { label: "Currency", props: { value: 12540, prefix: "$" } },
    { label: "Percent", props: { value: 99.4, suffix: "%" } },
    { label: "Slow", props: { value: 5000, duration: 3000 } },
  ],
  notes: "Animates from 0 to `value` once on mount. Re-renders restart the animation only when `value` changes.",
};
