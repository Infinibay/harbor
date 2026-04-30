import { FormField } from "./FormField";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormFieldDemo(props: any) {
  return (
    <div className="w-[420px] max-w-full">
      <FormField {...props}>
        <TextField placeholder="ada@example.com" />
      </FormField>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FormFieldDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Email" },
    helper: { type: "text", default: "We'll send a verification link." },
    error: { type: "text", default: "" },
    required: { type: "boolean", default: false },
    optional: { type: "boolean", default: false },
    layout: { type: "select", default: "stacked", options: ["stacked", "inline"] },
    labelless: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Required", props: { required: true } },
    { label: "With error", props: { error: "That email is already in use", helper: "" } },
    { label: "Inline", props: { layout: "inline" } },
  ],
};
