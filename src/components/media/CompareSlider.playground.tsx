import { CompareSlider } from "./CompareSlider";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: CompareSlider as never,
  importPath: "@infinibay/harbor/media",
  controls: {
    before: { type: "text", default: "https://images.unsplash.com/photo-1495805442109-bf1cf975750b?w=1200" },
    after: { type: "text", default: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200" },
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
