import { FieldSpacer } from "./FieldSpacer";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldSpacerDemo(props: any) {
  return (
    <div className="w-[560px] max-w-full grid grid-cols-3 gap-4">
      <FormField label="First name">
        <TextField placeholder="Ada" />
      </FormField>
      <FormField label="Last name">
        <TextField placeholder="Lovelace" />
      </FormField>
      <div className="ring-1 ring-fuchsia-400/30 rounded-md">
        <FieldSpacer {...props} />
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FieldSpacerDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    hasLabel: { type: "boolean", default: true },
    hasMessage: { type: "boolean", default: false },
    match: { type: "select", default: "input", options: ["input", "button-sm", "button-md", "button-lg", "toggle"] },
    height: { type: "number", default: 0, min: 0, max: 96, step: 2, description: "Override match (0 = use match)." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Button-md", props: { match: "button-md" } },
    { label: "No label", props: { hasLabel: false } },
  ],
  notes: "The fuchsia outline shows the spacer's footprint — siblings line up against it.",
};
