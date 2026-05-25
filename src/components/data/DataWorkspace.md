# DataWorkspace

Application-grade table workspace with saved views, metrics, filters, bulk actions, inline editing, server data, and detail surfaces.

## Import

```tsx
import {
  DataWorkspace,
  type ColumnDef,
  type DataWorkspaceDataSource,
} from "@infinibay/harbor/data";
```

## Example

```tsx
type Customer = {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "active" | "paused";
  seats: number;
};

const columns: ColumnDef<Customer>[] = [
  {
    id: "name",
    header: "Customer",
    accessor: (row) => row.name,
    sortable: true,
    pinned: "start",
    width: 240,
  },
  { id: "plan", header: "Plan", accessor: (row) => row.plan, filterable: {
    type: "select",
    options: [
      { value: "Free", label: "Free" },
      { value: "Pro", label: "Pro" },
      { value: "Enterprise", label: "Enterprise" },
    ],
  } },
  { id: "seats", header: "Seats", accessor: (row) => row.seats, align: "end", sortable: true },
];

<DataWorkspace
  title="Customers"
  description="Review accounts, change plans, and export filtered results."
  rows={customers}
  columns={columns}
  rowId={(row) => row.id}
  maxHeight={520}
  exportFilename="customers"
  savedViews={[
    { id: "all", label: "All", count: customers.length },
    { id: "enterprise", label: "Enterprise" },
    { id: "paused", label: "Paused" },
  ]}
  activeViewId={view}
  onViewChange={setView}
  bulkActions={[
    { id: "export", label: "Export selected", onClick: exportSelected },
    { id: "pause", label: "Pause", danger: true, onClick: pauseSelected },
  ]}
  facets={[
    {
      id: "status",
      label: "Status",
      columnId: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
      ],
    },
  ]}
  selected={selectedIds}
  onSelectionChange={setSelectedIds}
  inlineEdit={{
    columns: {
      plan: {
        type: "select",
        options: [
          { value: "Free", label: "Free" },
          { value: "Pro", label: "Pro" },
          { value: "Enterprise", label: "Enterprise" },
        ],
      },
    },
    onCommit: updateCustomerField,
  }}
  detailDrawer={activeCustomer ? <CustomerDetails customer={activeCustomer} /> : null}
  detailDrawerOpen={Boolean(activeCustomer)}
  onDetailDrawerClose={() => setActiveCustomer(null)}
/>
```

## Server Data

Use `dataSource` when sorting, filtering, pagination, and saved view changes should drive a backend query.

```tsx
const dataSource: DataWorkspaceDataSource<Customer> = {
  rows: page.rows,
  totalCount: page.total,
  loading,
  error,
  onRetry: refetch,
  query,
  onQueryChange: setQuery,
};

<DataWorkspace
  dataSource={dataSource}
  columns={columns}
  rowId={(row) => row.id}
  savedViews={views}
  activeViewId={query.viewId}
/>
```

In server mode, Harbor emits normalized query state through `onQueryChange`. Your data layer owns fetching, caching, URL state, and optimistic updates.

## Serious Tables

`DataWorkspace` forwards the full `DataTable` contract, so a workspace can use column visibility, column menus, resize, pinning, row actions, grouping, export, pagination, keyboard navigation, and row virtualization without rebuilding chrome around the table.

For large operational queues, set `maxHeight` to enable virtualization, give high-value columns a stable `width`, and pin identifiers or actions with `pinned: "start"` / `pinned: "end"`. Keep `showColumnPicker`, `showExport`, `showGlobalSearch`, and `showDensityToggle` enabled unless the surrounding product supplies equivalent controls.

## Props

- `rows`: local rows for client-side workspaces.
- `dataSource`: server-backed rows, total count, loading/error state, and query callbacks.
- `title`, `description`, `actions`, `metrics`: workspace header content.
- `savedViews`, `activeViewId`, `onViewChange`: view tabs with roving keyboard navigation.
- `facets`, `facetsLabel`: workspace-level filter chips wired to `FilterState`; useful for common saved-view refinements without building a custom filter bar.
- `filterBar`: custom controls above the table, for example a query builder or segmented filters.
- `bulkActions`: selected-row toolbar. `DataWorkspace` derives the count from `selected` / `defaultSelected` / table interaction; pass `selectedCount` only when selection lives in an external table or query model.
- `inlineEdit`: maps column ids to edit controls and a shared commit handler.
- `detailPanel`: persistent desktop-side detail surface.
- `detailDrawer`, `detailDrawerOpen`, `onDetailDrawerClose`: dismissable, focus-trapped row detail drawer.
- All `DataTable` props except `rows` are forwarded, including `maxHeight`, `rowActions`, `columnMenu`, `showColumnPicker`, `showExport`, `columnPinning`, grouping, density, pagination, and keyboard navigation.

## Gotchas

`DataWorkspace` is product chrome around `DataTable`, not a data cache. Keep source-of-truth state in your app or data client, especially with `dataSource`.

When `dataSource` is provided, `DataWorkspace` forces `DataTable` into server mode and resets pagination to page `0` when sort, facets, filters, global search, or saved view changes. Pass `totalCount` so pagination and screen-reader counts are correct.

Facet values should match the target column's filter shape. For `filterable.type: "select"`, the default multi-select facet writes a string array such as `["active"]`.

Use `detailPanel` for persistent side-by-side inspection on desktop and `detailDrawer` for focused mobile or task-based inspection. The drawer restores focus on close and can be dismissed with Escape or outside interaction.
