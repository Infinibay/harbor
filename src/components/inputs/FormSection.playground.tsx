import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormSectionDemo(props: any) {
  return (
    <div className="w-[720px] max-w-full">
      <FormSection
        {...props}
        actions={
          <button className="h-10 px-4 rounded-lg bg-fuchsia-500/80 text-white text-sm">
            Save
          </button>
        }
      >
        <FormField label="Name">
          <TextField placeholder="Ada Lovelace" />
        </FormField>
        <FormField label="Email">
          <TextField placeholder="ada@example.com" />
        </FormField>
      </FormSection>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FormSectionDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    title: { type: "text", default: "Profile" },
    description: { type: "text", default: "This information is shown on your public card." },
    columns: { type: "boolean", default: false, description: "Header left, fields right." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Two columns", props: { columns: true } },
    { label: "Title only", props: { description: "" } },
  ],
};
