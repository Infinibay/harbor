# FieldSet

Semantic `<fieldset>` for grouping related `FormField`s — an address
block, notification preferences, a credentials pair. Renders the
legend as an inset chip over a hairline border. Use this when the
fields share a label of their own; reach for `FormSection` instead
when the grouping is a top-level form region with a heading.

## Import

```tsx
import { FieldSet } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FieldSet legend="Shipping address" description="Where should we send it?">
  <FormField label="Street"><TextField /></FormField>
  <FieldRow template="2fr 1fr">
    <FormField label="City"><TextField /></FormField>
    <FormField label="ZIP"><TextField /></FormField>
  </FieldRow>
</FieldSet>
```

## Props

- **legend** — `ReactNode`. Optional inset chip rendered over the
  border.
- **description** — `ReactNode`. Optional subtitle below the legend.
- **children** — `ReactNode`. Fields, rows, or any composition.
- **className** — extra classes on the `<fieldset>`.

## Notes

- Renders a real `<fieldset>` / `<legend>` pair, so screen readers
  announce the group label correctly.
- Children are stacked vertically with a 16px gap; nest a `FieldRow`
  inside for horizontal layouts.
