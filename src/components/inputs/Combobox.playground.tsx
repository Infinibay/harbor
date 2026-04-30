import { useState } from "react";
import { Combobox } from "./Combobox";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const OPTIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)", keywords: ["virginia", "iad"] },
  { value: "us-west-2", label: "US West (Oregon)", keywords: ["oregon", "pdx"] },
  { value: "eu-central-1", label: "EU (Frankfurt)", keywords: ["fra", "germany"] },
  { value: "eu-west-1", label: "EU (Ireland)", keywords: ["dub", "ireland"] },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)", keywords: ["nrt", "japan"] },
  { value: "sa-east-1", label: "South America (São Paulo)", keywords: ["gru", "brazil"] },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ComboboxDemo(props: any) {
  const [value, setValue] = useState<string | undefined>(props.value);
  return (
    <Combobox
      {...props}
      options={props.options ?? OPTIONS}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ComboboxDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Region" },
    placeholder: { type: "text", default: "Select or search…" },
    emptyText: { type: "text", default: "No matches" },
  },
  variants: [
    { label: "Empty", props: {} },
    { label: "Pre-selected", props: { value: "eu-central-1" } },
  ],
  events: [{ name: "onChange", signature: "(v: string) => void" }],
};
