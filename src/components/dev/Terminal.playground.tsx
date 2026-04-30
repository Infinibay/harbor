import { Terminal } from "./Terminal";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const lines = [
  { type: "cmd" as const, text: "npm install @infinibay/harbor" },
  { type: "out" as const, text: "added 110 packages in 14s" },
  { type: "cmd" as const, text: "npm run dev" },
  { type: "out" as const, text: "VITE v8.0.10 ready in 482 ms" },
  { type: "out" as const, text: "  ➜  Local:   http://localhost:5174/" },
  { type: "err" as const, text: "  ➜  press h + enter to show help" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TerminalDemo(props: any) {
  return <Terminal {...props} lines={lines} />;
}

export const playground: PlaygroundManifest = {
  component: TerminalDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    title: { type: "text", default: "~/work/harbor-site" },
    prompt: { type: "text", default: "$" },
    height: { type: "number", default: 280, min: 120, max: 600, step: 20 },
  },
};
