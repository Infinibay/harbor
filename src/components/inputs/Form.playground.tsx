import { Form } from "./Form";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormDemo(props: any) {
  return (
    <Form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
      className="w-[520px] max-w-full"
    >
      <FormSection title="Profile" description="Public info on your card.">
        <FormField label="Name" required>
          <TextField placeholder="Ada Lovelace" />
        </FormField>
        <FormField label="Email" helper="We won't share it.">
          <TextField placeholder="ada@example.com" />
        </FormField>
      </FormSection>
      <button
        type="submit"
        className="self-start h-11 px-4 rounded-lg bg-fuchsia-500/80 text-white text-sm"
      >
        Save
      </button>
    </Form>
  );
}

export const playground: PlaygroundManifest = {
  component: FormDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    noValidate: { type: "boolean", default: false, description: "Disable native HTML validation." },
  },
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "onSubmit", signature: "(e: FormEvent<HTMLFormElement>) => void" }],
  notes: "Form is a thin <form> wrapper. Compose FormSection, FieldSet, FieldRow, FormField inside.",
};
