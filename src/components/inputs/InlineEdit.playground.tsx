import { useState } from "react";
import { InlineEdit } from "./InlineEdit";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InlineEditDemo(props: any) {
  const [value, setValue] = useState<string>(props.defaultValue ?? "Untitled project");
  return (
    <InlineEdit
      {...props}
      value={value}
      onChange={(v: string) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: InlineEditDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    placeholder: { type: "text", default: "Click to edit" },
    as: { type: "select", default: "text", options: ["text", "heading"] },
  },
  variants: [
    { label: "Default", props: { defaultValue: "Untitled project" } },
    { label: "Heading", props: { as: "heading", defaultValue: "Project Aurora" } },
    { label: "Empty", props: { defaultValue: "" } },
  ],
  events: [{ name: "onChange", signature: "(value: string) => void" }],
  notes: "Click to edit. Enter or blur commits, Escape cancels.",
};
