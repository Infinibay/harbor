import { useState } from "react";
import { DatePicker } from "./DatePicker";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DatePickerDemo(props: any) {
  const [value, setValue] = useState<Date | undefined>(props.value);
  return (
    <DatePicker
      {...props}
      value={value}
      onChange={(d) => {
        setValue(d);
        props.onChange?.(d);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: DatePickerDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Renewal date" },
    placeholder: { type: "text", default: "Pick a date" },
  },
  variants: [
    { label: "Empty", props: {} },
    { label: "Pre-selected", props: { value: new Date() } },
    { label: "No label", props: { label: "" } },
  ],
  events: [{ name: "onChange", signature: "(d: Date) => void" }],
};
