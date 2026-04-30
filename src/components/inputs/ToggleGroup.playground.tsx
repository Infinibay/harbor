import { useState } from "react";
import { ToggleGroup } from "./ToggleGroup";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const items = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToggleGroupDemo(props: any) {
  const [value, setValue] = useState<string | string[]>(
    props.defaultValue ?? (props.multiple ? ["left"] : "left"),
  );
  return (
    <ToggleGroup
      {...props}
      items={items}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ToggleGroupDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    multiple: { type: "boolean", default: false, description: "Allow multiple selections." },
    size: { type: "select", options: ["sm", "md"], default: "md" },
  },
  variants: [
    { label: "Single", props: { multiple: false } },
    { label: "Multiple", props: { multiple: true } },
    { label: "Compact", props: { size: "sm" } },
  ],
  events: [{ name: "onChange", signature: "(v: string | string[]) => void" }],
};
