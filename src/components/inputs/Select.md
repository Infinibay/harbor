# Select

`Select` is Harbor's dropdown for choosing one value from a known option list.
It supports controlled and uncontrolled state, compact and standard sizes, option
descriptions, icons, disabled options, keyboard navigation, and portal-based
menus.

Use it for bounded choices. Use `Combobox` when the user needs search or custom
input.

## Import

```tsx
import { Select } from "@infinibay/harbor/inputs";
```

## Basic Usage

Use `defaultValue` for local forms or demos.

```tsx
<Select
  label="Environment"
  defaultValue="production"
  options={[
    { value: "preview", label: "Preview", description: "Ephemeral review apps" },
    { value: "production", label: "Production", description: "Customer traffic" },
  ]}
/>
```

## Controlled Usage

Use `value` and `onChange` when selection drives application state.

```tsx
<Select
  value={region}
  onChange={setRegion}
  placeholder="Choose region"
  options={regions.map((region) => ({ value: region.id, label: region.name }))}
/>
```

## Menu Width And Size

Use `size="sm"` for toolbars. `menuWidth` controls dropdown width.

```tsx
<Select size="sm" menuWidth="auto" options={branchOptions} />
```

## Props

- `options`: required option array.
- `value`: controlled selected value.
- `defaultValue`: initial uncontrolled value.
- `onChange`: called with selected value.
- `placeholder`: trigger placeholder.
- `label`: optional visible label.
- `size`: `sm` or `md`.
- `menuWidth`: `trigger`, `auto`, number, or CSS length.
- `className`: wrapper class override.
- `disabled`: disables the trigger.

Options include `value`, `label`, optional `description`, optional `icon`, and
optional `disabled`.

## Accessibility

The trigger is keyboard operable. Arrow keys move focus, Enter selects, and
Escape closes. Use a visible `label` or wrap the control in `FormField` when the
meaning is not obvious from context.

## Gotchas

`Select` is single-value. For multiple values, use `MultiSelect`.

The menu is rendered in a portal and positioned against the trigger. Test inside
scroll containers and modals where stacking context matters.

## Related

- `Combobox` for searchable options.
- `MultiSelect` for multiple selected values.
- `FormField` for labels and validation.
- `SegmentedControl` for very small option sets.
