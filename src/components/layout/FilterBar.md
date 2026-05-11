# FilterBar

`FilterBar` lets users build a small set of applied filters from predefined
filter definitions. It renders applied filter chips, an inline picker for the
next available filter, remove buttons, and a clear-all action.

Use it above data tables, audit logs, deployment lists, issue queues, member
tables, and admin screens where users need fast structured filtering without a
large side panel.

## Import

```tsx
import {
  FilterBar,
  type AppliedFilter,
  type FilterDef,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
const filters: FilterDef[] = [
  { id: "status", label: "Status", options: ["active", "paused"] },
  { id: "owner", label: "Owner", options: ["me", "team"] },
];

const [applied, setApplied] = useState<AppliedFilter[]>([]);

<FilterBar filters={filters} applied={applied} onChange={setApplied} />;
```

Apply the selected filters to your data:

```tsx
const rows = allRows.filter((row) =>
  applied.every((filter) => row[filter.id] === filter.value),
);
```

## Props

- **filters** - `FilterDef[]`. Required. Available filter categories and values.
- **applied** - `AppliedFilter[]`. Required. Current applied filters.
- **onChange** - `(applied: AppliedFilter[]) => void`. Required. Fires after add,
  remove, or clear-all.
- **className** - extra classes on the wrapper.

## Data Model

```ts
type FilterDef = {
  id: string;
  label: string;
  options: string[];
};

type AppliedFilter = {
  id: string;
  label: string;
  value: string;
};
```

Only one value per filter id is supported. Adding a value for an existing filter
replaces the previous value for that id.

## Behavior

`Add filter` chooses the first filter definition that is not already applied and
opens an inline option picker. Selecting an option appends that applied filter,
then closes the picker. Removing a chip filters it out by id. `clear all` emits
an empty array.

The component does not filter your data. It only manages filter UI and emits the
selected filter array.

## Accessibility

Controls are rendered as buttons, so they are keyboard reachable. Keep filter
labels and option values human-readable; they are the only context users get in
the applied chips.

For complex filtering, large option sets, or async option search, prefer a
dedicated filter panel with labeled controls.

## Gotchas

- The first unapplied filter opens automatically; users cannot choose the filter
  category from a menu.
- Options are strings only.
- Multiple values per filter are not supported by this component.
- Filtering, persistence, URL sync, and server queries belong in the parent.

## Related

- `DataTable` for filtered rows.
- `MultiSelect` for multiple values in one filter.
- `SearchField` for free-text search.
- `Drawer` for advanced filter panels.
