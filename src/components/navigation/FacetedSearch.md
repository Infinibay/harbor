# FacetedSearch

`FacetedSearch` combines a search query, active-filter chips, saved views, and a `FilterPanel`. It is designed for operational lists where users repeatedly return to the same filtered states: incidents, hosts, users, invoices, logs, deployments, and support queues.

The query and filters are controlled by the parent. Saved views are stored locally in `localStorage`.

## Import

```tsx
import { FacetedSearch, type SavedView } from "@infinibay/harbor/navigation";
import type { FilterGroup } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
import { useMemo, useState } from "react";
import { FacetedSearch } from "@infinibay/harbor/navigation";

export function DeploymentFilters({ deployments }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const visible = useMemo(
    () => filterDeployments(deployments, query, filters),
    [deployments, query, filters],
  );

  return (
    <>
      <FacetedSearch
        title="Deployment filters"
        query={query}
        onQueryChange={setQuery}
        value={filters}
        onChange={setFilters}
        groups={[
          {
            id: "status",
            label: "Status",
            options: [
              { value: "healthy", label: "Healthy" },
              { value: "failed", label: "Failed" },
            ],
          },
        ]}
      />
      <DeploymentTable rows={visible} />
    </>
  );
}
```

## Saved Views

Clicking `Views` opens a small dropdown. `Save current view` prompts for a name and stores `{ value, query }` in `localStorage` under `storageKey`.

Applying a view calls `onChange(view.value)` and restores `query` through `onQueryChange` when provided.

## Props

- **groups**: `readonly FilterGroup[]`. Same schema as `FilterPanel`.
- **value**: `Record<string, string[]>`. Controlled selected facets.
- **onChange**: `(v: Record<string, string[]>) => void`.
- **query**: `string`. Optional controlled query.
- **onQueryChange**: `(q: string) => void`. Optional controlled query callback.
- **storageKey**: `string`. Saved-view localStorage key. Defaults to `"harbor:faceted-search"`.
- **title**: `ReactNode`. Passed to `FilterPanel`.
- **className**: custom class on the wrapper.

## Accessibility

The search input is labelled, saved-view controls are buttons, and active chips have remove buttons with labels. Keep result counts near the filtered list so users understand the effect of filter changes.

## Gotchas

- Saved views are browser-local. They are not shared across accounts or devices.
- `window.prompt` is used for naming saved views. Replace the component or wrap the flow if your product needs a custom dialog.
- The component clears query and filters together through `Clear all`.
- Filtering the actual data remains your responsibility.

## Related

- [`FilterPanel`](./FilterPanel.md) for the underlying facet controls.
- [`DataTable`](../data/DataTable.md) for filtered result sets.
- [`SearchField`](../inputs/SearchField.md) for simpler search-only surfaces.
