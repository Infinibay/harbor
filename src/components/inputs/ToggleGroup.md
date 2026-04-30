# ToggleGroup

Segmented control for picking one (or several) values from a small,
fixed set — text alignment, view modes, day-of-week filters. The
selection indicator slides between buttons via Framer Motion's shared
`layoutId`. Reach for `ToggleGroup` instead of `<Radio>` when the
options are visual / icon-led and short; reach for `<MultiSelect>`
when the list is long enough to need a popover.

## Import

```tsx
import { ToggleGroup } from "@infinibay/harbor/inputs";
import type { ToggleItem } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const items: ToggleItem[] = [
  { value: "left", label: "Left", icon: <AlignLeftIcon /> },
  { value: "center", label: "Center", icon: <AlignCenterIcon /> },
  { value: "right", label: "Right", icon: <AlignRightIcon /> },
];

<ToggleGroup items={items} defaultValue="left" />
<ToggleGroup items={items} multiple defaultValue={["left", "right"]} />
```

## Props

- **items** — `ToggleItem[]`. Required. Each item has `{ value,
  label?, icon?, ariaLabel? }`.
- **value** / **defaultValue** — `string | string[]`. String for
  single mode, array for `multiple`.
- **onChange** — `(v: string | string[]) => void`. Type matches the
  current mode.
- **multiple** — `boolean`. Switch from radio-style to multi-select
  toggle behavior.
- **size** — `"sm" | "md"`. Default `"md"`.
- **className** — extra classes on the wrapper.

## Notes

- In single mode, the selected pill animates between buttons with
  `layoutId` — items are visually one continuous control.
- In multi mode each on-button gets its own background; there is no
  sliding indicator.
- Each button derives `aria-label` from `ariaLabel` → `label` →
  `value` in that order.
