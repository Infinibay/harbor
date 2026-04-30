# TextField

Single-line text input with a floating label, optional leading icon,
suffix slot, and inline valid / error affordances. Integrates with
`<FormField>` for shared `id` / `aria-describedby` / `required` wiring
when nested inside a form. Use `TextField` for the bulk of single-line
inputs (email, name, URL); reach for `<NumberField>`, `<SearchField>`,
or `<SecretsInput>` when those purpose-built variants fit better.

## Import

```tsx
import { TextField } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<TextField
  label="Email"
  placeholder="you@company.com"
  hint="We'll send a verification link."
  icon={<MailIcon />}
  error={errors.email}
  valid={!!touched.email && !errors.email}
/>
```

## Props

- **label** — `string`. Animates from inline placeholder to floating
  caption on focus / fill.
- **hint** — `string`. Helper text shown below the field.
- **error** — `string`. When set, swaps `hint` for the error message
  and tints the border rose.
- **valid** — `boolean`. Renders the animated check affordance.
- **icon** — `ReactNode`. Leading icon, rendered inside the box.
- **suffix** — `ReactNode`. Trailing slot (e.g. unit, action button).
- **value** / **defaultValue** / **onChange** — controlled or
  uncontrolled string state.
- Plus all standard `HTMLInputElement` attributes except `size`.

## Notes

- Forwards `ref` to the underlying `<input>`.
- When wrapped in `<FormField>`, the field's `id`,
  `aria-describedby`, `aria-required`, and `aria-invalid` are wired
  automatically via `useFormField()`.
- Don't pass both `error` and `valid` — `error` wins.
