import { IncidentTimeline, type Incident } from "./IncidentTimeline";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const HOUR = 3600_000;
const MIN = 60_000;

const incidents: Incident[] = [
  {
    id: "inc-42",
    title: "Elevated 5xx on auth-api",
    severity: "major",
    startedAt: Date.now() - 2 * HOUR,
    affectedComponents: ["auth-api", "session-svc"],
    updates: [
      { at: Date.now() - 2 * HOUR, status: "investigating", message: "Spike of 503s — paging on-call." },
      { at: Date.now() - 90 * MIN, status: "identified", message: "Stale connection pool in session-svc." },
      { at: Date.now() - 10 * MIN, status: "monitoring", message: "Pool reset; error rate dropping." },
    ],
  },
  {
    id: "inc-41",
    title: "EU-west region degraded",
    severity: "critical",
    startedAt: Date.now() - 26 * HOUR,
    resolvedAt: Date.now() - 22 * HOUR,
    affectedComponents: ["eu-west"],
    updates: [
      { at: Date.now() - 26 * HOUR, status: "investigating", message: "Multiple host alerts." },
      { at: Date.now() - 23 * HOUR, status: "identified", message: "Upstream provider network issue." },
      { at: Date.now() - 22 * HOUR, status: "resolved", message: "Provider confirmed fix; metrics back to baseline." },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IncidentTimelineDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <IncidentTimeline {...props} incidents={incidents} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: IncidentTimelineDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    expandedByDefault: { type: "boolean", default: true },
  },
};
