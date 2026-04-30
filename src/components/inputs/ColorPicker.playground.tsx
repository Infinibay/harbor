import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ColorPickerDemo(props: any) {
  const [value, setValue] = useState<string>(props.value ?? "#a855f7");
  return (
    <ColorPicker
      {...props}
      value={value}
      onChange={(hex) => {
        setValue(hex);
        props.onChange?.(hex);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ColorPickerDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    value: { type: "text", default: "#a855f7", description: "Initial hex." },
  },
  variants: [
    { label: "Default", props: { value: "#a855f7" } },
    { label: "Brand teal", props: { value: "#38bdf8" } },
  ],
  events: [{ name: "onChange", signature: "(hex: string) => void" }],
  notes: "Drag the SV pad and the hue track. Click a swatch or paste a hex into the input.",
};
