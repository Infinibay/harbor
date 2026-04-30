import { Tag } from "./Tag";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Tag as never,
  importPath: "@infinibay/harbor/display",
  defaultChildren: "frontend",
  controls: {},
  variants: [
    { label: "Plain", props: {}, children: "frontend" },
    { label: "Removable", props: {}, children: "react" },
  ],
  events: [{ name: "onRemove", signature: "() => void", description: "Renders the × when provided." }],
};
