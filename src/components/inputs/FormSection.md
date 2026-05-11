# FormSection

`FormSection` groups related fields inside a larger form. It provides an
optional title, description, action area, and a two-column settings layout where
section copy sits beside the controls.

Use it for account settings, billing configuration, profile forms, workspace
preferences, deployment settings, and admin forms that need clear grouping.

## Import

```tsx
import { FormSection, FormField, TextField } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<FormSection
  title="Profile"
  description="This information is visible to your team."
  actions={<Button>Save changes</Button>}
>
  <FormField label="Name">
    <TextField value={name} onChange={(event) => setName(event.target.value)} />
  </FormField>
  <FormField label="Email">
    <TextField value={email} onChange={(event) => setEmail(event.target.value)} />
  </FormField>
</FormSection>
```

Use `columns` for settings pages where explanatory copy should stay on the left:

```tsx
<FormSection title="Danger zone" description="Permanent workspace actions." columns>
  <Button variant="destructive">Delete workspace</Button>
</FormSection>
```

## Props

- **title** - `ReactNode`. Optional section heading.
- **description** - `ReactNode`. Optional helper copy under the title.
- **columns** - `boolean`. Uses a two-column layout on medium screens and above.
- **actions** - `ReactNode`. Optional action row rendered after the fields.
- **className** - extra classes on the section wrapper.
- **children** - `ReactNode`. Required. Usually `FormField` children.

## Layout Model

Without `columns`, the section stacks header, fields, and actions vertically.
With `columns`, the header occupies a left column and the controls occupy the
right column, collapsing back to one column on small screens.

The `actions` slot is intentionally below the fields. Put submit, reset, or
danger actions there when they belong to the whole section rather than one
individual input.

## Accessibility

`FormSection` renders a semantic `section` and uses an `h3` for the title. Keep
heading order consistent with the surrounding page. Each actual input still
needs its own label through `FormField` or the input component's label prop.

Descriptions should explain consequences or constraints, not repeat the title.

## Gotchas

- `FormSection` does not provide form state or validation. Pair it with your
  form library or controlled React state.
- Do not put unrelated fields in one section just because they fit visually.
  Group by user intent.
- `actions` is a section-level slot. Use input-level adornments or buttons for
  field-specific actions.

## Related

- `Form` for complete form structure.
- `FormField` for individual field labels and errors.
- `FieldSet` for compact grouped controls.
- `Button` for section actions.
