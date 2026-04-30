import { Stat } from "./Stat";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Stat as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    label: { type: "text", default: "Active deploys" },
    value: { type: "number", default: 128 },
    prefix: { type: "text", default: "" },
    suffix: { type: "text", default: "" },
    change: { type: "number", default: 12, description: "Percent delta vs prior period (0 = no chip)." },
    variant: { type: "select", options: ["bordered", "plain"], default: "bordered" },
  },
  variants: [
    { label: "Trending up", props: { value: 128, change: 12 } },
    { label: "Trending down", props: { label: "Errors", value: 24, change: -33 } },
    { label: "With prefix", props: { label: "Revenue", value: 12_540, prefix: "$" } },
    { label: "Plain", props: { variant: "plain" } },
  ],
};
