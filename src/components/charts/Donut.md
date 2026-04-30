# Donut

Donut (ring) chart with hover-driven center readout and inline legend. Use for part-to-whole breakdowns where you want a clean single number front-and-center; for currencies and amounts in the legend prefer `CostBreakdown`.

## Import

```tsx
import { Donut } from "@infinibay/harbor/charts";
```

## Example

```tsx
<Donut
  size={200}
  thickness={20}
  centerLabel="usage"
  centerValue="68%"
  slices={[
    { id: "vm",     label: "VMs",      value: 42 },
    { id: "db",     label: "Database", value: 18 },
    { id: "cache",  label: "Cache",    value:  8 },
  ]}
/>
```

## Props

- **slices** — `DonutSlice[]`. Each `{ id, label, value, color? }`.
- **size** — outer diameter in px. Default: `180`.
- **thickness** — ring stroke width. Default: `18`.
- **centerLabel** — small uppercase caption above the center value.
- **centerValue** — large center readout shown when nothing is hovered.
- **className** — wrapper class.

## Notes

- On hover the center swaps to the slice's label and percent share; non-hovered slices dim to 40 %.
- Colors auto-cycle through 6 defaults when `slice.color` is unset.
- SVG-rendered with arc paths; safe for 2–12 slices. Past that prefer `BarChart`.
