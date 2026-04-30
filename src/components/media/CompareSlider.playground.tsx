import { CompareSlider } from "./CompareSlider";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: CompareSlider as never,
  importPath: "@infinibay/harbor/media",
  controls: {
    before: { type: "text", default: "/picture.png" },
    after: { type: "text", default: "/picture.png" },
    beforeLabel: { type: "text", default: "Before" },
    afterLabel: { type: "text", default: "After" },
    defaultValue: { type: "number", default: 50, min: 0, max: 100, step: 5 },
  },
  variants: [
    { label: "50/50", props: { defaultValue: 50 } },
    { label: "30/70", props: { defaultValue: 30 } },
    { label: "Edge case · 0", props: { defaultValue: 0 } },
  ],
  notes: "Drag the divider to compare. Works with any two same-aspect images.",
};
