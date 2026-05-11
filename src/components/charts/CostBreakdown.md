# CostBreakdown

`CostBreakdown` visualizes a set of cost items as either a donut chart with a
legend or a stacked horizontal bar. It formats amounts with `Intl.NumberFormat`,
calculates percentages from the provided total, assigns colors, and
cross-highlights rows on hover.

Use it for billing dashboards, infrastructure cost summaries, plan usage,
project spend, departmental allocation, and invoice previews.

## Import

```tsx
import { CostBreakdown } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
<CostBreakdown
  currency="USD"
  items={[
    { id: "compute", label: "Compute", amount: 1820 },
    { id: "storage", label: "Storage", amount: 640 },
    { id: "egress", label: "Egress", amount: 312 },
  ]}
/>;
```

Use the stacked variant for dense cards:

```tsx
<CostBreakdown variant="stacked" currency="EUR" items={invoiceItems} />
```

## Props

- **items** - `readonly CostItem[]`. Required. Items are summed to calculate
  total and percentages.
- **currency** - `string`. ISO currency code for amount formatting. Default
  `"USD"`.
- **variant** - `"donut" | "stacked"`. Default `"donut"`.
- **locale** - `string`. Optional locale passed to `Intl.NumberFormat`.
- **className** - extra classes on the wrapper.

## CostItem

```ts
type CostItem = {
  id: string;
  label: string;
  amount: number;
  color?: string;
};
```

If `color` is omitted, Harbor cycles through its default chart palette.

## Behavior

The donut variant delegates the chart to `Donut` and uses the formatted total in
the center. The stacked variant renders each segment as a percentage width.

Hovering a legend row or stacked segment dims the other categories. Percentages
are calculated as `amount / total`; when total is zero, percentages render as
zero.

## Accessibility

The legend lists label, percentage, and formatted amount as text, so the
breakdown is not color-only. Keep labels clear and include a nearby billing
period or scope, such as `Current month` or `Project A`.

For financial decisions, provide a table or drill-down with exact line items.
The chart is a summary, not an invoice.

## Gotchas

- Negative amounts are not meaningful in this visualization. Normalize credits
  or refunds before rendering.
- Many categories make both variants harder to scan. Group small categories into
  `Other`.
- Currency formatting depends on valid ISO currency codes.
- The component does not fetch or reconcile billing data.

## Related

- `Donut` for generic proportional charts.
- `MetricCard` for headline spend.
- `DataTable` for invoice line items.
- `Progress` for quota and budget usage.
