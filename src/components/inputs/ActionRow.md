# ActionRow

`ActionRow` is the standard footer layout for form actions, dialogs, drawers, and setup panels. It handles alignment, spacing, optional top division, wrapping, and responsive stacking so each form does not invent its own button row.

Use it for actions, not fields. If you are arranging inputs, use `FieldRow`, `FormSection`, or your form layout primitives instead.

## Import

```tsx
import { ActionRow } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { ActionRow } from "@infinibay/harbor/inputs";

export function SettingsFooter() {
  return (
    <ActionRow align="end" stackBelow="sm" divide>
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </ActionRow>
  );
}
```

## Destructive Split

Use `align="between"` when a destructive or secondary action belongs on the opposite side of the footer.

```tsx
<ActionRow align="between" divide>
  <Button variant="danger">Delete workspace</Button>
  <div className="flex gap-3">
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </div>
</ActionRow>
```

## Props

- **children**: `ReactNode`. Usually Harbor `Button` elements or one grouped action cluster.
- **align**: `"start" | "center" | "end" | "between"`. Defaults to `"end"`.
- **gap**: `1 | 2 | 3 | 4 | 5 | 6`. Tailwind spacing unit between children. Defaults to `3`.
- **stackBelow**: `"sm" | "md" | "lg"`. Makes children full-width and vertical below the breakpoint.
- **reverseOnStack**: `boolean`. When stacked, reverses children so the primary action can land first. Defaults to `true`.
- **divide**: `boolean`. Adds a subtle top border and spacing for footer separation.
- **className**: custom class on the row.

## Accessibility

`ActionRow` does not change the semantics of its children. Use accessible buttons, keep destructive labels explicit, and avoid relying only on placement to communicate danger.

When stacking below a breakpoint, confirm the visual order still matches the expected keyboard order. `reverseOnStack` changes visual order with flex direction, not the DOM order.

## Gotchas

- `align="between"` works best with exactly two children: a left action and a grouped right cluster.
- `stackBelow` makes direct children full width. Wrap related actions in a child `<div>` if they should stay grouped.
- `ActionRow` is intentionally small. Do not put validation messages or explanations inside it; place those above the footer.

## Related

- [`Form`](./Form.md) for full form structure.
- [`FieldRow`](./FieldRow.md) for arranging form controls.
- [`Dialog`](../overlays/Dialog.md) and [`Drawer`](../overlays/Drawer.md) for surfaces that commonly use action footers.
