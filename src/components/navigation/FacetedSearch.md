# FacetedSearch

Composite search experience: a query input + active-filter chips +
a saved-views dropdown + an embedded `<FilterPanel>`. Saved views
persist to `localStorage` so users can restore named filter combos.
Reach for `<FilterPanel>` directly when you only need facets, no
free-text search or saved views.

## Import

```tsx
import { FacetedSearch } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const [value, setValue] = useState<Record<string, string[]>>({});
const [query, setQuery] = useState("");

<FacetedSearch
  query={query}
  onQueryChange={setQuery}
  value={value}
  onChange={setValue}
  groups={[
    {
      id: "type",
      label: "Type",
      options: [
        { value: "issue", label: "Issue", count: 102 },
        { value: "pr", label: "Pull request", count: 48 },
      ],
    },
    {
      id: "label",
      label: "Label",
      options: [
        { value: "bug", label: "bug", count: 22 },
        { value: "feature", label: "feature", count: 18 },
      ],
    },
  ]}
/>
```

## Props

- **groups** — `readonly FilterGroup[]`. Required. Same schema as
  `<FilterPanel>` (see that doc).
- **value** — `Record<string, string[]>`. Required. Selected option
  values per group id.
- **onChange** — `(v: Record<string, string[]>) => void`. Required.
- **query** — `string`. Optional controlled query; falls back to
  internal state if omitted.
- **onQueryChange** — `(q: string) => void`.
- **storageKey** — `string`. Default `"harbor:faceted-search"`.
  `localStorage` key for saved views.
- **title** — `ReactNode`. Title for the embedded `<FilterPanel>`.
  Default `"Filters"`.
- **className** — extra classes on the wrapper.

## Notes

- "Save current view" prompts via `window.prompt` for a name and
  stores the current `value` + `query` under `storageKey`.
- "Clear all" wipes both `value` (to `{}`) and `query` (to `""`).
- Active filters render as removable fuchsia chips above the
  embedded panel.
