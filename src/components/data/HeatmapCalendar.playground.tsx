import { HeatmapCalendar } from "./HeatmapCalendar";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function buildSample(): Record<string, number> {
  const out: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 20 * 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Pseudo-random but stable
    const v = Math.max(0, Math.round(Math.sin(i * 0.7) * 6 + (i % 11)));
    out[iso] = v;
  }
  return out;
}

const sampleData = buildSample();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeatmapCalendarDemo(props: any) {
  return (
    <div style={{ width: "100%", padding: 16 }}>
      <HeatmapCalendar
        {...props}
        data={props.data ?? sampleData}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: HeatmapCalendarDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    weeks: { type: "number", default: 20, min: 4, max: 53, step: 1 },
    max: { type: "number", default: 12, min: 1, max: 100, step: 1 },
  },
  variants: [
    { label: "20 weeks", props: { weeks: 20 } },
    { label: "Full year", props: { weeks: 53 } },
    { label: "Compressed peak", props: { weeks: 20, max: 4 } },
  ],
  events: [
    { name: "onHover", signature: "(date: string | null, value: number) => void" },
  ],
};
