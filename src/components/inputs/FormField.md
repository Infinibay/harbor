# FormField

A labelled form row that wraps any input with a label, optional
helper / error message, and required / optional markers. IDs and
`aria-describedby` are auto-wired and exposed via context, so a
native input child only has to call `useFormField()` to inherit
them. Adapts its layout to context: inside a `FieldRow` it becomes
a 3-row subgrid span; inside a `LabelLane` it snaps into the shared
label column; otherwise it stacks (or runs inline).

## Import

```tsx
import { FormField, useFormField } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FormField
  label="Email"
  required
  error={errors.email}
  helper="We'll send a verification link."
>
  <TextField type="email" />
</FormField>
```

## Props

- **label** — `ReactNode`. Field label.
- **helper** — `ReactNode`. Helper text below the control. Hidden
  when an error is showing.
- **error** — `ReactNode`. Error text. Animates in/out and replaces
  the helper.
- **required** — `boolean`. Adds the required marker (localized via
  `harbor.field.requiredMark`).
- **optional** — `boolean`. Adds an "optional" hint (localized via
  `harbor.field.optional`).
- **layout** — `"stacked" | "inline"`. Default `"stacked"` (label
  above). `"inline"` puts the label in a left column.
- **labelless** — `boolean`. Suppress the `htmlFor` association —
  useful when the child renders its own label (e.g. a Switch row).
- **className** — extra classes.
- **children** — the input.

## `useFormField()`

Returns `{ id, describedBy, invalid, required } | null`. Call it
inside a custom input to wire `id`, `aria-describedby`,
`aria-invalid`, and `aria-required` without prop drilling.

## Notes

- Error and helper text animate via Framer Motion's
  `AnimatePresence`.
- Inside a `FieldRow`, label/control/message are placed into the
  parent's 3-row subgrid so all sibling fields share baselines.
