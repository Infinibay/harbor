import { SignaturePad } from "./SignaturePad";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: SignaturePad as never,
  importPath: "@infinibay/harbor/media",
  controls: {
    width: { type: "number", default: 480, min: 200, max: 800, step: 20 },
    height: { type: "number", default: 180, min: 100, max: 400, step: 20 },
    color: { type: "color", default: "#ffffff" },
    strokeWidth: { type: "number", default: 2, min: 1, max: 8 },
  },
  events: [
    { name: "onChange", signature: "(dataUrl: string | null) => void", description: "Fires on every stroke; null when cleared." },
  ],
};
