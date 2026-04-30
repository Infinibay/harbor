import { SegmentedControl } from "./SegmentedControl";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SegmentedControlDemo(props: any) {
  return <SegmentedControl {...props} items={items} />;
}

export const playground: PlaygroundManifest = {
  component: SegmentedControlDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    size: { type: "select", options: ["sm", "md"], default: "md" },
    defaultValue: { type: "select", options: ["day", "week", "month", "year"], default: "week" },
  },
  variants: [
    { label: "Small", props: { size: "sm" } },
    { label: "Medium", props: { size: "md" } },
  ],
  events: [
    { name: "onChange", signature: "(v: string) => void" },
  ],
};
