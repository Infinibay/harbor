import { DiffViewer } from "./DiffViewer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleOld = `vm:
  cpu: 2
  ram: 4
  status: paused
  network:
    - eth0
`;

const sampleNew = `vm:
  cpu: 4
  ram: 8
  status: running
  network:
    - eth0
    - eth1
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DiffViewerDemo(props: any) {
  return (
    <div style={{ width: "100%" }}>
      <DiffViewer
        {...props}
        oldText={props.oldText ?? sampleOld}
        newText={props.newText ?? sampleNew}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: DiffViewerDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    mode: { type: "select", options: ["unified", "split"], default: "unified" },
    oldLabel: { type: "text", default: "old" },
    newLabel: { type: "text", default: "new" },
  },
  variants: [
    { label: "Unified", props: { mode: "unified" } },
    { label: "Split", props: { mode: "split" } },
    { label: "Versioned labels", props: { mode: "split", oldLabel: "v1.4.2", newLabel: "v1.5.0" } },
  ],
};
