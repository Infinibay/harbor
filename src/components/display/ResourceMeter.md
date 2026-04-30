# ResourceMeter

Stacked usage bars for CPU / RAM / Disk / network — anything with a
0..100 value and a per-row threshold. Bars recolor into amber/rose
as they cross their warning and danger thresholds. For a single
resource use `<Progress>`; for multi-segment quotas use `<QuotaBar>`.

## Import

```tsx
import { ResourceMeter } from "@infinibay/harbor/display";
```

## Example

```tsx
<ResourceMeter
  resources={[
    { label: "CPU",    value: 42, detail: "1.7 / 4 cores" },
    { label: "Memory", value: 68, detail: "5.4 / 8 GB" },
    { label: "Disk",   value: 92, detail: "184 / 200 GB", threshold: [70, 90] },
  ]}
/>
```

## Resource

```ts
{
  label: string;
  value: number;          // 0..100 (percent)
  detail?: string;        // e.g. "5.4 / 8 GB", shown right-aligned
  icon?: ReactNode;
  threshold?: [number, number]; // [warn, danger]. Default [70, 90]
}
```

## Props

- **resources** — `Resource[]`. Required.
- **layout** — `"rows" | "compact"`. `rows` (default) renders stacked
  full-width bars with `detail` on the right. `compact` renders a
  one-line wrap of inline chips, hiding `detail`.
- **className** — extra classes on the wrapper.

## Notes

- `value` is clamped to `0..100`; pass percentages, not absolute
  values.
- Thresholds are inclusive: `value >= warn` switches to amber,
  `value >= danger` switches to rose.
