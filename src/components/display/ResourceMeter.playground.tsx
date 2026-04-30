import { ResourceMeter } from "./ResourceMeter";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const resources = [
  { label: "CPU", value: 42, detail: "1.7 / 4 cores" },
  { label: "Memory", value: 68, detail: "5.4 / 8 GB" },
  { label: "Disk", value: 92, detail: "184 / 200 GB", threshold: [70, 90] as [number, number] },
  { label: "Network", value: 12, detail: "12 Mbps" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResourceMeterDemo(props: any) {
  return <div className="w-96"><ResourceMeter {...props} resources={resources} /></div>;
}

export const playground: PlaygroundManifest = {
  component: ResourceMeterDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    layout: { type: "select", options: ["rows", "compact"], default: "rows" },
  },
  variants: [
    { label: "Rows", props: { layout: "rows" } },
    { label: "Compact", props: { layout: "compact" } },
  ],
};
