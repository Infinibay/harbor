import { LineChart } from "./LineChart";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleSeries = [
  { id: "p50", label: "p50", data: [42, 38, 51, 47, 49, 55, 60] },
  { id: "p99", label: "p99", data: [180, 165, 210, 220, 195, 240, 255] },
];

const sampleLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function LineChartDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 280 }}>
      <LineChart
        {...props}
        series={props.series ?? sampleSeries}
        labels={props.labels ?? sampleLabels}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: LineChartDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    height: { type: "number", default: 220 },
    yTicks: { type: "number", default: 4 },
    area: { type: "boolean", default: true },
  },
  variants: [
    { label: "Area on", props: { area: true } },
    { label: "Area off", props: { area: false } },
    {
      label: "ms formatter",
      props: { formatY: (v: number) => `${v}ms` },
    },
  ],
};
