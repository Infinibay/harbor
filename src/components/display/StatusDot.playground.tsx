import { StatusDot } from "./StatusDot";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: StatusDot as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    status: {
      type: "select",
      options: ["online", "degraded", "offline", "provisioning", "maintenance", "unknown"],
      default: "online",
    },
    pulse: { type: "boolean", default: true },
    size: { type: "number", default: 10, min: 6, max: 24 },
    labelOverride: { type: "text", default: "", description: "Replace the auto-derived label." },
  },
  variants: [
    { label: "Online", props: { status: "online" } },
    { label: "Degraded", props: { status: "degraded" } },
    { label: "Offline", props: { status: "offline" } },
    { label: "Provisioning", props: { status: "provisioning" } },
    { label: "Maintenance", props: { status: "maintenance" } },
    { label: "Unknown", props: { status: "unknown" } },
  ],
};
