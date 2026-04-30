import { useState } from "react";
import { MultiSelect } from "./MultiSelect";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const options = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "infra", label: "Infrastructure" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data" },
  { value: "ml", label: "Machine Learning" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiSelectDemo(props: any) {
  const [value, setValue] = useState<string[]>(["frontend", "design"]);
  return (
    <div className="w-72">
      <MultiSelect
        {...props}
        options={options}
        value={value}
        onChange={(v: string[]) => {
          setValue(v);
          props.onChange?.(v);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MultiSelectDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Teams" },
    placeholder: { type: "text", default: "Pick teams" },
  },
  events: [{ name: "onChange", signature: "(v: string[]) => void" }],
};
