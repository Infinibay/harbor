import { LogTailer } from "./LogTailer";
import type { LogEntry } from "./LogViewer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const LEVELS: LogEntry["level"][] = ["info", "debug", "warn", "error"];
const seedEntries: LogEntry[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  time: new Date(Date.now() - (60 - i) * 1000),
  level: LEVELS[i % 4],
  source: i % 3 === 0 ? "auth" : i % 3 === 1 ? "api" : "worker",
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
    height: { type: "number", default: 360, min: 160, max: 720, step: 20 },
    bufferSize: { type: "number", default: 10000, min: 100, max: 50000, step: 100 },
    searchPlaceholder: { type: "text", default: "Search (regex supported)…" },
  },
  events: [
    { name: "onFollowChange", signature: "(following: boolean) => void", description: "Fires when the user toggles auto-follow." },
  ],
};
