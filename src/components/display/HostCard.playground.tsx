import { HostCard } from "./HostCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HostCardDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <HostCard
        {...props}
        ram={{ used: props.ramUsed ?? 6, total: props.ramTotal ?? 16, unit: "GiB" }}
        disk={{ used: props.diskUsed ?? 84, total: props.diskTotal ?? 256, unit: "GiB" }}
        tags={(props.tagsCsv ?? "api,eu-west").split(",").map((s: string) => s.trim()).filter(Boolean)}
        onClick={() => props.onClick?.()}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: HostCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    name: { type: "text", default: "vm-prod-01" },
    subtitle: { type: "text", default: "10.0.4.11 · ubuntu 24.04" },
    status: { type: "select", options: ["online", "degraded", "offline", "provisioning"], default: "online" },
    cpu: { type: "number", default: 42, min: 0, max: 100 },
    ramUsed: { type: "number", default: 6, min: 0, max: 256 },
    ramTotal: { type: "number", default: 16, min: 1, max: 1024 },
    diskUsed: { type: "number", default: 84, min: 0, max: 2048 },
    diskTotal: { type: "number", default: 256, min: 1, max: 8192 },
    tagsCsv: { type: "text", default: "api, eu-west", description: "Comma-separated tag chips." },
  },
  variants: [
    { label: "Online", props: { status: "online" } },
    { label: "Degraded", props: { status: "degraded", cpu: 93 } },
    { label: "Offline", props: { status: "offline" } },
    { label: "Provisioning", props: { status: "provisioning" } },
  ],
  events: [{ name: "onClick", signature: "() => void" }],
};
