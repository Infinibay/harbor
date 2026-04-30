import { ButtonGroup } from "./ButtonGroup";
import { Button } from "./Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ButtonGroupDemo(props: any) {
  return (
    <ButtonGroup {...props}>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  );
}

export const playground: PlaygroundManifest = {
  component: ButtonGroupDemo as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    attached: {
      type: "boolean",
      default: true,
      description: "Removes inner borders so buttons feel segmented.",
    },
  },
  variants: [
    { label: "Attached", props: { attached: true } },
    { label: "Spaced", props: { attached: false } },
    { label: "Small attached", props: { attached: true, size: "sm" } },
  ],
  notes: "Wrap any number of <Button> children. The group only forwards `size` to children.",
};
