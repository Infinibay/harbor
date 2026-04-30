# Sparkline

Tiny inline trend line — fixed width, no axes, no tooltip. Use inside table cells, KPI tiles, and toolbar badges to show recent shape at a glance. For interactive charts with hover, axes, and legends, use `LineChart` (categorical) or `TimeSeriesChart` (timestamped).

## Import

```tsx
import { Sparkline } from "@infinibay/harbor/charts";
```

## Example

```tsx
<Sparkline
  data={[12, 14, 13, 18, 22, 19, 24, 28, 26, 31]}
  width={120}
  height={32}
/>
```

## Props

- **data** — `number[]`. Values, in order. Empty array renders nothing.
- **width** — px. Default: `100`.
- **height** — px. Default: `28`.
- **stroke** — line color. Default: `"#a855f7"`.
- **fill** — top-of-area color (faded to transparent at the bottom). Default: `"rgba(168,85,247,0.15)"`.
- **showDot** — render a filled dot at the latest point. Default: `true`.
- **className** — extra classes on the SVG.

## Notes

- Pure SVG with `overflow-visible` so the trailing dot doesn't get clipped.
- Y range auto-scales to `[min, max]` of `data`; constant series collapses to a flat midline.
- No accessibility role — pair with a numeric readout next to it for screen readers.
