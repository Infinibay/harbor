import { ActionRow } from "./ActionRow";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActionRowDemo(props: any) {
  return (
    <ActionRow {...props}>
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </ActionRow>
  );
}

export const playground: PlaygroundManifest = {
  component: ActionRowDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    align: { type: "select", options: ["start", "center", "end", "between"], default: "end" },
    gap: { type: "number", default: 3, min: 1, max: 6, step: 1, description: "Tailwind gap step (1–6)." },
    stackBelow: { type: "select", options: ["", "sm", "md", "lg"], default: "", description: "Empty = no stacking." },
    reverseOnStack: { type: "boolean", default: true },
    divide: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default (end)", props: {} },
    { label: "Centered", props: { align: "center" } },
    { label: "Between", props: { align: "between" } },
    { label: "Footer with divider", props: { divide: true } },
  ],
  notes: "Children should be <Button> elements. Use stackBelow on narrow forms.",
};
