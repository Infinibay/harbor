import { useState } from "react";
import { Checkbox } from "./Checkbox";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CheckboxDemo(props: any) {
  const [checked, setChecked] = useState(Boolean(props.checked));
  return (
    <Checkbox
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
  component: CheckboxDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Email me a weekly digest" },
    description: { type: "text", default: "Sent every Monday at 9am UTC." },
    checked: { type: "boolean", default: false, description: "Initial state." },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Unchecked", props: { checked: false } },
    { label: "Checked", props: { checked: true } },
    { label: "No description", props: { checked: true, description: "" } },
    { label: "Disabled", props: { checked: true, disabled: true } },
  ],
  events: [{ name: "onChange", signature: "(e: ChangeEvent<HTMLInputElement>) => void" }],
};
