import { FieldSet } from "./FieldSet";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldSetDemo(props: any) {
  return (
    <div className="w-[480px] max-w-full">
      <FieldSet {...props}>
        <FormField label="Street">
          <TextField placeholder="221B Baker St" />
        </FormField>
        <FormField label="City">
          <TextField placeholder="London" />
        </FormField>
      </FieldSet>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FieldSetDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    legend: { type: "text", default: "Shipping address" },
    description: { type: "text", default: "Where should we send it?" },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "No description", props: { description: "" } },
    { label: "No legend", props: { legend: "", description: "" } },
  ],
};
