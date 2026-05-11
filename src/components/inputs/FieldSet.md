# FieldSet

`FieldSet` groups related form controls inside a semantic `<fieldset>`. Use it for addresses, notification preferences, billing contact details, permission groups, advanced settings, scheduling rules, and any form area where several fields answer one larger question.

Harbor renders the bordered group, optional legend chip, optional description, and consistent field spacing. The browser receives real fieldset semantics.

## Import

```tsx
import { FieldSet, FormField, TextField } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<FieldSet
  legend="Shipping address"
  description="Where should invoices and hardware be sent?"
>
  <FormField label="Street">
    <TextField value={street} onChange={(event) => setStreet(event.target.value)} />
  </FormField>
  <FormField label="City">
    <TextField value={city} onChange={(event) => setCity(event.target.value)} />
  </FormField>
</FieldSet>
```

Use multiple fieldsets to make long forms easier to scan:

```tsx
<Form>
  <FieldSet legend="Profile">{profileFields}</FieldSet>
  <FieldSet legend="Security">{securityFields}</FieldSet>
</Form>
```

## Props

- **legend** - optional `ReactNode` rendered as the fieldset legend.
- **description** - optional `ReactNode` rendered below the legend.
- **children** - required `ReactNode`.
- **className** - optional string merged onto the `<fieldset>`.

## Form Model

`FieldSet` does not validate fields, submit data, or manage state. Use it to express grouping, then keep validation in your form library or app state. It pairs naturally with `FormField`, `FieldRow`, `Checkbox`, `Switch`, `TextField`, and `Select`.

The legend should name the group. The description should explain constraints, consequences, or why the fields are needed.

## Accessibility

Because the root is a real `<fieldset>`, the legend can help assistive technology users understand grouped controls. Prefer a legend for meaningful groups. Do not use `FieldSet` as a generic card when there are no form controls inside.

Keep descriptions short. Long instructional text is often better above the form section.

## Gotchas

- Do not nest fieldsets deeply; it becomes difficult to scan.
- Avoid using fieldset borders purely for visual separation outside forms.
- If a group has one control only, a normal `FormField` is usually enough.
- The component does not automatically connect `description` with `aria-describedby`.

## Related

- `Form` and `FormSection` for larger form structure.
- `FormField` for individual labelled controls.
- `FieldRow` for settings-style rows.
- `Checkbox` and `Switch` for grouped preferences.
