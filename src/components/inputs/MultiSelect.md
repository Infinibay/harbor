# MultiSelect

`MultiSelect` lets users choose several values from a searchable option list. Selected values appear as removable chips inside the field, while the option menu renders in a portal so it can escape clipped panels and scroll containers.

Use it for teams, labels, tags, roles, environments, feature flags, regions, and any short controlled list where multiple values are valid.

## Import

```tsx
import { MultiSelect, type MultiSelectOption } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { MultiSelect, type MultiSelectOption } from "@infinibay/harbor/inputs";

const options: MultiSelectOption[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "infra", label: "Infrastructure" },
  { value: "design", label: "Design" },
];

export function TeamPicker() {
  const [value, setValue] = useState(["frontend", "design"]);

  return (
    <MultiSelect
      label="Teams"
      placeholder="Pick teams"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
```

## Props

- **options** - `MultiSelectOption[]`. Required available choices.
- **value** - `string[]`. Controlled selected option values. Default `[]`.
- **onChange** - `(value: string[]) => void`. Called when an option or chip remove button is clicked.
- **label** - `string`. Optional field label.
- **placeholder** - `string`. Text shown when nothing is selected. Default `"Select options..."`.
- **className** - extra classes on the wrapper.

## Option Model

```ts
type MultiSelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};
```

`value` is what your form stores. `label` is what the user sees. `icon` appears in the option menu but not in the selected chip.

## Behavior

Clicking the field opens a portal menu positioned under the trigger. The menu repositions on window resize and scroll. The search input filters by case-insensitive label match. Selecting an option toggles it in the selected value array. Clicking the chip `x` removes that value without opening the menu.

## Accessibility

The field and menu are built from buttons and an input, but the component does not implement full combobox/listbox ARIA semantics or keyboard navigation between options. For high-volume or accessibility-critical forms, consider extending it with roles, active descendant state, and arrow-key support.

## Gotchas

- This is controlled. If `onChange` does not update `value`, selection will appear unchanged.
- Filtering searches labels only.
- The menu width is copied from the trigger.
- There is no max selection limit built in.

## Related

- `TagInput` for free-form tag creation.
- `Select` for single-choice lists.
- `FilterBar` for faceted filtering surfaces.
