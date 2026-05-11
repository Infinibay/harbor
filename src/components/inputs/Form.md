# Form

`Form` is a semantic `<form>` with Harbor's default vertical rhythm. It does not own
validation, submission state, or field registration. It gives your form sections, fields,
rows, and actions a consistent container.

Use it for settings pages, checkout steps, profile editors, admin forms, onboarding flows,
and any route where native form behavior still matters. Pair it with `FormSection`,
`FieldSet`, `FormField`, `FieldRow`, and the input components that match your data.

## Import

```tsx
import { Form, FormField, FormSection } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<Form
  onSubmit={(event) => {
    event.preventDefault();
    saveProfile();
  }}
>
  <FormSection title="Profile" description="Public information for your team.">
    <FormField label="Name" required>
      <TextField value={name} onChange={(event) => setName(event.target.value)} />
    </FormField>
    <FormField label="Bio" helper="Keep it short and useful.">
      <Textarea rows={4} value={bio} onChange={(event) => setBio(event.target.value)} />
    </FormField>
  </FormSection>
</Form>
```

## Composition Model

`Form` forwards every native form prop and ref, then applies a flex column with Harbor spacing.
That makes it compatible with browser submission, React handlers, server actions, and form
libraries.

Keep field-level labeling and errors in `FormField`. Use `FormSection` for titled regions and
`FieldSet` when a group needs a real legend. Use `FieldRow` only when the fields belong on the
same scan line.

## Props

`FormProps` extends `FormHTMLAttributes<HTMLFormElement>`.

- **onSubmit** - native form submit handler.
- **action** / **method** / **encType** - standard HTML form attributes.
- **noValidate** - disable browser validation when your app owns validation.
- **className** - merged with Harbor's default full-width vertical layout.
- **ref** - forwarded to the underlying `<form>`.

## Accessibility

Because this is a real `<form>`, submit buttons, Enter key behavior, browser validation, and
assistive technology expectations all work normally. The form itself does not create labels;
each input still needs a label through `FormField`, `FieldSet`, native labels, or component
props.

Use one clear submit action per form region. If a form has destructive secondary actions,
separate them visually and semantically from the save path.

## Gotchas

- `Form` does not prevent default submit. Call `event.preventDefault()` when you handle
  submission in React.
- It does not track dirty, touched, loading, or error state. Keep that in your app or form
  library.
- Do not put unrelated workflows in one large form; split them into sections or separate forms.
- Nested forms are invalid HTML. Use sections inside one form instead.

## Related

- `FormSection` for titled regions.
- `FieldSet` for semantic field groups.
- `FormField` for labels, helper text, and errors.
- `FieldRow` and `FieldSpacer` for aligned form grids.
