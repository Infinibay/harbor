import { ActivityFeed } from "./ActivityFeed";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const sampleEvents = [
  { id: "1", actor: "ana", verb: "deployed", target: "auth-service", at: new Date(Date.now() - 1000 * 60 * 5), tone: "success" as const },
  { id: "2", actor: "bot", verb: "ran", target: "nightly migration", at: new Date(Date.now() - 1000 * 60 * 60 * 2), tone: "info" as const },
  { id: "3", actor: "diego", verb: "rolled back", target: "billing-api v2.4.1", at: new Date(Date.now() - 1000 * 60 * 60 * 26), tone: "warning" as const },
  { id: "4", actor: "ana", verb: "merged", target: "PR #421", at: new Date(Date.now() - 1000 * 60 * 60 * 30), tone: "neutral" as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActivityFeedDemo(props: any) {
  return <ActivityFeed {...props} events={sampleEvents} />;
}

export const playground: PlaygroundManifest = {
  component: ActivityFeedDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    groupBy: { type: "select", options: ["day", "none"], default: "day" },
  },
  variants: [
    { label: "Grouped by day", props: { groupBy: "day" } },
    { label: "Flat", props: { groupBy: "none" } },
  ],
  notes:
    "Pass `events: ActivityEvent[]` with `actor`, `verb`, `target`, `at`, and an optional `tone`.",
};
