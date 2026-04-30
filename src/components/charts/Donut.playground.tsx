import { Donut } from "./Donut";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleSlices = [
  { id: "vm", label: "VMs", value: 42 },
  { id: "db", label: "Database", value: 18 },
  { id: "cache", label: "Cache", value: 8 },
  { id: "queue", label: "Queue", value: 4 },
];

function DonutDemo(props: any) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 280,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Donut {...props} slices={props.slices ?? sampleSlices} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: DonutDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    size: { type: "number", default: 180 },
    thickness: { type: "number", default: 18 },
    centerLabel: { type: "text", default: "usage" },
    centerValue: { type: "text", default: "72" },
  },
  variants: [
    { label: "Default", props: { centerLabel: "usage", centerValue: "72" } },
    {
      label: "Thick ring",
      props: { thickness: 28, size: 200, centerLabel: "share", centerValue: "100%" },
    },
    {
      label: "Thin ring",
      props: { thickness: 10, size: 160, centerLabel: "split", centerValue: "—" },
    },
  ],
};
