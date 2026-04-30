import { StatusPage, type StatusComponent } from "./StatusPage";
import type { UptimeDay } from "../display/UptimeStrip";
import type { Incident } from "../display/IncidentTimeline";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const HOUR = 3600_000;
const DAY = 24 * HOUR;

function makeUptime(len = 60): UptimeDay[] {
  const out: UptimeDay[] = [];
  const now = Date.now();
  for (let i = len - 1; i >= 0; i--) {
    const r = Math.random();
    const status =
      r > 0.97 ? "down" : r > 0.85 ? "degraded" : "operational";
    out.push({ date: now - i * DAY, status });
  }
  return out;
}

const components: StatusComponent[] = [
  { id: "api", name: "API", status: "online", group: "Core", uptime: makeUptime(60) },
  { id: "db", name: "Database", status: "online", group: "Core", uptime: makeUptime(60) },
  { id: "auth", name: "Auth", status: "degraded", group: "Core", description: "Elevated latency on login.", uptime: makeUptime(60) },
  { id: "eu", name: "EU-west", status: "online", group: "Regions", uptime: makeUptime(60) },
  { id: "us", name: "US-east", status: "online", group: "Regions", uptime: makeUptime(60) },
  { id: "cdn", name: "CDN provider", status: "online", group: "Third-party" },
];

const incidents: Incident[] = [
  {
    id: "inc-42",
    title: "Elevated 5xx on auth",
    severity: "major",
    startedAt: Date.now() - 2 * HOUR,
    affectedComponents: ["auth"],
    updates: [
      { at: Date.now() - 2 * HOUR, status: "investigating", message: "Spike of 503s — paging on-call." },
      { at: Date.now() - 30 * 60_000, status: "monitoring", message: "Pool reset; error rate dropping." },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatusPageDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 880 }}>
      <StatusPage
        {...props}
        components={components}
        incidents={incidents}
        uptime={props.showUptime ? makeUptime(90) : undefined}
        header={
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-white">System status</h2>
            <span className="text-xs text-white/45">Last updated just now</span>
          </div>
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: StatusPageDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    "system.status": {
      type: "select",
      options: ["operational", "degraded", "partial-outage", "major-outage", "maintenance"],
      default: "degraded",
      description: "Drives the banner color and label.",
    },
    showUptime: { type: "boolean", default: true, description: "Render the global uptime strip." },
  },
  variants: [
    { label: "Operational", props: { system: { status: "online" } } },
    { label: "Degraded", props: { system: { status: "degraded" } } },
    { label: "Partial outage", props: { system: { status: "partial-outage" } } },
    { label: "Major outage", props: { system: { status: "major-outage" } } },
    { label: "Maintenance", props: { system: { status: "maintenance" } } },
  ],
  events: [],
  notes:
    "Component uptime data is randomized per render to make the strips visually varied.",
};
