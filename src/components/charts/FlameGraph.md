# FlameGraph

`FlameGraph` renders hierarchical cost data as stacked horizontal frames. It is built for CPU profiles, allocation traces, resolver timing, build-step cost, and other trees where every node has a self-inclusive value.

Click a frame to zoom into that subtree. Use the breadcrumbs to move back toward the root.

## Import

```tsx
import { FlameGraph, type FlameFrame } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
import { FlameGraph, type FlameFrame } from "@infinibay/harbor/charts";

const frames: FlameFrame[] = [
  { id: "request", label: "request", value: 120 },
  { id: "auth", parent: "request", label: "verifyToken", value: 18 },
  { id: "db", parent: "request", label: "query users", value: 72 },
  { id: "io", parent: "db", label: "fs.readFile", value: 20 },
  { id: "render", parent: "request", label: "renderTemplate", value: 26 },
];

export function ProfilePanel() {
  return (
    <FlameGraph
      frames={frames}
      formatValue={(value) => `${value.toFixed(1)} ms`}
      onFrameClick={(frame) => console.log("selected", frame.id)}
    />
  );
}
```

## Data Model

```ts
type FlameFrame = {
  id: string;
  parent?: string | null;
  label: string;
  value: number;
  color?: string;
};
```

Frames without a parent are roots. Multiple roots are automatically wrapped under a synthetic `<all>` root so the graph can still render a single tree.

## Props

- **frames**: `readonly FlameFrame[]`. Required profile tree.
- **rowHeight**: `number`. Vertical slot height in pixels. Defaults to `22`.
- **minPixelWidth**: `number`. CSS minimum frame width. Defaults to `1`.
- **onFrameClick**: `(frame: FlameFrame) => void`. Called before zooming into a frame.
- **formatValue**: `(v: number) => string`. Formats hover labels and titles.
- **className**: custom class on the wrapper.

## Accessibility

Frames and breadcrumbs are rendered as buttons, so they can receive focus and expose their label/value. Still provide a textual performance summary near the graph, especially when the graph is used in diagnostics or reports.

Color is only an aid. The frame labels, values, and hover summary carry the actual meaning.

## Gotchas

- Values are treated as self-inclusive costs. If child totals exceed parent values, layout uses the larger denominator so children remain visible.
- Very tiny frames may still be hard to inspect. Use zoom, filtering, or aggregation for large traces.
- The component does not virtualize thousands of frames. Pre-aggregate profiles before rendering huge traces.
- Clicking a leaf calls `onFrameClick` but does not zoom because there are no children.

## Related

- [`TraceWaterfall`](./TraceWaterfall.md) for async spans over time.
- [`LineChart`](./LineChart.md) for trends across runs.
- [`LogViewer`](../dev/LogViewer.md) for surrounding diagnostic output.
