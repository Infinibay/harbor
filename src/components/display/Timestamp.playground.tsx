import { Timestamp } from "./Timestamp";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimestampDemo(props: any) {
  const offsetMs = (props.offsetMinutes ?? -90) * 60 * 1000;
  return <Timestamp {...props} value={new Date(Date.now() + offsetMs)} />;
}

export const playground: PlaygroundManifest = {
  component: TimestampDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    offsetMinutes: { type: "number", default: -90, min: -10080, max: 10080, description: "Minutes from now (negative = past)." },
    relative: { type: "boolean", default: true, description: "Render '2m ago' vs absolute timestamp." },
    refreshMs: { type: "number", default: 15000, min: 0, max: 60000, step: 1000, description: "0 disables live updates." },
    noTooltip: { type: "boolean", default: false },
  },
  variants: [
    { label: "1.5h ago", props: { offsetMinutes: -90 } },
    { label: "Just now", props: { offsetMinutes: 0 } },
    { label: "Tomorrow", props: { offsetMinutes: 60 * 24 } },
    { label: "Absolute", props: { relative: false } },
  ],
};
