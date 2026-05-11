# QuotaBar

`QuotaBar` renders segmented usage against a total: used/reserved/free capacity, workspace seats, storage allocation, API budget, or plan limits. It can also draw soft and hard limit markers so users understand where usage becomes risky.

Use it when the composition of usage matters. For a single scalar progress value, use `Progress`; for richer multi-resource cards, use `ResourceMeter`.

## Import

```tsx
import { QuotaBar, type QuotaSegment } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { QuotaBar } from "@infinibay/harbor/display";

export function StorageQuota() {
  return (
    <QuotaBar
      total={16}
      soft={0.7}
      hard={0.9}
      formatValue={(value) => `${value.toFixed(1)} GB`}
      segments={[
        { label: "Frontend", value: 3.4, tone: "used" },
        { label: "Backend", value: 2.8, tone: "reserved" },
        { label: "Database", value: 2.1, tone: "info" },
      ]}
    />
  );
}
```

## Segments

```ts
type QuotaSegment = {
  label: string;
  value: number;
  tone?: "used" | "reserved" | "free" | "warn" | "danger" | "info";
  color?: string;
};
```

Segments render left to right in array order. `value` uses the same unit as `total`. `color` is a raw CSS color override for cases where product-specific categories need fixed colors.

## Props

- **segments**: `readonly QuotaSegment[]`. Required segmented usage list.
- **total**: `number`. Required denominator.
- **soft**: `number`. Optional dotted guideline as a fraction from `0` to `1`.
- **hard**: `number`. Optional solid guideline as a fraction from `0` to `1`. Defaults to `1`.
- **label**: `string`. Overrides the generated header label.
- **height**: `number`. Bar height in pixels. Defaults to `14`.
- **formatValue**: `(v: number) => string`. Formats totals and hover values. Defaults to one decimal place.
- **className**: custom class on the wrapper.

## Accessibility

The visible label should state the consumed value, total, and percentage. Do not rely on segment color alone; keep segment names visible in surrounding copy, a legend, table row, or the hover label.

For critical quotas, pair the bar with an explicit status badge such as `Healthy`, `Near limit`, or `Over quota`.

## Gotchas

- If `total` is `0`, all segment fractions render as `0`.
- Segment values can exceed `total`; the bar is clipped by the container, which can be useful for over-allocation but should be explained in surrounding UI.
- `hard` defaults to `1`, so the hard marker appears at the far right.
- Hover details are pointer-only. Important quota breakdowns should also exist in text.

## Related

- [`Progress`](./Progress.md) for single-value completion.
- [`ResourceMeter`](./ResourceMeter.md) for richer resource summaries.
- [`UsageRing`](./UsageRing.md) for compact circular quota indicators.
