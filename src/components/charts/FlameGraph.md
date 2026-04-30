# FlameGraph

Hierarchical flame graph for perf profiles and call stacks. Click a frame to zoom in; breadcrumbs above let you zoom back out. Use for CPU profiles, allocation traces, or any tree of self-inclusive costs; for span timelines (parallel async work) prefer `TraceWaterfall`.

## Import

```tsx
import { FlameGraph } from "@infinibay/harbor/charts";
```

## Example

```tsx
<FlameGraph
  formatValue={(v) => `${v.toFixed(1)} ms`}
  frames={[
    { id: "root", label: "request",       value: 120 },
    { id: "auth", label: "verifyToken",   value:  18, parent: "root" },
    { id: "db",   label: "query users",   value:  72, parent: "root" },
    { id: "io",   label: "fs.readFile",   value:  20, parent: "db" },
    { id: "tpl",  label: "renderTemplate", value: 26, parent: "root" },
  ]}
  onFrameClick={(f) => console.log("zoom", f.id)}
/>
```

## Props

- **frames** — `readonly FlameFrame[]`. Each `{ id, parent?, label, value, color? }`. Multiple roots get wrapped under a synthetic `<all>` parent.
- **rowHeight** — vertical slot height in px. Default: `22`.
- **minPixelWidth** — minimum bar width in px (perf knob). Default: `1`.
- **onFrameClick** — `(frame) => void`. Called before zoom.
- **formatValue** — formatter for the value (ms, bytes, %). Default: `String(v)`.
- **className** — wrapper class.

## Notes

- Layout is percentage-based (CSS), so the graph reflows with container width.
- Hovering highlights the frame's full ancestor chain (others fade to 30 %).
- Colors auto-cycle through 8 defaults; per-frame `color` overrides.
- Frame width uses `max(child sum, parent value)` to stay consistent when a parent's reported value disagrees with the sum of its children.
