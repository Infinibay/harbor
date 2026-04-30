import { IconTile } from "./IconTile";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconTileDemo(props: any) {
  return <IconTile {...props} icon={<span>★</span>} />;
}

export const playground: PlaygroundManifest = {
  component: IconTileDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    tone: {
      type: "select",
      options: ["neutral", "sky", "green", "purple", "amber", "rose"],
      default: "sky",
    },
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
  },
  variants: [
    { label: "Sky · md", props: { tone: "sky", size: "md" } },
    { label: "Green · md", props: { tone: "green" } },
    { label: "Amber · sm", props: { tone: "amber", size: "sm" } },
    { label: "Purple · lg", props: { tone: "purple", size: "lg" } },
  ],
};
