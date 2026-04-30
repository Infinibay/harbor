import { DurationPill } from "./DurationPill";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DurationPillDemo(props: any) {
  const fromMs = (props.fromMinutesAgo ?? 90) * 60 * 1000;
  return (
    <DurationPill
      {...props}
      from={new Date(Date.now() - fromMs)}
      to={props.live ? undefined : new Date()}
      auto={props.live ? 1000 : 0}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: DurationPillDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    fromMinutesAgo: { type: "number", default: 90, min: 1, max: 100000 },
    prefix: { type: "text", default: "uptime" },
    live: { type: "boolean", default: true, description: "Re-render every second to keep elapsed time live." },
  },
  variants: [
    { label: "Live uptime", props: { fromMinutesAgo: 90, live: true, prefix: "uptime" } },
    { label: "Frozen", props: { fromMinutesAgo: 240, live: false, prefix: "ran for" } },
  ],
};
