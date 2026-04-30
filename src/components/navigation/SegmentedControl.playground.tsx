import { SegmentedControl } from "./SegmentedControl";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const items = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
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
