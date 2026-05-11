# ToggleGroup

`ToggleGroup` is a segmented control for choosing one or several values from a short fixed set. It works well for view modes, text alignment, chart granularity, editor tools, and compact filters.

Use it when the options should remain visible. If the list is long, dynamic, or search-heavy, use `Select`, `MultiSelect`, or `Combobox` instead.

## Import

```tsx
import { ToggleGroup, type ToggleItem } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { ToggleGroup, type ToggleItem } from "@infinibay/harbor/inputs";

const viewItems: ToggleItem[] = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "timeline", label: "Timeline" },
];

export function ViewModePicker() {
  const [view, setView] = useState("grid");

  return (
    <ToggleGroup
      items={viewItems}
      value={view}
      onChange={(next) => setView(next as string)}
    />
  );
}
```

## Multiple Selection

```tsx
<ToggleGroup
  multiple
  defaultValue={["errors", "warnings"]}
  items={[
    { value: "errors", label: "Errors" },
    { value: "warnings", label: "Warnings" },
    { value: "info", label: "Info" },
  ]}
  onChange={(next) => setVisibleLevels(next as string[])}
/>
```

Single mode returns a `string`; multiple mode returns a `string[]`.

## Props

- **items**: `ToggleItem[]`. Required. Each item is `{ value, label?, icon?, ariaLabel? }`.
- **value**: `string | string[]`. Controlled selected value.
- **defaultValue**: `string | string[]`. Initial uncontrolled selection.
- **onChange**: `(v: string | string[]) => void`. Called after a toggle.
- **multiple**: `boolean`. Enables multi-select behavior.
- **size**: `"sm" | "md"`. Defaults to `"md"`.
- **className**: custom class on the wrapper.

## Accessibility

Buttons expose `aria-pressed`. Provide `ariaLabel` for icon-only items; otherwise the component derives a label from a string `label` or from `value`.

Keep the option count small and labels clear. A segmented control should be instantly scannable without opening another surface.

## Gotchas

- In single mode, the selected background animates with a shared Framer Motion `layoutId`.
- In multiple mode, each pressed item gets its own background instead of a sliding indicator.
- If you pass `value`, you own the state. Forgetting to update it in `onChange` makes the control look frozen.
- The component intentionally does not enforce radio-group keyboard roving. Use a native radio group when strict form semantics matter more than compact segmented UI.

## Related

- [`SegmentedControl`](./SegmentedControl.md) for a similar single-choice primitive.
- [`Select`](./Select.md) for long option sets.
- [`MultiSelect`](./MultiSelect.md) for many visible filters.
