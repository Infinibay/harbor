import { useState } from "react";
import { Calendar } from "./Calendar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CalendarDemo(props: any) {
  const [value, setValue] = useState<Date | undefined>(props.value);
  return (
    <Calendar
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
  component: CalendarDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  variants: [
    { label: "Empty", props: {} },
    { label: "Pre-selected (today)", props: { value: new Date() } },
  ],
  events: [{ name: "onChange", signature: "(d: Date) => void" }],
  notes: "Click ‹ / › to flip months. Selection ring animates between days via Framer Motion's layoutId.",
};
