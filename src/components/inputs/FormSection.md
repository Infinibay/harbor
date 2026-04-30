# FormSection

A titled section within a form: a heading, an optional description,
the fields, and an optional actions row at the bottom. Pass
`columns` for the GitHub / Vercel settings layout where the
title/description sit in a left column and the fields fill the
right. Use it for top-level form regions; reach for `FieldSet`
when the grouping needs a semantic legend.

## Import

```tsx
import { FormSection } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<FormSection
  title="Profile"
  description="This information is shown on your public card."
  columns
  actions={<Button type="submit">Save</Button>}
>
  <FormField label="Name"><TextField /></FormField>
  <FormField label="Bio"><Textarea rows={4} /></FormField>
</FormSection>
```

## Props

- **title** — `ReactNode`. Section heading.
- **description** — `ReactNode`. Subtitle under the heading.
- **columns** — `boolean`. Two-column layout — header left, fields
  right. Stacks vertically below `md`.
- **actions** — `ReactNode`. Footer row (typically save/cancel).
- **className** — extra classes on the `<section>`.
- **children** — fields or any composition.

## Notes

- Renders a real `<section>` with an `<h3>` heading.
- In `columns` mode the left column is `minmax(0,18rem)`; the right
  column gets the field stack and the actions row.
