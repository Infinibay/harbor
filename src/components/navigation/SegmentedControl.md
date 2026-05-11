# SegmentedControl

`SegmentedControl` lets users switch between a small set of mutually exclusive
views, filters, or modes without leaving the current context. It works well for
time ranges, density options, editor modes, billing intervals, and dashboard
breakdowns where every option has similar weight.

Use it when the choices are few and always visible. For long option sets, async
data, or choices that need descriptions, use `Select` or `Tabs` instead.

## Import

```tsx
import { SegmentedControl } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
const [range, setRange] = useState("week");

<SegmentedControl
  value={range}
  onChange={setRange}
  items={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ]}
/>;
```

Use the selected value to drive the actual content:

```tsx
<SegmentedControl value={range} onChange={setRange} items={rangeItems} />
<TimeSeriesChart series={seriesByRange[range]} />
```

## Props

- **items** - `SegmentedItem[]`. Required. Each item needs a stable `value` and
  visible `label`.
- **value** - `string`. Controlled selected value.
- **defaultValue** - `string`. Initial uncontrolled value. Defaults to the first
  item value.
- **onChange** - `(value: string) => void`. Called whenever the user selects an
  item.
- **size** - `"sm" | "md"`. Controls height and text size. Default `"md"`.
- **className** - extra classes on the root control.

## SegmentedItem

```ts
type SegmentedItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
};
```

`label` can be text or a compact node. `icon` is rendered before the label and is
best for mode switches where users recognize the icon after a few uses.

## Controlled State

Use `value` when the selected mode is part of application state, URL state, or a
form. Use `defaultValue` for local demos and simple widgets where the selection
does not need to be controlled by the parent.

When `value` is provided, Harbor does not update internal state. Your `onChange`
handler must update the parent value for the active segment to move.

## Accessibility

Each option is a real button, so it is reachable by keyboard and announces as a
button to assistive technology. Keep labels short, visible, and specific. Avoid
icon-only segments unless the surrounding UI provides a clear accessible label.

If changing the segment replaces major page content, keep the heading or region
label nearby so screen-reader users understand what changed.

## Gotchas

- Empty `items` renders an empty container. Guard before rendering when the item
  list is loaded asynchronously.
- This is not a router. If segments represent pages, sync the selected value to
  your route or use navigation components.
- The animated active background uses Framer Motion layout IDs. Keep item values
  stable across renders to avoid jarring movement.

## Related

- `Tabs` for larger content panels.
- `Select` for longer option lists.
- `ButtonGroup` for grouped actions that are not mutually exclusive modes.
- `TimeSeriesChart` for range-driven dashboard views.
