import { LabelLane } from "./LabelLane";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { Switch } from "./Switch";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LabelLaneDemo(props: any) {
  return (
    <div className="w-[520px]">
      <LabelLane {...props}>
        <FormField label="Name">
          <TextField defaultValue="harbor-site" />
        </FormField>
        <FormField label="Email address">
          <TextField type="email" defaultValue="ops@infinibay.dev" />
        </FormField>
        <FormField label="Backup retention">
          <NumberField defaultValue={7} unit="days" />
        </FormField>
        <FormField label="Public">
          <Switch defaultChecked />
        </FormField>
      </LabelLane>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: LabelLaneDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    labelMin: { type: "text", default: "0" },
    labelMax: { type: "text", default: "auto" },
    gapX: { type: "number", default: 6, min: 3, max: 12, step: 1, description: "Tailwind gap step." },
    gapY: { type: "number", default: 4, min: 2, max: 6, step: 1, description: "Tailwind gap step." },
  },
  variants: [
    { label: "Auto-sized labels", props: {} },
    { label: "Capped at 10rem", props: { labelMax: "10rem" } },
    { label: "Tight", props: { gapX: 4, gapY: 2 } },
  ],
  notes:
    "All controls align to the widest label automatically. Resize the viewport below md to see the stacked fallback.",
};
