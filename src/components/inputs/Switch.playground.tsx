import { useState } from "react";
import { Switch } from "./Switch";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SwitchDemo(props: any) {
  const [checked, setChecked] = useState(Boolean(props.checked));
  return (
    <Switch
      {...props}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        props.onChange?.(e);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: SwitchDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Email notifications" },
    description: { type: "text", default: "Receive a digest every Monday." },
    size: { type: "select", options: ["sm", "md"], default: "md" },
    checked: { type: "boolean", default: false, description: "Initial state." },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Off", props: { checked: false } },
    { label: "On", props: { checked: true } },
    { label: "Small", props: { checked: true, size: "sm", description: "" } },
    { label: "Disabled", props: { checked: true, disabled: true } },
  ],
  events: [{ name: "onChange", signature: "(e: ChangeEvent<HTMLInputElement>) => void" }],
};
