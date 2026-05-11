# ResourceMeter

`ResourceMeter` renders multiple percentage-based usage bars with threshold-aware color. It is built for host cards, deployment inspectors, billing usage panels, admin dashboards, and any compact view that compares CPU, memory, disk, network, quota, or capacity.

Use it when several related resources need to be scanned together. For one value, use `Progress`. For segmented quota allocation, use `QuotaBar`.

## Import

```tsx
import { ResourceMeter } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { ResourceMeter } from "@infinibay/harbor/display";

export function HostResources() {
  return (
    <ResourceMeter
      resources={[
        { label: "CPU", value: 42, detail: "1.7 / 4 cores" },
        { label: "Memory", value: 68, detail: "5.4 / 8 GB" },
        { label: "Disk", value: 92, detail: "184 / 200 GB", threshold: [70, 90] },
        { label: "Network", value: 12, detail: "12 Mbps" },
      ]}
    />
  );
}
```

## Props

- **resources** - `Resource[]`. Required list of resource rows.
- **layout** - `"rows" | "compact"`. Default `"rows"`.
- **className** - extra classes on the wrapper.

## Resource Model

```ts
type Resource = {
  label: string;
  value: number;
  detail?: string;
  icon?: ReactNode;
  threshold?: [number, number];
};
```

`value` is a percentage. The component clamps it visually to `0..100`. `threshold` is `[warning, danger]` and defaults to `[70, 90]`.

## Layouts

`rows` renders stacked full-width bars. It shows `label`, optional `icon`, optional `detail`, and a precise one-decimal percentage.

`compact` renders inline chips with small bars and integer percentages. It hides `detail`, making it better for table cells, status bars, card footers, and dense dashboards.

## Accessibility

The current component is visual and does not set `role="progressbar"` or `aria-valuenow`. For critical usage reporting, include the value in nearby text, a table cell, or a summary label so screen-reader users receive the same information.

Do not rely only on amber and rose thresholds. Keep the numeric percentage visible.

## Gotchas

- Pass percentages, not absolute values.
- Threshold comparisons are inclusive: `value >= warning` and `value >= danger`.
- `detail` is not shown in compact layout.
- The component does not aggregate resources or calculate percentages.

## Related

- `Progress` for a single progress value.
- `QuotaBar` for quota allocation.
- `Gauge` for a single prominent metric.
