import { ClusterView, type ClusterHost } from "./ClusterView";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const hosts: ClusterHost[] = [
  { id: "h1", name: "vm-prod-01", status: "online", subtitle: "10.0.4.11 · ubuntu 24.04", region: "eu-west", tags: ["api"], cpu: 0.42, ram: { used: 6, total: 16, unit: "GiB" }, disk: { used: 84, total: 256, unit: "GiB" } },
  { id: "h2", name: "vm-prod-02", status: "online", subtitle: "10.0.4.12 · ubuntu 24.04", region: "eu-west", tags: ["api"], cpu: 0.71, ram: { used: 11, total: 16, unit: "GiB" }, disk: { used: 102, total: 256, unit: "GiB" } },
  { id: "h3", name: "vm-prod-03", status: "degraded", subtitle: "10.0.4.13 · alma 9", region: "eu-west", tags: ["worker"], cpu: 0.93, ram: { used: 14, total: 16, unit: "GiB" }, disk: { used: 220, total: 256, unit: "GiB" } },
  { id: "h4", name: "vm-stage-01", status: "online", subtitle: "10.0.4.21 · ubuntu 24.04", region: "us-east", tags: ["api", "test"], cpu: 0.18, ram: { used: 3, total: 8, unit: "GiB" }, disk: { used: 28, total: 128, unit: "GiB" } },
  { id: "h5", name: "vm-stage-02", status: "offline", subtitle: "10.0.4.22 · ubuntu 24.04", region: "us-east", tags: ["worker"] },
  { id: "h6", name: "vm-edge-01", status: "provisioning", subtitle: "10.0.4.31 · ubuntu 24.04", region: "ap-south", tags: ["edge"] },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClusterViewDemo(props: any) {
  return (
    <ClusterView
      {...props}
      hosts={hosts}
      onHostClick={(h) => props.onHostClick?.(h.id)}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ClusterViewDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    minCardWidth: { type: "number", default: 280, min: 180, max: 480, step: 10 },
  },
  events: [
    { name: "onHostClick", signature: "(host: ClusterHost) => void", description: "The demo passes only the host id for brevity." },
  ],
};
