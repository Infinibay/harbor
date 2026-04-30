# FieldRow

A horizontal row of form fields whose labels, controls, and messages
snap to the same three baselines across columns. Stacks vertically
below `md` (768px), then becomes a 3-row CSS subgrid at `md` and
above. Any `FormField`, `FieldSpacer`, or `FieldRow.Slot` inside
participates automatically — labels, inputs, and helper/error lines
all align across siblings without manual placeholders. Use it
whenever you'd otherwise reach for a `flex` row of inputs and end
up nudging margins by hand.

## Import

```tsx
import { FieldRow } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FieldRow template="1fr 1fr auto">
  <FormField label="First name"><TextField /></FormField>
  <FormField label="Last name" error="Required"><TextField /></FormField>
  <FieldRow.Action>
    <Button>Search</Button>
  </FieldRow.Action>
</FieldRow>
```

## Props

- **children** — `ReactNode`. Field primitives or `FieldRow.Slot` /
  `FieldRow.Action` nodes.
- **template** — `string`. Explicit `grid-template-columns` at the
  horizontal breakpoint (e.g. `"2fr 1fr auto"`). When omitted, every
  child gets an equal `1fr` column.
- **gapX** — `1 | 2 | 3 | 4 | 5 | 6 | 8`. Tailwind spacing units.
  Default `4` (16px).
- **reserveMessage** — `boolean`. Reserve the message row even when
  no child shows an error/helper, so later validation doesn't shift
  the layout. Default `true`.
- **controlAlign** — `"start" | "center" | "end"`. Vertical alignment
  for controls of differing heights (e.g. a `Textarea` next to a
  `TextField`). Default `"start"`.
- **className** — extra classes on the row.

## Props (`<FieldRow.Slot>`)

- **children** — `ReactNode`.
- **row** — `"control" | "label+control" | "control+message" | "full"`.
  Which subgrid rows to occupy. Default `"control"`.
- **align** — `"start" | "center" | "end" | "stretch"`. Vertical
  alignment within the cell. Default `"end"`.
- **span** — `1 | 2 | 3 | 4`. Column span. Default `1`.
- **className** — extra classes.

## Props (`<FieldRow.Action>`)

Shorthand for the common case of a button that should sit on the
input baseline of labelled siblings. Same props as `FieldRow.Slot`
minus `row` (which is forced to `"control"`).

## Notes

- A `useFieldRow()` hook is exported for custom field primitives that
  want to opt into subgrid mode.
- Row alignment relies on CSS subgrid; the layout collapses to a
  vertical stack on viewports below `md`.
