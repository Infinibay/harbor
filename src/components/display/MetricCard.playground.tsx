import { MetricCard } from "./MetricCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const series = [4, 6, 5, 8, 7, 9, 8, 11, 10, 13, 12, 15];

export const playground: PlaygroundManifest = {
  component: MetricCard as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    label: { type: "text", default: "Active deploys" },
    value: { type: "text", default: "128" },
    unit: { type: "text", default: "" },
    delta: { type: "number", default: 12, description: "Percent vs prior period." },
  },
  variants: [
    { label: "Up", props: { value: "128", delta: 12 } },
    { label: "Down", props: { label: "Errors", value: "24", delta: -33 } },
    { label: "With unit", props: { label: "Latency", value: "84", unit: "ms" } },
    { label: "With sparkline", props: { value: "128", series } as never },
  ],
  notes: "Pass `series: number[]` to render a sparkline.",
};
