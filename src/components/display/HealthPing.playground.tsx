import { HealthPing } from "./HealthPing";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: HealthPing as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    tone: { type: "select", options: ["success", "warn", "danger", "info", "neutral"], default: "success" },
    size: { type: "number", default: 8, min: 4, max: 24 },
    rings: { type: "select", options: ["1", "2"], default: "1" },
    speed: { type: "number", default: 1.6, min: 0.5, max: 5, step: 0.1 },
  },
  variants: [
    { label: "Healthy", props: { tone: "success" } },
    { label: "Warn", props: { tone: "warn" } },
    { label: "Down", props: { tone: "danger", rings: 2 } },
  ],
};
