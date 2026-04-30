import { useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const PALETTE = ["#a855f7", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#94a3b8"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ColorSwatchDemo(props: any) {
  const [value, setValue] = useState<string>(props.value ?? PALETTE[0]);
  return (
    <ColorSwatch
      {...props}
      colors={props.colors ?? PALETTE}
      value={value}
      onChange={(c) => {
        setValue(c);
        props.onChange?.(c);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ColorSwatchDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Accent" },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "No label", props: { label: "" } },
  ],
  events: [{ name: "onChange", signature: "(c: string) => void" }],
};
