# FilterPanel

`FilterPanel` is a faceted sidebar for search results, catalog pages, admin
lists, audit logs, and documentation indexes. It groups filter options, supports
checkbox and radio behavior, shows selected counts, and exposes a clear-all
action.

Use it when filters are persistent and visible. Use `FacetedSearch` when search
input, chips, and filters need to live in one compact control.

## Import

```tsx
import { FilterPanel } from "@infinibay/harbor/navigation";
```

## Basic Usage

The component is controlled. Keep selected values in state and pass the full
record back through `onChange`.

```tsx
const [filters, setFilters] = useState<Record<string, string[]>>({});

<FilterPanel
  groups={[
    {
      id: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active", count: 18 },
        { value: "paused", label: "Paused", count: 4 },
      ],
    },
  ]}
  value={filters}
  onChange={setFilters}
  onClear={() => setFilters({})}
/>
```

## Radio Groups

Set `type="radio"` when one option should be active at a time.

```tsx
{
  id: "sort",
  label: "Sort",
  type: "radio",
  options: [
    { value: "recent", label: "Most recent" },
    { value: "errors", label: "Most errors" },
  ],
}
```

## Props

- `groups`: required filter groups.
- `value`: controlled selected values by group id.
- `onChange`: called with the next value record.
- `onClear`: optional clear-all action.
- `title`: panel heading; defaults to `"Filters"`.
- `className`: wrapper class override.

Each group includes `id`, `label`, optional `type`, `options`, and optional
`defaultExpanded`. Each option includes `value`, `label`, and optional `count`.

## Accessibility

Group headers are buttons with expanded state. Options are native checkboxes or
radio buttons, so keyboard and screen reader behavior comes from the platform.

Keep option labels concrete. Counts help scanning, but they should not be the
only explanation of what an option means.

## Gotchas

`onChange` receives the whole filter record, not only the changed group. Replace
your state with the value passed by the component.

For radio groups, clicking the active option clears that group. This is useful
for filter panels where every filter is optional.

## Related

- `FacetedSearch` for search plus chips.
- `DataTable` for filterable admin rows.
- `SearchField` for standalone query input.
- `Sidebar` for navigation rather than filtering.
