import { Progress } from "./Progress";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProgressDemo(props: any) {
  return <div className="w-80"><Progress {...props} /></div>;
}

export const playground: PlaygroundManifest = {
  component: ProgressDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    value: { type: "number", default: 60, min: 0, max: 100 },
    max: { type: "number", default: 100, min: 1, max: 1000 },
    label: { type: "text", default: "Uploading" },
    showValue: { type: "boolean", default: true },
    tone: { type: "select", options: ["purple", "green", "amber", "rose", "sky"], default: "purple" },
    shimmer: { type: "boolean", default: false },
    indeterminate: { type: "boolean", default: false },
  },
  variants: [
    { label: "30%", props: { value: 30 } },
    { label: "Indeterminate", props: { indeterminate: true } },
    { label: "Shimmer", props: { value: 60, shimmer: true } },
    { label: "Green", props: { value: 80, tone: "green" } },
  ],
};
