# DataTable

`DataTable` is Harbor's full table surface for real application data. It wraps the headless `useDataTable` engine with production chrome: sorting, filtering, pagination, selection, column visibility, column order, resizing, pinning, grouping, expanded rows, virtualization, density controls, export, row actions, global search, editable cells, loading, empty, and error states.

Use `DataTable` when the table is the workflow. Use `useDataTable` directly when you want to build custom chrome but keep Harbor's state engine.

## Import

```tsx
import {
  DataTable,
  useDataTable,
  type ColumnDef,
} from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
type Customer = {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Enterprise";
  seats: number;
  status: "active" | "paused";
};

const columns: ColumnDef<Customer>[] = [
  { id: "name", header: "Customer", accessor: (row) => row.name, sortable: true, filterable: { type: "text" } },
  { id: "plan", header: "Plan", accessor: (row) => row.plan, filterable: { type: "select", options: [
    { value: "Free", label: "Free" },
    { value: "Pro", label: "Pro" },
    { value: "Enterprise", label: "Enterprise" },
  ] } },
  { id: "seats", header: "Seats", accessor: (row) => row.seats, align: "end", sortable: true },
];

<DataTable
  rows={customers}
  columns={columns}
  rowId={(row) => row.id}
  selectable
  showGlobalSearch
  showColumnPicker
  showDensityToggle
  showExport
  maxHeight={520}
  rowActions={(row) => [
    { label: "Open", onClick: () => openCustomer(row.id) },
    { label: "Suspend", danger: true, onClick: () => suspend(row.id) },
  ]}
/>
```

## Server Mode

```tsx
<DataTable
  mode="server"
  rows={page.rows}
  totalCount={page.total}
  columns={columns}
  rowId={(row) => row.id}
  state={{ sort, filters, pagination }}
  onSortChange={setSort}
  onFiltersChange={setFilters}
  onPaginationChange={setPagination}
/>
```

In server mode, Harbor does not sort, filter, or paginate locally. It emits state changes; your data layer fetches the next page.

## Column Definitions

`ColumnDef<T>` supports `id`, `header`, `accessor`, `cell`, `align`, `sortable`, `filterable`, `width`, `minWidth`, `maxWidth`, `resizable`, `hideable`, `pinned`, `hidden`, `compare`, `aggregate`, and `editable`.

Use `cell` for display components, `accessor` for raw values, and `editable` when double-click editing should commit back to your app.

## Props

- `rows`, `columns`, `rowId`: required data contract.
- `selectable`, `isRowSelectable`, `onRowClick`: row interaction.
- `emptyState`, `loading`, `loadingLabel`, `skeletonRows`, `error`, `onRetry`: lifecycle states.
- `hidePagination`, `pageSizeOptions`: paging chrome.
- `maxHeight`, `rowHeight`, `overscan`: virtualization.
- `renderExpanded`, `expandedRowHeight`: detail rows.
- `showDensityToggle`, `showExport`, `exportFilename`, `rowActions`, `columnMenu`, `showColumnPicker`, `showGlobalSearch`, `globalSearchDebounce`, `keyboardNavigation`: workflow controls.

## Keyboard Model

Arrow keys move the active grid cell. Space toggles selection when `selectable` is enabled. Shift selection is supported through row checkboxes. Enter opens editable cells or triggers `onRowClick`. Escape clears the active cell and selection. Cmd/Ctrl+A selects the current page.

## Accessibility

The table renders as an ARIA grid with `aria-rowcount`, `aria-colcount`, `aria-sort`, `aria-rowindex`, `aria-colindex`, and `aria-selected`. Loading and error states stay inside the same table frame so users do not lose context.

## Gotchas

Virtualization assumes uniform leaf row heights. When grouping or expanded rows are active, Harbor disables virtualization and lets the browser render the full visible list. In server mode, always pass `totalCount` so pagination and screen-reader counts remain correct.

## Related

Use with `FilterPanel`, `QueryBuilder`, `AuditLog`, `MetricCard`, `Badge`, `Menu`, and `Drawer`.
