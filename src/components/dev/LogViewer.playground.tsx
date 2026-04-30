import { LogViewer, type LogEntry } from "./LogViewer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const entries: LogEntry[] = [
  { id: 1, time: new Date(Date.now() - 30_000), level: "info",  message: "Server listening on :8080" },
  { id: 2, time: new Date(Date.now() - 25_000), level: "debug", source: "config", message: "Loaded /etc/harbor.yml" },
  { id: 3, time: new Date(Date.now() - 15_000), level: "warn",  source: "cache",  message: "Cache miss for key 'users:42' (4th in a row)" },
  { id: 4, time: new Date(Date.now() -  5_000), level: "error", source: "redis",  message: "Failed to connect to redis://cache:6379 (ECONNREFUSED)" },
  { id: 5, time: new Date(Date.now() -  2_000), level: "info",  message: "Retry succeeded after backoff" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogViewerDemo(props: any) {
  return <LogViewer {...props} entries={entries} />;
}

export const playground: PlaygroundManifest = {
  component: LogViewerDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    height: { type: "number", default: 240, min: 120, max: 600, step: 20 },
    autoScroll: { type: "boolean", default: true },
  },
};
