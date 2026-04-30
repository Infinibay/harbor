import { CopyButton } from "./CopyButton";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: CopyButton as never,
  importPath: "@infinibay/harbor/buttons",
  defaultChildren: "Copy",
  controls: {
    value: {
      type: "text",
      default: "npm install @infinibay/harbor",
      description: "Text written to the clipboard on click.",
    },
    size: { type: "select", options: ["sm", "md"], default: "md" },
  },
  variants: [
    { label: "Default", props: { value: "npm install @infinibay/harbor" } },
    {
      label: "Token snippet",
      props: { value: 'rgb(var(--harbor-accent))' },
      children: "Copy token",
    },
  ],
  notes:
    "Click the button — it copies `value` and shows a confirmation for ~1.5s.",
};
