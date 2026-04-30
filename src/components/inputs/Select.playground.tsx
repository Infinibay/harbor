import { useState } from "react";
import { Select } from "./Select";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const options = [
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "eu-west", label: "EU West (Ireland)" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SelectDemo(props: any) {
  const [value, setValue] = useState(props.defaultValue ?? "us-east");
  return (
    <div className="w-72">
      <Select
        {...props}
        options={options}
        value={value}
        onChange={(v: string) => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SelectDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Region" },
    placeholder: { type: "text", default: "Pick a region" },
    size: { type: "select", options: ["sm", "md"], default: "md" },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Compact", props: { size: "sm" } },
    { label: "Disabled", props: { disabled: true } },
  ],
  events: [{ name: "onChange", signature: "(v: string) => void" }],
};
