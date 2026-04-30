import { TimeSeriesChart, TimeSeriesMarker } from "./TimeSeriesChart";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const now = Date.now();
const seriesAt = (offset: number) =>
  Array.from({ length: 40 }, (_, i) => ({
    t: now - (40 - i) * 60_000,
    v: 50 + offset + Math.sin(i / 4) * 12 + Math.random() * 4,
  }));

const sampleSeries = [
  { id: "cpu", label: "CPU %", data: seriesAt(0) },
  { id: "mem", label: "Mem %", data: seriesAt(20) },
];

function TimeSeriesChartDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 280 }}>
      <TimeSeriesChart {...props} series={props.series ?? sampleSeries}>
        <TimeSeriesMarker
          at={now - 10 * 60_000}
          label="deploy"
          color="#f43f5e"
        />
      </TimeSeriesChart>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: TimeSeriesChartDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    height: { type: "number", default: 240 },
    yTicks: { type: "number", default: 4 },
    area: { type: "boolean", default: true },
    stacked: { type: "boolean", default: false },
    brushEnabled: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Stacked", props: { stacked: true, area: true } },
    { label: "Lines only", props: { area: false } },
    { label: "No brush", props: { brushEnabled: false } },
  ],
};
