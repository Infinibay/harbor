import { useState } from "react";
import { Slider } from "./Slider";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SliderDemo(props: any) {
  const [value, setValue] = useState(Number(props.defaultValue ?? 50));
  return (
    <div className="w-full max-w-md">
      <Slider
        {...props}
        value={value}
        onChange={(v: number) => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SliderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Volume" },
    min: { type: "number", default: 0 },
    max: { type: "number", default: 100 },
    step: { type: "number", default: 1, min: 1 },
    defaultValue: { type: "number", default: 50 },
    showValue: { type: "boolean", default: true },
  },
  variants: [
    { label: "0–100", props: { min: 0, max: 100, defaultValue: 50 } },
    { label: "Stepped", props: { min: 0, max: 10, step: 1, defaultValue: 4 } },
    { label: "No value", props: { showValue: false } },
  ],
  events: [{ name: "onChange", signature: "(v: number) => void" }],
};
