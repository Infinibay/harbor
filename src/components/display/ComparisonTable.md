# ComparisonTable

`ComparisonTable` renders plan, product, or feature comparisons grouped into sections. It is built for pricing pages, entitlement matrices, customer-facing product pages, and internal package comparisons.

Use it when each row has the same set of columns and the user needs to compare options side by side.

## Import

```tsx
import {
  ComparisonTable,
  type ComparisonGroup,
} from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { ComparisonTable } from "@infinibay/harbor/display";

export function PlanComparison() {
  return (
    <ComparisonTable
      plans={[
        { id: "starter", name: "Starter" },
        { id: "team", name: "Team", highlighted: true },
        { id: "enterprise", name: "Enterprise" },
      ]}
      groups={[
        {
          label: "Core",
          rows: [
            { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
            { label: "Team seats", values: ["2", "25", "Custom"] },
            { label: "Audit log", values: [false, true, true] },
          ],
        },
      ]}
    />
  );
}
```

## Data Model

```ts
type ComparisonGroup = {
  label: string;
  rows: {
    label: ReactNode;
    values: (boolean | string | ReactNode)[];
    hint?: string;
  }[];
};
```

Boolean values render as check and dash symbols. Strings and React nodes render as text content.

## Props

- **plans**: `{ id: string; name: string; highlighted?: boolean }[]`. Required columns.
- **groups**: `ComparisonGroup[]`. Required row groups.
- **className**: custom class on the horizontal scroll wrapper.

## Accessibility

The component renders a semantic table with column headers. Keep row labels short and use `hint` for supporting text. Do not rely only on the highlighted column color to communicate the recommended plan; say that in surrounding copy or a badge.

## Gotchas

- Every row's `values` array should match the `plans` length.
- Boolean symbols are compact. Use explicit strings such as `"Included"` or `"Add-on"` when a feature has nuance.
- The table scrolls horizontally on narrow containers. Keep important plans near the left.
- Section labels are rendered as full-width rows, not table header groups.

## Related

- [`PricingCard`](./BillingCard.md) for plan cards.
- [`Badge`](./Badge.md) for plan labels.
- [`DataTable`](../data/DataTable.md) for sortable data grids.
