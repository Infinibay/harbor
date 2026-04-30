# FieldSpacer

Invisible placeholder that occupies the same vertical footprint as a
`FormField` — label line, control row, optional message line — so a
column with no field still keeps neighbouring rows aligned. Use it
whenever a sparse grid would otherwise drift out of baseline. Inside
a `FieldRow`, the spacer collapses to a 3-row subgrid span; outside,
it sizes itself to a known control height.

## Import

```tsx
import { FieldSpacer } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FieldRow template="1fr 1fr 1fr">
  <FormField label="First name"><TextField /></FormField>
  <FormField label="Last name"><TextField /></FormField>
  <FieldSpacer />
</FieldRow>
```

## Props

- **hasLabel** — `boolean`. Reserve the label row above the control.
  Default `true`.
- **hasMessage** — `boolean`. Reserve the message row below the
  control. Default `false`.
- **match** — `"input" | "button-sm" | "button-md" | "button-lg" | "toggle"`.
  Match the height of a standard Harbor control. Default `"input"`
  (44px).
- **height** — `number`. Explicit pixel height. Overrides `match`.
- **className** — extra classes.

## Notes

- `aria-hidden` is applied so screen readers skip the placeholder.
- Inside a `FieldRow`, `hasLabel` / `hasMessage` / `match` are
  ignored — the spacer simply takes a 3-row subgrid column.
