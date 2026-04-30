import { UsageRing } from "./UsageRing";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: UsageRing as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    value: { type: "number", default: 1840, min: 0 },
    max: { type: "number", default: 5000, min: 1 },
    name: { type: "text", default: "CPU hours" },
  },
  variants: [
    { label: "Comfortable", props: { value: 1840, max: 5000, name: "CPU hours" } },
    { label: "Near cap", props: { value: 4500, max: 5000 } },
    { label: "Over budget", props: { value: 5400, max: 5000 } },
  ],
};
