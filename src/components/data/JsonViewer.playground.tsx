import { JsonViewer } from "./JsonViewer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleData = {
  vm: {
    id: "vm-prod-01",
    cpu: 4,
    ram: 16,
    status: "running",
    network: ["eth0", "eth1"],
    tags: { env: "prod", owner: "ada" },
  },
  meta: {
    createdAt: "2026-04-22T10:11:12Z",
    deletedAt: null,
    pinned: true,
  },
  events: [
    { id: 1, kind: "boot", at: "2026-04-22T10:11:12Z" },
    { id: 2, kind: "snapshot", at: "2026-04-29T03:00:00Z" },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JsonViewerDemo(props: any) {
  return (
    <div style={{ width: "100%" }}>
      <JsonViewer {...props} data={props.data ?? sampleData} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: JsonViewerDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    rootLabel: { type: "text", default: "$" },
    defaultExpanded: { type: "number", default: 2, min: 0, max: 8, step: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Collapsed", props: { defaultExpanded: 0 } },
    { label: "Fully expanded", props: { defaultExpanded: 8 } },
    { label: "Custom root", props: { rootLabel: "response" } },
  ],
};
