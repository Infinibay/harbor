import { BarChart } from "./BarChart";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleBars = [
  { id: "us-east", label: "US East", value: 412 },
  { id: "us-west", label: "US West", value: 287 },
  { id: "eu", label: "EU", value: 198, color: "#38bdf8" },
  { id: "apac", label: "APAC", value: 96, color: "#34d399" },
  { id: "sa", label: "SA", value: 54, color: "#fbbf24" },
];

function BarChartDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 240 }}>
      <BarChart {...props} bars={props.bars ?? sampleBars} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BarChartDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    orientation: {
      type: "select",
      options: ["vertical", "horizontal"],
      default: "vertical",
    },
    height: { type: "number", default: 220 },
  },
  variants: [
    { label: "Vertical", props: { orientation: "vertical" } },
    { label: "Horizontal", props: { orientation: "horizontal" } },
    {
      label: "Formatted (req/s)",
      props: {
        orientation: "vertical",
        formatValue: (v: number) => `${v} req/s`,
      },
    },
  ],
};
