import { Sparkline } from "./Sparkline";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleData = [
  12, 14, 13, 18, 22, 19, 24, 28, 26, 31, 29, 35, 38, 36, 42, 47,
];

function SparklineDemo(props: any) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 80,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sparkline {...props} data={props.data ?? sampleData} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SparklineDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    width: { type: "number", default: 120 },
    height: { type: "number", default: 32 },
    stroke: { type: "text", default: "#a855f7" },
    fill: { type: "text", default: "rgba(168,85,247,0.15)" },
    showDot: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    {
      label: "Sky",
      props: {
        stroke: "#38bdf8",
        fill: "rgba(56,189,248,0.18)",
      },
    },
    {
      label: "Rose, no dot",
      props: {
        stroke: "#f43f5e",
        fill: "rgba(244,63,94,0.18)",
        showDot: false,
      },
    },
    { label: "Wide", props: { width: 240, height: 48 } },
  ],
};
