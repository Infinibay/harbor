# QuotaBar

Segmented horizontal bar for "used / reserved / free"-style quotas
with optional soft (dotted) and hard (solid) limit indicators.
Hovering a segment surfaces its label and value above the bar. For
single-value progress, use `<Progress>`; for multi-resource stacks,
use `<ResourceMeter>`.

## Import

```tsx
import { QuotaBar } from "@infinibay/harbor/display";
```

## Example

```tsx
<QuotaBar
  total={16}
  soft={0.7}
  segments={[
    { label: "frontend", value: 3.4, tone: "used" },
    { label: "backend",  value: 2.8, tone: "reserved" },
    { label: "data",     value: 2.1, tone: "info" },
  ]}
/>
```

## QuotaSegment

```ts
{
  label: string;
  value: number;
  tone?: "used" | "reserved" | "free" | "warn" | "danger" | "info";
  color?: string; // override raw CSS color
}
```

## Props

- **segments** — `readonly QuotaSegment[]`. Required. Rendered left to
  right in array order.
- **total** — `number`. Required. Same unit as each `segment.value`.
- **soft** — `number` in `0..1`. Optional dotted vertical guideline.
- **hard** — `number` in `0..1`. Optional solid vertical guideline.
  Only drawn when `< 1`. Default `1`.
- **label** — `string`. Override the auto-generated header label
  (`"<consumed> / <total> · <pct>%"`).
- **height** — `number`. Bar height in px. Default `14`.
- **formatValue** — `(v: number) => string`. How values are rendered
  in the label and tooltip. Default `v.toFixed(1)`.
- **className** — extra classes on the wrapper.

## Notes

- Each segment animates in with a small staggered spring on mount.
- A segment whose `value` would exceed `total` simply overflows past
  the hard line — useful to visualize over-allocation.
