import { LogTailer } from "./LogTailer";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const seedEntries = Array.from({ length: 60 }, (_, i) => ({
  ts: Date.now() - (60 - i) * 1000,
  level: (["info", "debug", "warn", "error"] as const)[i % 4],
  message: `event #${i + 1} — sample log line`,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogTailerDemo(props: any) {
  return <LogTailer {...props} entries={seedEntries} />;
}

export const playground: PlaygroundManifest = {
  component: LogTailerDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    height: { type: "number", default: 320, min: 160, max: 720, step: 20 },
    bufferSize: { type: "number", default: 10000, min: 100, max: 50000, step: 100 },
    searchPlaceholder: { type: "text", default: "Filter logs…" },
  },
  events: [
    { name: "onFollowChange", signature: "(following: boolean) => void", description: "Fires when the user toggles auto-follow." },
  ],
};
