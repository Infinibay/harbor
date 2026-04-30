import { Spinner } from "./Spinner";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Spinner as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    size: { type: "number", default: 24, min: 8, max: 64, step: 2 },
  },
  variants: [
    { label: "Small", props: { size: 16 } },
    { label: "Default", props: { size: 24 } },
    { label: "Large", props: { size: 48 } },
  ],
};
