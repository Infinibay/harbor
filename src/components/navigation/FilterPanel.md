# FilterPanel

Faceted filter sidebar — a stack of collapsible groups with checkbox
or radio options, counts, and a "Clear all" affordance. Typical for
search results and catalog pages. Compose into `<FacetedSearch>`
when you also need a query input, chips, and saved views.

## Import

```tsx
import { FilterPanel } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const [value, setValue] = useState<Record<string, string[]>>({});

<FilterPanel
  value={value}
  onChange={setValue}
  onClear={() => setValue({})}
  groups={[
    {
      id: "status",
      label: "Status",
      options: [
        { value: "open", label: "Open", count: 14 },
        { value: "closed", label: "Closed", count: 38 },
        { value: "draft", label: "Draft", count: 3 },
      ],
    },
    {
      id: "owner",
      label: "Owner",
      type: "radio",
      options: [
        { value: "ana", label: "Ana", count: 7 },
        { value: "bruno", label: "Bruno", count: 4 },
      ],
    },
  ]}
/>
```

## Props

- **groups** — `FilterGroup[]`. Required. See shape below.
- **value** — `Record<string, string[]>`. Required. Selected option
  values keyed by `group.id`.
- **onChange** — `(v: Record<string, string[]>) => void`. Required.
- **onClear** — `() => void`. Renders the "Clear (n)" button when
  filters are applied.
- **title** — `ReactNode`. Default `"Filters"`.
- **className** — extra classes on the `<aside>`.

### `FilterGroup`

- **id** — `string`. Required.
- **label** — `string`. Required.
- **type** — `"checkbox" | "radio"`. Default `"checkbox"`.
- **options** — `FilterOption[]`. Each is
  `{ value: string; label: string; count?: number }`.
- **defaultExpanded** — `boolean`. Default `true`. Pass `false` to
  start collapsed.

## Notes

- Group expand/collapse state is internal — there is no controlled
  prop for it.
- Selected counts render as a small fuchsia pill next to the group
  label.
- A `radio` group toggles off when its active option is clicked
  again (returns to empty).
