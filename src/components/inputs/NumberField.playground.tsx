import { useState } from "react";
import { NumberField } from "./NumberField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NumberFieldDemo(props: any) {
  const [value, setValue] = useState(Number(props.defaultValue ?? 0));
  return (
    <NumberField
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
  component: NumberFieldDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Quantity" },
    unit: { type: "text", default: "" },
    min: { type: "number", default: 0 },
    max: { type: "number", default: 999 },
    step: { type: "number", default: 1, min: 1 },
    defaultValue: { type: "number", default: 0 },
  },
  variants: [
    { label: "Plain", props: { label: "Quantity" } },
    { label: "With unit", props: { label: "Memory", unit: "GB", defaultValue: 8 } },
    { label: "Stepped", props: { step: 5, defaultValue: 10 } },
  ],
  events: [{ name: "onChange", signature: "(v: number) => void" }],
};
