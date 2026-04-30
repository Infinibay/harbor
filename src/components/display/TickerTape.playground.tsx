import { TickerTape } from "./TickerTape";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const SAMPLE_ITEMS = [
  { id: "mrr", label: "MRR", value: "$12,540", change: 2.1 },
  { id: "vms", label: "VMs", value: 128, change: 0 },
  { id: "p95", label: "p95", value: "184ms", change: -3.4 },
  { id: "errs", label: "Errors", value: 24, change: -33 },
  { id: "cpu", label: "CPU", value: "62%", change: 1.2 },
  { id: "mem", label: "Memory", value: "48%", change: 0.4 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TickerTapeDemo(props: any) {
  return <TickerTape {...props} items={SAMPLE_ITEMS} />;
}

export const playground: PlaygroundManifest = {
  component: TickerTapeDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    speed: { type: "number", default: 40, min: 5, max: 120, step: 5, description: "Seconds per full loop." },
    gap: { type: "number", default: 28, min: 8, max: 80, step: 4 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Fast", props: { speed: 15 } },
    { label: "Wide gap", props: { gap: 64 } },
  ],
  notes: "Items are hardcoded in the demo; the real component takes any TickerItem[].",
};
