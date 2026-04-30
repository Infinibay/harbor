import { TraceWaterfall } from "./TraceWaterfall";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleSpans = [
  { id: "req", name: "POST /orders", start: 0, duration: 480, status: "ok" as const },
  { id: "auth", name: "auth.verify", start: 10, duration: 35, parent: "req", status: "ok" as const },
  { id: "db", name: "db.query orders", start: 60, duration: 180, parent: "req", status: "ok" as const },
  { id: "db.row", name: "rowFetch", start: 80, duration: 120, parent: "db", status: "ok" as const },
  { id: "ext", name: "stripe.charge", start: 260, duration: 200, parent: "req", status: "error" as const },
  { id: "ext.dns", name: "dns.lookup", start: 262, duration: 18, parent: "ext", status: "ok" as const },
  { id: "log", name: "kafka.publish", start: 470, duration: 10, parent: "req", status: "pending" as const },
];

function TraceWaterfallDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 280 }}>
      <TraceWaterfall {...props} spans={props.spans ?? sampleSpans} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: TraceWaterfallDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    totalMs: { type: "number", default: 480 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Padded total", props: { totalMs: 800 } },
  ],
};
