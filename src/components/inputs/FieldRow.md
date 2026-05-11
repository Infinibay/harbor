# FieldRow

`FieldRow` aligns multiple form fields across shared label, control, and message
baselines. It solves the common settings-page problem where one row contains
several related inputs and errors should not make neighboring controls jump.

Use it with `FormField`, `FieldSpacer`, and action slots. Below `md` it stacks;
at `md` and above it becomes a CSS subgrid.

## Import

```tsx
import { FieldRow, FormField } from "@infinibay/harbor/inputs";
```

## Basic Usage

Each `FormField` inside the row participates automatically.

```tsx
<FieldRow template="1fr 1fr auto">
  <FormField label="First name">
    <TextField />
  </FormField>
  <FormField label="Last name" error={errors.lastName}>
    <TextField />
  </FormField>
  <FieldRow.Action>
    <Button>Search</Button>
  </FieldRow.Action>
</FieldRow>
```

## Slots

Use `FieldRow.Slot` for custom content that should occupy one or more subgrid
rows.

```tsx
<FieldRow.Slot row="control+message" align="stretch">
  <InlinePreview />
</FieldRow.Slot>
```

## Props

- `children`: row content.
- `template`: explicit grid-template-columns at desktop widths.
- `gapX`: horizontal gap scale.
- `reserveMessage`: reserves validation/helper row height.
- `controlAlign`: `start`, `center`, or `end`.
- `className`: wrapper class override.

`FieldRow.Slot` accepts `row`, `align`, `span`, `children`, and `className`.

## Accessibility

`FieldRow` is layout-only. Accessibility comes from the fields inside it. Use
`FormField` around each control so labels, helper text, errors, and ARIA wiring
stay correct.

## Gotchas

Subgrid alignment only activates at the desktop breakpoint. Test long labels and
errors on mobile where the row stacks.

When `reserveMessage={false}`, validation errors can shift the row height.

## Related

- `FormField` for labels and errors.
- `FieldSpacer` for intentional empty grid cells.
- `LabelLane` for shared-label settings layouts.
- `FormSection` for larger groups.
