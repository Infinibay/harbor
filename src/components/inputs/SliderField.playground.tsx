import { useState } from "react";
import { SliderField } from "./SliderField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SliderFieldDemo(props: any) {
  const [value, setValue] = useState(props.value ?? 4);
  return (
    <div className="w-full max-w-md">
      <SliderField
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
  component: SliderFieldDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    min: { type: "number", default: 1 },
    max: { type: "number", default: 16 },
    step: { type: "number", default: 1, min: 1 },
    unit: { type: "text", default: "vCPU" },
    tone: { type: "select", options: ["sky", "green", "purple", "amber", "rose", "neutral"], default: "purple" },
  },
  variants: [
    { label: "vCPU", props: { unit: "vCPU", min: 1, max: 16, tone: "sky" } },
    { label: "Memory", props: { unit: "GB", min: 1, max: 64, tone: "purple" } },
    { label: "Warning tone", props: { tone: "amber" } },
  ],
  events: [{ name: "onChange", signature: "(v: number) => void" }],
};
