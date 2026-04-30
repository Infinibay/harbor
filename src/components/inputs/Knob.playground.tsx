import { useState } from "react";
import { Knob } from "./Knob";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KnobDemo(props: any) {
  const [value, setValue] = useState<number>(props.defaultValue ?? 50);
  return (
    <Knob
      {...props}
      value={value}
      onChange={(v: number) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: KnobDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Gain" },
    unit: { type: "text", default: "dB" },
    min: { type: "number", default: -24 },
    max: { type: "number", default: 24 },
    step: { type: "number", default: 1 },
    size: { type: "number", default: 54, min: 32, max: 160 },
    arc: { type: "number", default: 270, min: 90, max: 360 },
    defaultValue: { type: "number", default: 0 },
  },
  variants: [
    { label: "Default", props: { label: "Gain", unit: "dB", min: -24, max: 24, defaultValue: 0 } },
    { label: "Large", props: { label: "Mix", size: 96, min: 0, max: 100, defaultValue: 50 } },
    { label: "Half-arc", props: { label: "Pan", arc: 180, min: -50, max: 50, defaultValue: 0 } },
  ],
  events: [{ name: "onChange", signature: "(v: number) => void" }],
  notes:
    "Drag vertically to change. Shift = fine adjust. Double-click resets to defaultValue.",
};
