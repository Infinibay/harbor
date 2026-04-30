import { useState } from "react";
import { TagInput } from "./TagInput";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TagInputDemo(props: any) {
  const [value, setValue] = useState<string[]>(props.defaultValue ?? ["frontend", "react"]);
  return (
    <div className="w-80">
      <TagInput
        {...props}
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
  component: TagInputDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Tags" },
    placeholder: { type: "text", default: "Add tag…" },
  },
  events: [{ name: "onChange", signature: "(v: string[]) => void" }],
  notes: "Press Enter or comma to commit a tag. Backspace on an empty input removes the last one.",
};
