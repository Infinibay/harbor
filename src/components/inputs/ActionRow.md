# ActionRow

Horizontal row for the OK / Cancel pair at the bottom of a form or
dialog. Handles alignment, gap, and responsive stacking so each form
doesn't reinvent its own footer. Reach for `<FieldRow>` to lay out
form *fields* side by side — `<ActionRow>` is for *buttons*.

## Import

```tsx
import { ActionRow } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<ActionRow align="end" stackBelow="sm" divide>
  <Button variant="ghost">Cancel</Button>
  <Button>Save changes</Button>
</ActionRow>

// Destructive split — delete on the left, primary on the right:
<ActionRow align="between">
  <Button variant="danger">Delete workspace</Button>
  <div className="flex gap-3">
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </div>
</ActionRow>
```

## Props

- **align** — `"start" | "center" | "end" | "between"`. Default
  `"end"`. `"between"` pushes the first child far left and groups the
  rest on the right.
- **gap** — `1 | 2 | 3 | 4 | 5 | 6`. Tailwind spacing units between
  buttons. Default `3` (12px).
- **stackBelow** — `"sm" | "md" | "lg"`. Stack vertically (each child
  full-width) below this breakpoint. Default `undefined`.
- **reverseOnStack** — `boolean`. When stacked, reverse children so
  the primary action lands on top. Default `true`.
- **divide** — `boolean`. Adds a subtle top border + padding — the
  standard form-footer treatment. Default `false`.
- **children** — `ReactNode`. Usually `<Button>` elements.
- **className** — extra classes on the row.

## Notes

- The row is `flex-wrap`, so very narrow viewports won't clip even
  without `stackBelow`.
- `align="between"` only makes sense with two children (or a single
  child + a grouped `<div>`).
