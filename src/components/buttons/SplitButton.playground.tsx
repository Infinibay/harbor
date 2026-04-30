import { SplitButton } from "./SplitButton";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const opts = {
  primary: { id: "save", label: "Save", onSelect: () => {} },
  options: [
    { id: "continue", label: "Save and continue", onSelect: () => {} },
    { id: "draft", label: "Save as draft", onSelect: () => {} },
    { id: "close", label: "Save and close", onSelect: () => {} },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SplitButtonDemo(props: any) {
  return (
    <SplitButton
      primary={opts.primary}
      options={opts.options}
      variant={props.variant ?? "primary"}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: SplitButtonDemo as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    variant: {
      type: "select",
      options: ["primary", "secondary"],
      default: "primary",
    },
  },
  variants: [
    { label: "Primary", props: { variant: "primary" } },
    { label: "Secondary", props: { variant: "secondary" } },
  ],
  notes:
    "Click the main label to fire `primary.onClick`; click the caret to open the menu of `options`.",
};
