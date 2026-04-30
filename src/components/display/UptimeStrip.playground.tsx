import { UptimeStrip, type UptimeDay, type DayStatus } from "./UptimeStrip";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const DAY_MS = 86_400_000;

function buildDays(count: number, seed = 1): UptimeDay[] {
  const days: UptimeDay[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = count - 1; i >= 0; i--) {
    const r = rand();
    let status: DayStatus = "operational";
    let label: string | undefined;
    if (r < 0.03) {
      status = "down";
      label = "Outage";
    } else if (r < 0.1) {
      status = "degraded";
      label = "Latency spike";
    } else if (r < 0.13) {
      status = "maintenance";
      label = "Scheduled maintenance";
    }
    days.push({
      date: Date.now() - i * DAY_MS,
      status,
      label,
    });
  }
  return days;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UptimeStripDemo(props: any) {
  const length = props.length ?? 90;
  return (
    <UptimeStrip
      {...props}
      label={props.label ?? "api.infinibay.com"}
      days={buildDays(length)}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: UptimeStripDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    label: { type: "text", default: "api.infinibay.com" },
    length: { type: "number", default: 90, min: 14, max: 180, step: 7 },
    size: { type: "number", default: 8, min: 4, max: 16 },
  },
  variants: [
    { label: "90 days", props: { length: 90 } },
    { label: "30 days", props: { length: 30 } },
    { label: "Chunky", props: { length: 45, size: 12 } },
  ],
  events: [
    { name: "onDayClick", signature: "(day: UptimeDay) => void" },
  ],
  notes: "Days are randomly generated in the demo; real callers pass their own array.",
};
