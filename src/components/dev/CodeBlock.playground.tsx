import { CodeBlock } from "./CodeBlock";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sample = `import { Button } from "@infinibay/harbor/buttons";

export function Save() {
  return <Button variant="primary">Save</Button>;
}`;

export const playground: PlaygroundManifest = {
  component: CodeBlock as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    code: { type: "text", default: sample },
    lang: { type: "select", options: ["tsx", "ts", "js", "jsx", "json", "bash", "css", "html"], default: "tsx" },
    title: { type: "text", default: "save.tsx" },
    showLineNumbers: { type: "boolean", default: false },
  },
  variants: [
    { label: "TSX", props: { lang: "tsx" } },
    { label: "Bash", props: { lang: "bash", code: "$ npm install @infinibay/harbor", title: "" } },
    { label: "With line numbers", props: { showLineNumbers: true } },
  ],
};
