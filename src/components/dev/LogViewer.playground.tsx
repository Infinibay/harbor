import { LogViewer } from "./LogViewer";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const entries = [
  { ts: Date.now() - 1000 * 30, level: "info" as const, message: "Server listening on :8080" },
  { ts: Date.now() - 1000 * 25, level: "debug" as const, message: "Loaded config from /etc/harbor.yml" },
  { ts: Date.now() - 1000 * 15, level: "warn" as const, message: "Cache miss for key 'users:42' (4th in a row)" },
  { ts: Date.now() - 1000 * 5, level: "error" as const, message: "Failed to connect to redis://cache:6379 (ECONNREFUSED)" },
  { ts: Date.now() - 1000 * 2, level: "info" as const, message: "Retry succeeded after backoff" },
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
