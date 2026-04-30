import { ResourceForecast } from "./ResourceForecast";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const now = Date.now();
const sampleSeries = [
  {
    id: "disk",
    label: "Disk used (GB)",
    data: Array.from({ length: 30 }, (_, i) => ({
      t: now - (30 - i) * 3600_000,
      v: 40 + i * 1.6 + Math.random() * 2,
    })),
  },
];

function ResourceForecastDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 280 }}>
      <ResourceForecast {...props} series={props.series ?? sampleSeries} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ResourceForecastDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    quota: { type: "number", default: 100 },
    steps: { type: "number", default: 24 },
    windowSize: { type: "number", default: 10 },
    height: { type: "number", default: 240 },
  },
  variants: [
    { label: "Default forecast", props: { quota: 100, steps: 24 } },
    { label: "Long horizon", props: { quota: 100, steps: 60 } },
    { label: "No quota", props: { steps: 24 } },
  ],
};
