import { Badge } from "./Badge";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Badge as never,
  importPath: "@infinibay/harbor/display",
  defaultChildren: "Beta",
  controls: {
    tone: { type: "select", options: ["neutral", "info", "success", "warning", "danger", "purple"], default: "neutral" },
    pulse: { type: "boolean", default: false },
  },
  variants: [
    { label: "Neutral", props: { tone: "neutral" } },
    { label: "Info", props: { tone: "info" } },
    { label: "Success", props: { tone: "success" } },
    { label: "Warning", props: { tone: "warning" } },
    { label: "Danger", props: { tone: "danger" } },
    { label: "Pulsing", props: { tone: "success", pulse: true } },
  ],
};
