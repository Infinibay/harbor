import { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

/**
 * `pressed` is normally a controlled prop; the playground turns it into
 * a local-state toggle so the demo feels real instead of stuck.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToggleButtonDemo(props: any) {
  const [pressed, setPressed] = useState<boolean>(Boolean(props.pressed));
  return (
    <ToggleButton
      {...props}
      pressed={pressed}
      onChange={(p: boolean) => {
        setPressed(p);
        props.onChange?.(p);
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ToggleButtonDemo as never,
  importPath: "@infinibay/harbor/buttons",
  defaultChildren: "Bold",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    pressed: { type: "boolean", default: false, description: "Initial state." },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Off", props: { pressed: false } },
    { label: "On", props: { pressed: true } },
    { label: "Small", props: { pressed: false, size: "sm" } },
    { label: "Large", props: { pressed: true, size: "lg" } },
  ],
  events: [
    {
      name: "onChange",
      signature: "(pressed: boolean) => void",
      description: "Fires when the user toggles the button.",
    },
  ],
};
