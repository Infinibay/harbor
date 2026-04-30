# CostBreakdown

Currency-formatted breakdown of cost items as a donut + legend (default) or a stacked horizontal bar + legend. Use for billing / spend rollups; prefer `Donut` directly when values aren't currencies and you don't need amount + percent in the legend.

## Import

```tsx
import { CostBreakdown } from "@infinibay/harbor/charts";
```

## Example

```tsx
<CostBreakdown
  currency="USD"
  items={[
    { id: "compute", label: "Compute", amount: 1820 },
    { id: "storage", label: "Storage", amount: 640 },
    { id: "egress",  label: "Egress",  amount: 312 },
    { id: "support", label: "Support", amount: 199 },
  ]}
/>
```

## Props

- **items** — `readonly CostItem[]`. Each `{ id, label, amount, color? }`.
- **currency** — ISO currency code passed to `Intl.NumberFormat`. Default: `"USD"`.
- **variant** — `"donut" | "stacked"`. Default: `"donut"`.
- **locale** — BCP 47 locale for formatting. Default: runtime default.
- **className** — wrapper class.

## Notes

- Center of the donut shows the total in formatted currency.
- Legend rows cross-highlight with the chart on hover (other items dim to 40 %).
- Stacked variant uses a Framer Motion spring to animate widths in.
- Colors auto-cycle through 8 defaults when `item.color` is unset.
