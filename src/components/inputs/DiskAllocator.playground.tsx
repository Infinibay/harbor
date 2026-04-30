import { useState } from "react";
import { DiskAllocator, type DiskAllocation } from "./DiskAllocator";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const GB = 1024 ** 3;
const TB = 1024 ** 4;

const INITIAL: DiskAllocation[] = [
  { id: "os", label: "OS", size: 64 * GB, tone: "used" },
  { id: "data", label: "Data", size: 800 * GB, tone: "reserved" },
  { id: "snap", label: "Backup", size: 128 * GB, tone: "backup" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DiskAllocatorDemo(props: any) {
  const [allocs, setAllocs] = useState<DiskAllocation[]>(INITIAL);
  return (
    <DiskAllocator
      {...props}
      total={props.total ?? 2 * TB}
      allocations={allocs}
      onChange={(next) => {
        setAllocs(next);
        props.onChange?.(next);
      }}
      header={<span className="text-sm font-medium text-white/85">Volume layout</span>}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: DiskAllocatorDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    height: { type: "number", default: 32, min: 16, max: 80, step: 2 },
  },
  variants: [
    { label: "Default (2 TB)", props: {} },
    { label: "Tall bar", props: { height: 56 } },
  ],
  events: [{ name: "onChange", signature: "(allocations: DiskAllocation[]) => void" }],
  notes: "Drag across the free area to reserve a new chunk. Hover a slab to reveal its delete button.",
};
