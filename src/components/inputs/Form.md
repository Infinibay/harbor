# Form

A semantic `<form>` element with default vertical spacing — the
shell you compose all of Harbor's form primitives into. Pair it
with `FormSection` for titled regions, `FieldSet` for grouped
fields, `FieldRow` for horizontal layouts, `FieldSpacer` to keep
sparse grids aligned, and `FormField` to wrap individual inputs
with label, helper, and error wiring. Forwards all native
`<form>` attributes (`onSubmit`, `action`, `method`, etc.) and
accepts a forwarded ref.

## Import

```tsx
import { Form } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<Form onSubmit={(e) => { e.preventDefault(); save(); }}>
  <FormSection title="Profile" description="Public info on your card.">
    <FormField label="Name" required>
      <TextField />
    </FormField>
    <FormField label="Bio" helper="Markdown is supported.">
      <Textarea rows={4} />
    </FormField>
  </FormSection>

  <FieldSet legend="Notifications">
    <FormField label="Email digest"><Switch /></FormField>
  </FieldSet>

  <FieldRow template="1fr 1fr">
    <FormField label="City"><TextField /></FormField>
    <FormField label="ZIP"><TextField /></FormField>
  </FieldRow>
</Form>
```

## Props

All standard `<form>` HTML attributes (`onSubmit`, `action`,
`method`, `noValidate`, `id`, `className`, …). Plus:

- **className** — merged on top of the default
  `flex flex-col gap-6 w-full min-w-0`.

## Related

- `FormSection` — titled section with optional left-column header
  layout.
- `FieldSet` — semantic group with a legend chip.
- `FieldRow` — horizontal row of fields with subgrid alignment.
- `FieldSpacer` — invisible placeholder for sparse grids.
- `FormField` — labelled wrapper around any input with auto-wired
  ARIA.

## Notes

- `Form` is a thin wrapper — it intentionally doesn't bake in
  validation state or submission tracking. Use any form library
  (or none) underneath.
