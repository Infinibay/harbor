import { MoreButton } from "./MoreButton";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: MoreButton as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    orientation: {
      type: "select",
      options: ["vertical", "horizontal"],
      default: "vertical",
      description: "Vertical = ⋮ (kebab), horizontal = ⋯ (meatball).",
    },
    size: { type: "select", options: ["sm", "md"], default: "md" },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Kebab", props: { orientation: "vertical" } },
    { label: "Meatball", props: { orientation: "horizontal" } },
    { label: "Small", props: { orientation: "vertical", size: "sm" } },
  ],
  events: [
    { name: "onClick", signature: "(e: MouseEvent) => void", description: "Pair with a Menu / Popover." },
  ],
};
