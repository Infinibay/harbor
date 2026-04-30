import { SnapshotTimeline } from "./SnapshotTimeline";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const GB = 1_000_000_000;

const snapshots = [
  { id: "1", at: now - 14 * day, size: 2.4 * GB, kind: "auto" as const },
  { id: "2", at: now - 10 * day, size: 2.5 * GB, kind: "auto" as const },
  { id: "3", at: now - 7 * day,  size: 2.6 * GB, kind: "manual" as const, label: "before upgrade" },
  { id: "4", at: now - 4 * day,  size: 2.8 * GB, kind: "auto" as const },
  { id: "5", at: now - 2 * day,  size: 3.0 * GB, kind: "pre-migration" as const, locked: true, label: "pre-migrate" },
  { id: "6", at: now - 6 * 60 * 60 * 1000, size: 3.1 * GB, kind: "manual" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SnapshotTimelineDemo(props: any) {
  return (
    <div className="w-[640px]">
      <SnapshotTimeline
        {...props}
        snapshots={snapshots}
        onSelect={(s) => console.log("select", s.id)}
        onRestore={(s) => console.log("restore", s.id)}
        onDelete={(s) => console.log("delete", s.id)}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SnapshotTimelineDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    dense: { type: "boolean", default: false, description: "Force the density-bar layout." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Dense", props: { dense: true } },
  ],
  events: [
    { name: "onSelect", signature: "(snap: Snapshot) => void" },
    { name: "onRestore", signature: "(snap: Snapshot) => void" },
    { name: "onDelete", signature: "(snap: Snapshot) => void" },
  ],
};
