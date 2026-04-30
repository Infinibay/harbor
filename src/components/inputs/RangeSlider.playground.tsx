import { useState } from "react";
import { RangeSlider } from "./RangeSlider";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RangeSliderDemo(props: any) {
  const [value, setValue] = useState<[number, number]>(props.defaultValue ?? [25, 75]);
  return (
    <div className="w-full max-w-md">
      <RangeSlider
        {...props}
        value={value}
        onChange={(v: [number, number]) => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: RangeSliderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Price range" },
    min: { type: "number", default: 0 },
    max: { type: "number", default: 100 },
    step: { type: "number", default: 1, min: 1 },
    showValue: { type: "boolean", default: true },
  },
  events: [{ name: "onChange", signature: "(v: [number, number]) => void" }],
};
