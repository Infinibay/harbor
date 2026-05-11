# FormField

`FormField` is the label, helper text, error text, and accessibility wrapper for
Harbor inputs. It lets form screens introduce one concept at a time: first the
field label, then the control, then optional guidance, then validation feedback
when something is wrong.

Use it around Harbor inputs and custom inputs whenever the control needs a
stable label or described-by text. It adapts inside `FieldRow` and `LabelLane`
so complex forms keep aligned baselines.

## Import

```tsx
import { FormField, useFormField } from "@infinibay/harbor/inputs";
```

## Basic Usage

Wrap the input and pass the user-facing label. The child input can consume the
generated id and description state through `useFormField`.

```tsx
<FormField
  label="Workspace name"
  required
  helper="This is visible to everyone in your organization."
>
  <TextField placeholder="Harbor Cloud" />
</FormField>
```

## Validation

Pass `error` when the field is invalid. The error replaces helper text so the
message does not compete with normal guidance.

```tsx
<FormField
  label="Billing email"
  error={emailError}
  helper="Invoices and receipts are sent here."
>
  <TextField type="email" />
</FormField>
```

## Custom Inputs

Custom controls should call `useFormField()` and apply the returned attributes.

```tsx
function CustomInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFormField();

  return (
    <input
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      aria-required={field?.required || undefined}
      {...props}
    />
  );
}
```

## Props

- `label`: visible field label.
- `helper`: secondary guidance below the control.
- `error`: validation message; replaces helper text.
- `required`: shows the localized required marker.
- `optional`: shows the localized optional hint.
- `layout`: `stacked` or `inline`.
- `labelless`: suppresses `htmlFor` when the child provides its own label.
- `className`: wrapper class override.
- `children`: the field control.

## Accessibility

`FormField` generates the field id and `aria-describedby` values, but the child
control must consume them. Harbor inputs already know how to do this; custom
inputs should use `useFormField()`.

Use `labelless` only for controls that already contain accessible labeling, such
as a switch row with its own text.

## Gotchas

Do not place multiple unrelated inputs inside one `FormField`. The generated id
is for one logical control. For grouped controls, use `FieldSet` or a composed
section with multiple `FormField` children.

When using `layout="inline"`, keep labels short enough to scan in a settings
page. Long explanatory copy belongs in `helper`.

## Related

- `Form` for submit orchestration.
- `FieldRow` for aligned multi-column fields.
- `LabelLane` for shared-label layouts.
- `FieldSet` and `FormSection` for grouping related fields.
