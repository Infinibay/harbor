import { RackDiagram } from "./RackDiagram";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const hosts = [
  { u: 1, name: "switch-01", status: "online" as const, subtitle: "tor" },
  { u: 3, name: "node-01", status: "online" as const, height: 2, subtitle: "compute" },
  { u: 6, name: "node-02", status: "degraded" as const, height: 2, subtitle: "compute" },
  { u: 9, name: "node-03", status: "online" as const, height: 2 },
  { u: 14, name: "storage-01", status: "online" as const, height: 4, subtitle: "ceph osd" },
  { u: 20, name: "gpu-01", status: "provisioning" as const, height: 3, subtitle: "a100 ×4" },
  { u: 24, name: "spare", status: "offline" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RackDiagramDemo(props: any) {
  return <RackDiagram {...props} hosts={hosts} />;
}

export const playground: PlaygroundManifest = {
  component: RackDiagramDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    name: { type: "text", default: "rack-a1" },
    units: { type: "number", default: 24, min: 8, max: 48 },
    unitHeight: { type: "number", default: 14, min: 8, max: 28 },
    bottomUp: { type: "boolean", default: true },
  },
  variants: [
    { label: "Bottom-up · 24U", props: { units: 24, bottomUp: true } },
    { label: "Top-down", props: { units: 24, bottomUp: false } },
    { label: "Tall · 42U", props: { units: 42, unitHeight: 12 } },
  ],
  events: [
    { name: "onHostClick", signature: "(host: RackHost) => void" },
  ],
};
