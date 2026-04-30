# SegmentedControl

iOS-style segmented picker: a small inline group of mutually exclusive
options with a sliding white pill behind the active one. Use it for
short, flat option sets (2–5 items) where all choices should stay
visible — date ranges, view modes, units. For panel-level navigation
with content, use `<Tabs>` instead.

## Import

```tsx
import { SegmentedControl } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

<SegmentedControl items={items} defaultValue="week" onChange={setRange} />
```

## Props

- **items** — `SegmentedItem[]`. Required. Each item is
  `{ value, label, icon? }`.
- **value** — `string`. Controlled value.
- **defaultValue** — `string`. Uncontrolled initial value. Falls back
  to the first item.
- **onChange** — `(v: string) => void`.
- **size** — `"sm" | "md"`. Default `"md"`.
- **className** — extra classes on the wrapper.

## Notes

- The active pill animates between segments via `framer-motion`
  `layoutId`.
- Active text uses dark foreground over the white pill; inactive is
  translucent white.
