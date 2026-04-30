import { FieldRow } from "./FieldRow";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldRowDemo(props: any) {
  return (
    <div className="w-[640px] max-w-full">
      <FieldRow {...props}>
        <FormField label="First name">
          <TextField placeholder="Ada" />
        </FormField>
        <FormField label="Last name" error={props.showError ? "Required" : undefined}>
          <TextField placeholder="Lovelace" />
        </FormField>
        <FieldRow.Action>
          <button className="h-11 px-4 rounded-lg bg-fuchsia-500/80 text-white text-sm">
            Save
          </button>
        </FieldRow.Action>
      </FieldRow>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FieldRowDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    template: { type: "text", default: "1fr 1fr auto", description: "grid-template-columns at md+." },
    gapX: { type: "number", default: 4, min: 1, max: 8, step: 1, description: "Tailwind gap step (1–8)." },
    reserveMessage: { type: "boolean", default: true },
    controlAlign: { type: "select", default: "start", options: ["start", "center", "end"] },
    showError: { type: "boolean", default: false, description: "Toggle a sibling error to verify alignment." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Equal columns", props: { template: "" } },
    { label: "With error", props: { showError: true } },
  ],
  notes: "Resize the panel below md (768px) to see the row collapse to a vertical stack.",
};
