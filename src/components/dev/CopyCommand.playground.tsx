import { CopyCommand } from "./CopyCommand";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const variants = [
  { label: "npm", code: "npm install @infinibay/harbor" },
  { label: "pnpm", code: "pnpm add @infinibay/harbor" },
  { label: "yarn", code: "yarn add @infinibay/harbor" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CopyCommandDemo(props: any) {
  return <CopyCommand {...props} variants={variants} />;
}

export const playground: PlaygroundManifest = {
  component: CopyCommandDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    showPrompt: { type: "boolean", default: true, description: "Render the leading $ prompt." },
  },
  variants: [
    { label: "With prompt", props: { showPrompt: true } },
    { label: "No prompt", props: { showPrompt: false } },
  ],
};
