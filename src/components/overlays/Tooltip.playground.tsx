import { Tooltip } from "./Tooltip";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TooltipDemo(props: any) {
  return (
    <Tooltip {...props} content={props.content ?? "Saves and exits the editor"}>
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  );
}

export const playground: PlaygroundManifest = {
  component: TooltipDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    content: { type: "text", default: "Saves and exits the editor" },
    side: { type: "select", options: ["top", "bottom", "left", "right"], default: "top" },
    delay: { type: "number", default: 250, min: 0, max: 1500, step: 50 },
  },
  variants: [
    { label: "Top", props: { side: "top" } },
    { label: "Bottom", props: { side: "bottom" } },
    { label: "Left", props: { side: "left" } },
    { label: "Right", props: { side: "right" } },
    { label: "Instant", props: { delay: 0 } },
  ],
};
