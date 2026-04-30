# TickerTape

Horizontally scrolling marquee of label/value/change items —
stock-ticker style. Use it for ambient at-a-glance metrics ("MRR
$12k ▲ 2.1%") on dashboards or marketing pages. For a static metric
row, prefer `<Stat>` or `<MetricCard>`.

## Import

```tsx
import { TickerTape } from "@infinibay/harbor/display";
```

## Example

```tsx
<TickerTape
  speed={40}
  items={[
    { id: "mrr", label: "MRR", value: "$12,540", change: 2.1 },
    { id: "vms", label: "VMs", value: 128, change: 0 },
    { id: "p95", label: "p95", value: "184ms", change: -3.4 },
  ]}
/>
```

## Props

- **items** — `TickerItem[]`. Required. Each item has:
  - **id** — `string`. Stable key.
  - **label** — `ReactNode`. Muted lead-in text.
  - **value** — `ReactNode`. Optional monospaced figure.
  - **change** — `number`. Optional percent delta; positive renders
    `▲` in emerald, negative `▼` in rose.
- **speed** — `number`. Seconds for one full loop. Default `40`.
- **gap** — `number`. Pixel gap between items. Default `28`.
- **className** — extra classes on the wrapper.

## Notes

- The list is doubled internally so the loop seam is invisible —
  always provide unique `id`s; the key combines `id` with index.
- The animation is pure CSS (`@keyframes ticker`); pausing on hover
  is not built in.
