import { MetricHeatmap } from "./MetricHeatmap";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleRows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sampleCols = ["00", "04", "08", "12", "16", "20"];

const sampleCells = (() => {
  const out: { r: number; c: number; v: number }[] = [];
  for (let r = 0; r < sampleRows.length; r++) {
    for (let c = 0; c < sampleCols.length; c++) {
      if (Math.random() < 0.18) continue; // sparse
      out.push({
        r,
        c,
        v: 0.2 + Math.sin(r + c) * 0.4 + Math.random() * 0.6,
      });
    }
  }
  return out;
})();

function MetricHeatmapDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 240 }}>
      <MetricHeatmap
        {...props}
        rows={props.rows ?? sampleRows}
        cols={props.cols ?? sampleCols}
        cells={props.cells ?? sampleCells}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MetricHeatmapDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    cellSize: { type: "number", default: 22 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Large cells", props: { cellSize: 32 } },
    {
      label: "Custom format",
      props: { formatV: (v: number) => `${v.toFixed(2)} req/s` },
    },
  ],
};
