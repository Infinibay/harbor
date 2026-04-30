import { QuotaBar } from "./QuotaBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const segments = [
  { label: "frontend", value: 3.4, tone: "used" as const },
  { label: "backend", value: 2.8, tone: "reserved" as const },
  { label: "data", value: 2.1, tone: "info" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuotaBarDemo(props: any) {
  return <div className="w-96"><QuotaBar {...props} segments={segments} /></div>;
}

export const playground: PlaygroundManifest = {
  component: QuotaBarDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    total: { type: "number", default: 16, min: 1, max: 1000, description: "Total quota (any unit)." },
    soft: { type: "number", default: 0.7, min: 0, max: 1, step: 0.05 },
    hard: { type: "number", default: 1, min: 0, max: 1, step: 0.05 },
    height: { type: "number", default: 14, min: 8, max: 32 },
    label: { type: "text", default: "" },
  },
  variants: [
    { label: "Default", props: { total: 16 } },
    { label: "Tighter quota", props: { total: 10 } },
    { label: "No soft limit", props: { soft: undefined } },
  ],
};
