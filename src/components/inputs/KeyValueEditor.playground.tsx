import { useState } from "react";
import { KeyValueEditor, type KeyValuePair } from "./KeyValueEditor";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const initial: KeyValuePair[] = [
  { id: "1", key: "API_URL", value: "https://api.example.com" },
  { id: "2", key: "API_TOKEN", value: "REDACTED_STRIPE_KEY" },
  { id: "3", key: "REGION", value: "us-east-1" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KeyValueEditorDemo(props: any) {
  const [value, setValue] = useState<KeyValuePair[]>(initial);
  return (
    <div className="w-[520px]">
      <KeyValueEditor
        {...props}
        value={value}
        onChange={(next: KeyValuePair[]) => {
          setValue(next);
          props.onChange?.(next);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: KeyValueEditorDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    keyPlaceholder: { type: "text", default: "KEY" },
    valuePlaceholder: { type: "text", default: "value" },
    hideAddButton: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "No add button", props: { hideAddButton: true } },
  ],
  events: [{ name: "onChange", signature: "(next: KeyValuePair[]) => void" }],
  notes:
    "Keys matching /secret|token|key|password|apikey/i auto-render as SecretsInput. Drag the handle on the left to reorder.",
};
