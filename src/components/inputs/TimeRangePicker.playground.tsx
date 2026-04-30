import { useState } from "react";
import {
  TimeRangePicker,
  type TimeRangeValue,
  type AbsoluteRange,
} from "./TimeRangePicker";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimeRangePickerDemo(props: any) {
  const [value, setValue] = useState<TimeRangeValue>({ preset: "24h" });
  return (
    <TimeRangePicker
      {...props}
      value={value}
      onChange={(v: TimeRangeValue, compare?: AbsoluteRange) => {
        setValue(v);
        props.onChange?.(v, compare);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: TimeRangePickerDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  events: [
    { name: "onChange", signature: "(v: TimeRangeValue, compare?: AbsoluteRange) => void" },
  ],
  notes:
    "Pick from preset chips (15m, 1h, 6h, 24h, 7d, 30d) or open the custom range popover. Shift-click a preset to also emit a previous-period compare range.",
};
