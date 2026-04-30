# FilterBar

Chip-based applied-filter strip with an inline option picker. Use above
tables, search results, or any list with multiple categorical filters.
Pass the available filter definitions and the currently applied set;
the component handles add/remove/clear interactions and animations.

## Import

```tsx
import { FilterBar } from "@infinibay/harbor/layout";
```

## Example

```tsx
const [applied, setApplied] = useState<AppliedFilter[]>([]);

<FilterBar
  filters={[
    { id: "status", label: "Status", options: ["active", "paused", "archived"] },
    { id: "owner",  label: "Owner",  options: ["me", "team", "anyone"] },
  ]}
  applied={applied}
  onChange={setApplied}
/>
```

## Props

- **filters** — `FilterDef[]`. Required. Each:
  - **id** — `string`. Unique key.
  - **label** — `string`. Display label.
  - **options** — `string[]`. Selectable values.
- **applied** — `AppliedFilter[]`. Required. Currently applied filters
  with `{ id, label, value }`.
- **onChange** — `(applied: AppliedFilter[]) => void`. Required.
- **className** — extra classes on the wrapper.

## Notes

- Only one filter per `id` may be applied at a time; re-adding the same
  filter replaces its value.
- The "Add filter" button opens the first un-applied filter's option
  picker inline; cancel returns to the dashed pill.
- Chips animate with springy scale + layout reflow.
