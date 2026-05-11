# FieldSpacer

`FieldSpacer` reserves the same vertical footprint as a form field without
rendering visible content. It is a layout utility for keeping form grids aligned
when one column intentionally has no control.

Use it in settings pages, admin forms, onboarding forms, and responsive form
grids where labels, controls, and helper/error rows need to line up across
columns.

## Import

```tsx
import { FieldSpacer, FormField, TextField } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
<div className="grid gap-4 md:grid-cols-3">
  <FormField label="First name">
    <TextField />
  </FormField>
  <FormField label="Last name">
    <TextField />
  </FormField>
  <FieldSpacer />

  <FormField label="Street">
    <TextField />
  </FormField>
  <FormField label="City">
    <TextField />
  </FormField>
  <FormField label="ZIP">
    <TextField />
  </FormField>
</div>
```

## Props

- **hasLabel** - `boolean`. Reserves a label row above the control. Default
  `true`.
- **hasMessage** - `boolean`. Reserves a helper/error row below the control.
  Default `false`.
- **match** - `"input" | "button-sm" | "button-md" | "button-lg" | "toggle"`.
  Uses a standard Harbor control height. Default `"input"`.
- **height** - `number`. Explicit control height in pixels. Overrides `match`.
- **className** - extra classes on the invisible wrapper.

## Layout Model

Outside `FieldRow`, `FieldSpacer` renders invisible label, control, and optional
message rows. Inside `FieldRow`, it detects row context and collapses to a
subgrid-friendly placeholder that occupies a column without drawing content.

The component is `aria-hidden` because it is purely structural.

## Accessibility

Because it renders no meaningful content, `FieldSpacer` should never replace a
real label, helper message, or disabled field explanation. Use it only for empty
space where no user-facing control exists.

If a field is unavailable, render the disabled field plus explanatory text rather
than hiding it behind a spacer.

## Gotchas

- Spacers can make forms look aligned while hiding poor grouping. Use them
  sparingly.
- `height` is pixels only.
- `match` is based on Harbor's standard control heights; custom controls may
  need an explicit `height`.
- In `FieldRow`, visible label/message reservation is delegated to the row
  subgrid behavior.

## Related

- `FormField` for labeled controls.
- `FieldRow` for aligned multi-column form rows.
- `FormSection` for larger settings groups.
- `ResponsiveGrid` for form layouts.
