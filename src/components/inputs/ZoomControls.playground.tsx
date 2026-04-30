import { useState } from "react";
import { ZoomControls } from "./ZoomControls";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ZoomControlsDemo(props: any) {
  const [value, setValue] = useState<number>(
    typeof props.value === "number" ? props.value : 100,
  );
  return (
    <ZoomControls
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
  component: ZoomControlsDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    min: { type: "number", default: 10, min: 1, max: 100, step: 5 },
    max: { type: "number", default: 400, min: 100, max: 1000, step: 50 },
    step: { type: "number", default: 10, min: 1, max: 50, step: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "With Fit", props: { onFit: () => {} } },
  ],
  events: [
    { name: "onChange", signature: "(v: number) => void" },
    { name: "onFit", signature: "() => void", description: "Fires when the user clicks the fit-to-screen entry." },
  ],
  notes:
    "Values are percentages (e.g. 100 = 100%), not multipliers. Hover the percentage to reveal the preset menu.",
};
