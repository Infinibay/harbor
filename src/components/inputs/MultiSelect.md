# MultiSelect

Dropdown for picking multiple values from a finite list, with an
inline search input and chip-style selected items. Use this when the
option list is short-to-medium (single-digit to a few hundred) and
the user needs to pick more than one. For free-form tags use
`TagInput`; for a single value use `Select`.

## Import

```tsx
import { MultiSelect } from "@infinibay/harbor/inputs";
import type { MultiSelectOption } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const options: MultiSelectOption[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "infra", label: "Infrastructure" },
];

const [value, setValue] = useState<string[]>(["frontend"]);

<MultiSelect
  label="Teams"
  options={options}
  value={value}
  onChange={setValue}
/>
```

## Props

- **options** — `MultiSelectOption[]`. Required. Each option has
  `{ value, label, icon? }`.
- **value** — `string[]`. Selected option values. Default `[]`.
- **onChange** — `(v: string[]) => void`.
- **label** — `string`. Optional caption above the trigger.
- **placeholder** — `string`. Shown when nothing is selected.
  Default `"Select options…"`.
- **className** — extra classes on the wrapper.

## Notes

- The popover portals to `document.body` and re-positions on scroll
  and resize, so it escapes overflow-hidden parents.
- Click outside dismisses the popover; click the × on a chip to
  unselect without opening it.
- Filtering matches the option's `label`, case-insensitive.
