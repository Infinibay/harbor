import { MasonryGrid } from "./MasonryGrid";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleHeights = [120, 200, 80, 160, 240, 100, 180, 140, 220, 90, 170, 130];
const palette = [
  "#a855f7", "#38bdf8", "#f472b6", "#34d399",
  "#fbbf24", "#fb7185", "#818cf8", "#22d3ee",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MasonryGridDemo(props: any) {
  return (
    <div style={{ width: "100%", padding: 8 }}>
      <MasonryGrid {...props}>
        {sampleHeights.map((h, i) => (
          <div
            key={i}
            style={{
              height: h,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${palette[i % palette.length]}40, ${palette[(i + 3) % palette.length]}30)`,
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              padding: 12,
              fontSize: 12,
            }}
          >
            Card {i + 1}
            <br />
            h={h}px
          </div>
        ))}
      </MasonryGrid>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MasonryGridDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    columns: { type: "number", default: 3, min: 1, max: 6, step: 1 },
    gap: { type: "number", default: 12, min: 0, max: 48, step: 2 },
  },
  variants: [
    { label: "2 cols", props: { columns: 2 } },
    { label: "3 cols", props: { columns: 3 } },
    { label: "4 cols", props: { columns: 4 } },
    { label: "Tight", props: { columns: 3, gap: 4 } },
  ],
};
