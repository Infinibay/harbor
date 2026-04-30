import { Textarea } from "./Textarea";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Textarea as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Description" },
    placeholder: { type: "text", default: "Tell us what this is about…" },
    maxChars: { type: "number", default: 280, min: 0, max: 5000 },
    rows: { type: "number", default: 4, min: 2, max: 12 },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "With char counter", props: { maxChars: 280 } },
    { label: "Tall", props: { rows: 8 } },
  ],
};
