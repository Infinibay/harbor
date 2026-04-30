import { Terminal, type TerminalLine } from "./Terminal";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const lines: TerminalLine[] = [
  { id: 1, kind: "cmd", text: "npm install @infinibay/harbor" },
  { id: 2, kind: "out", text: "added 110 packages in 14s" },
  { id: 3, kind: "cmd", text: "npm run dev" },
  { id: 4, kind: "out", text: "VITE v8.0.10  ready in 482 ms" },
  { id: 5, kind: "info", text: "  ➜  Local:   http://localhost:5174/" },
  { id: 6, kind: "info", text: "  ➜  press h + enter to show help" },
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
    autoScroll: { type: "boolean", default: true },
  },
};
