import { useState } from "react";
import { Radio, RadioGroup } from "./Radio";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioDemo(props: any) {
  const [value, setValue] = useState<string>("small");
  return (
    <RadioGroup
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
      orientation={props.orientation ?? "vertical"}
      className="w-72"
    >
      <Radio
        value="small"
        label={props.label ?? "Small (1 vCPU, 2GB)"}
        description={props.description ?? "Free tier"}
        disabled={props.disabled}
      />
      <Radio
        value="medium"
        label="Medium (2 vCPU, 4GB)"
        description="Standard workloads"
        disabled={props.disabled}
      />
      <Radio
        value="large"
        label="Large (4 vCPU, 8GB)"
        description="Memory-bound jobs"
        disabled={props.disabled}
      />
    </RadioGroup>
  );
}

export const playground: PlaygroundManifest = {
  component: RadioDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Small (1 vCPU, 2GB)" },
    description: { type: "text", default: "Free tier" },
    orientation: { type: "select", options: ["vertical", "horizontal"], default: "vertical" },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Vertical", props: { orientation: "vertical" } },
    { label: "Horizontal", props: { orientation: "horizontal" } },
    { label: "Disabled", props: { disabled: true } },
  ],
  events: [{ name: "onChange", signature: "(v: string) => void" }],
  notes: "<Radio> must be inside <RadioGroup>; the group owns selected value + name.",
};
