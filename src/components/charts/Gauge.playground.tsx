import { Gauge } from "./Gauge";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function GaugeDemo(props: any) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 240,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Gauge {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: GaugeDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    value: { type: "number", default: 72 },
    min: { type: "number", default: 0 },
    max: { type: "number", default: 100 },
    label: { type: "text", default: "CPU" },
    unit: { type: "text", default: "%" },
    size: { type: "number", default: 180 },
  },
  variants: [
    { label: "Healthy", props: { value: 32, label: "CPU", unit: "%" } },
    { label: "Warning", props: { value: 72, label: "CPU", unit: "%" } },
    { label: "Critical", props: { value: 94, label: "CPU", unit: "%" } },
    {
      label: "Latency (ms)",
      props: { value: 240, max: 500, label: "p99", unit: "ms" },
    },
  ],
};
