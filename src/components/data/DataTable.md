# DataTable

Harbor's enterprise table: drop-in chrome over the `useDataTable` hook.
Handles sort, filter, pagination, selection, column visibility / order
/ resize / pin, grouping, expanded rows, virtualization, keyboard
navigation, density, and CSV/TSV/JSON export. For an unstyled headless
version, call `useDataTable` directly.

## Import

```tsx
import { DataTable, type ColumnDef } from "@infinibay/harbor/data";
```

You can also import `useDataTable`, `getCellValue`, and the related
state types (`SortState`, `FilterState`, `PaginationState`,
`TableInstance`, …) from the same entry.

## Example

```tsx
type Vm = { id: string; name: string; cpu: number; status: "up" | "down" };

const columns: ColumnDef<Vm>[] = [
  { id: "name", header: "Name", accessor: (r) => r.name, sortable: true,
    filterable: { type: "text" } },
  { id: "cpu", header: "CPU", accessor: (r) => r.cpu, sortable: true,
    align: "end" },
  { id: "status", header: "Status", accessor: (r) => r.status,
    filterable: { type: "select",
      options: [{ value: "up", label: "Up" }, { value: "down", label: "Down" }] } },
];

<DataTable
  rows={rows}
  columns={columns}
  rowId={(r) => r.id}
  selectable
  showGlobalSearch
  showDensityToggle
  showExport
  rowActions={(row) => [
    { label: "Edit", onClick: () => editVm(row) },
    { label: "Delete", danger: true, onClick: () => deleteVm(row) },
  ]}
/>
```

## Required props

- **rows** — `readonly T[]`.
- **columns** — `readonly ColumnDef<T>[]`. See below.
- **rowId** — `(row: T) => string`.

## Column definition (`ColumnDef<T>`)

- **id** — stable identifier; used as React key and field name in state.
- **header** — `ReactNode | (ctx: HeaderContext<T>) => ReactNode`.
- **accessor** — `(row) => unknown`. Defaults to `row[id]`.
- **cell** — `(ctx: CellContext<T>) => ReactNode`. Custom renderer.
- **align** — `"start" | "center" | "end"`. Default `"start"`. RTL-aware.
- **sortable** — `boolean`. Default `false`.
- **filterable** — `{ type: "text" | "number" | "select" | "boolean" | "date", options?, predicate? }`.
- **width / minWidth / maxWidth** — px sizing. `minWidth` default `64`.
- **resizable / hideable** — default `true`.
- **pinned** — `"start" | "end"`.
- **hidden** — initial visibility.
- **compare** — custom sort comparator.
- **aggregate** — `"count" | "sum" | "avg" | "min" | "max" | "first" | "last" | (rows) => ReactNode`.
- **editable** — `{ type: "text" | "number" | "select", options?, onCommit, validate? }`.

## Presentational props

- **selectable** — show the checkbox column. Default `false`.
- **isRowSelectable** — `(row) => boolean` per-row gate.
- **onRowClick** — `(row) => void`.
- **emptyState** — replaces the "No data" placeholder.
- **loading** — render skeleton rows in the body.
- **skeletonRows** — count of skeletons. Default `min(pageSize, 10)`.
- **error** — string/number title or full ReactNode panel.
- **onRetry** — `() => void`. Retry button in the built-in error panel.
- **hidePagination** — Default `false`.
- **pageSizeOptions** — Default `[10, 25, 50, 100]`.
- **maxHeight** — px viewport cap; enables row virtualization.
- **rowHeight** — px override (defaults from density: 32 / 44 / 56).
- **overscan** — Default `8`.
- **renderExpanded** — `(row) => ReactNode`. Enables row expand caret.
- **expandedRowHeight** — Default `120` (only used when virtualizing).
- **showDensityToggle** — Default `false`.
- **showExport** — Default `false`.
- **exportFilename** — Default `"table"`.
- **rowActions** — `(row) => RowActionItem[]`. Adds a pinned-end menu column.
- **columnMenu** — per-header `⋯` menu. Default `true`.
- **showColumnPicker** — Default `false`.
- **showGlobalSearch** — Default `false`.
- **globalSearchDebounce** — ms. Default `300`.
- **globalSearchPlaceholder** — falls back to i18n string.
- **keyboardNavigation** — Default `true`.

## Hook options (forwarded)

`UseDataTableOptions<T>` provides controlled / uncontrolled state pairs
for every slice (`sort`, `filters`, `globalFilter`, `pagination`,
`selected`, `columnVisibility`, `columnOrder`, `columnWidths`,
`columnPinning`, `grouping`, `expanded`, `density`) — each as
`<slice>` (controlled), `default<Slice>`, and `on<Slice>Change`.

- **mode** — `"client" | "server"`. Default `"client"`. Server mode
  skips local sort/filter/paginate; supply `totalCount` and react to
  the change callbacks.

## Notes

- Setting `maxHeight` enables row virtualization — only rows in / near
  the viewport render, so 50k-row tables stay smooth.
- Multi-sort: hold Shift while clicking a header.
- Range-selection: hold Shift while clicking a row checkbox.
- Editable cells: double-click to enter; Enter/blur commits;
  Escape cancels; Tab moves to the next editable cell.
- Renders as `role="grid"` with `aria-rowindex` / `aria-colindex` /
  `aria-sort` / `aria-selected` wired up.
