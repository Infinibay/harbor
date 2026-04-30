import { Timeline } from "./Timeline";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleEvents = [
  { id: "1", title: "Deployed v1.5.0", time: "2m ago", tone: "success" as const },
  { id: "2", title: "Migration started", description: "schema_v3 → schema_v4",
    time: "10m ago", tone: "info" as const },
  { id: "3", title: "Disk pressure on node-2", description: "85% used",
    time: "1h ago", tone: "warning" as const },
  { id: "4", title: "API outage",
    description: "/v1/health returned 503 for 4m",
    time: "yesterday", tone: "danger" as const },
  { id: "5", title: "Cluster bootstrapped",
    time: "3d ago", tone: "neutral" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimelineDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 540, padding: 8 }}>
      <Timeline {...props} events={props.events ?? sampleEvents} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: TimelineDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {},
  variants: [
    { label: "Default", props: {} },
    {
      label: "Single tone",
      props: {
        events: sampleEvents.map((e) => ({ ...e, tone: "info" as const })),
      },
    },
  ],
};
