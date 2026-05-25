/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState } from "react";
import { DataWorkspace } from "./DataWorkspace";
import type { DataWorkspaceServerQuery } from "./DataWorkspace";
import type { ColumnDef, FilterState, SortState } from "./table/types";

type AccountRow = {
  id: string;
  request: string;
  owner: string;
  status: "Needs review" | "Approved" | "Blocked";
  sla: string;
  updated: string;
};

const accessRows: AccountRow[] = [
  { id: "req_1042", request: "Billing export access", owner: "M. Chen", status: "Needs review", sla: "2h", updated: "10:24" },
  { id: "req_1041", request: "Production read role", owner: "A. Singh", status: "Blocked", sla: "4h", updated: "09:58" },
  { id: "req_1038", request: "Invoice admin role", owner: "L. Park", status: "Approved", sla: "Done", updated: "Yesterday" },
  { id: "req_1037", request: "Audit log export", owner: "N. Jones", status: "Needs review", sla: "1d", updated: "Yesterday" },
];

const billingRows: AccountRow[] = [
  { id: "case_884", request: "Past-due enterprise renewal", owner: "Revenue ops", status: "Needs review", sla: "3h", updated: "11:02" },
  { id: "case_883", request: "Failed invoice retry", owner: "Support", status: "Blocked", sla: "1h", updated: "10:47" },
  { id: "case_879", request: "Plan downgrade request", owner: "Success", status: "Approved", sla: "Done", updated: "08:10" },
  { id: "case_874", request: "Tax exemption document", owner: "Finance", status: "Needs review", sla: "2d", updated: "May 23" },
];

const columns: ColumnDef<AccountRow>[] = [
  {
    id: "request",
    header: "Request",
    accessor: (row) => row.request,
    sortable: true,
    pinned: "start",
    width: 240,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    filterable: {
      type: "select",
      options: [
        { value: "Needs review", label: "Needs review" },
        { value: "Approved", label: "Approved" },
        { value: "Blocked", label: "Blocked" },
      ],
    },
  },
  {
    id: "owner",
    header: "Owner",
    accessor: (row) => row.owner,
    sortable: true,
    filterable: {
      type: "select",
      options: [
        { value: "M. Chen", label: "M. Chen" },
        { value: "A. Singh", label: "A. Singh" },
        { value: "L. Park", label: "L. Park" },
        { value: "N. Jones", label: "N. Jones" },
        { value: "Revenue ops", label: "Revenue ops" },
        { value: "Support", label: "Support" },
        { value: "Success", label: "Success" },
        { value: "Finance", label: "Finance" },
      ],
    },
  },
  { id: "sla", header: "SLA", accessor: (row) => row.sla, sortable: true, width: 120 },
  { id: "updated", header: "Updated", accessor: (row) => row.updated, sortable: true, width: 140 },
];

function DataWorkspaceDemo(props: {
  queue?: "access" | "billing";
  loading?: boolean;
  error?: boolean;
  selectedCount?: number;
  detailDrawerOpen?: boolean;
  onViewChange?: (id: string) => void;
  onQueryChange?: (query: DataWorkspaceServerQuery) => void;
  onBulkAction?: (id: string) => void;
  onDetailDrawerClose?: () => void;
}) {
  const queue = props.queue ?? "access";
  const rows = queue === "billing" ? billingRows : accessRows;
  const {
    onBulkAction,
    onDetailDrawerClose,
    onQueryChange,
    onViewChange,
  } = props;
  const [activeViewId, setActiveViewId] = useState("needs-review");
  const [query, setQuery] = useState<DataWorkspaceServerQuery>({
    sort: [],
    filters: [{ id: "status", value: ["Needs review"] }],
    globalFilter: "",
    pagination: { page: 0, pageSize: 25 },
    viewId: "needs-review",
  });
  const serverRows = useMemo(() => applyServerQuery(rows, query), [query, rows]);
  const dataSource = useMemo(
    () => ({
      rows: serverRows,
      totalCount: serverRows.length,
      loading: props.loading,
      error: props.error ? "Unable to load the review queue." : undefined,
      query,
      onQueryChange: (nextQuery: DataWorkspaceServerQuery) => {
        const resolvedQuery =
          nextQuery.viewId !== query.viewId
            ? { ...nextQuery, filters: filtersForView(nextQuery.viewId ?? "") }
            : nextQuery;
        setQuery(resolvedQuery);
        onQueryChange?.(resolvedQuery);
      },
      onRetry: () => {},
    }),
    [onQueryChange, props.error, props.loading, query, serverRows],
  );

  return (
    <DataWorkspace
      title={queue === "billing" ? "Billing operations queue" : "Access review queue"}
      description={
        queue === "billing"
          ? "Triage revenue cases with saved views, bulk actions, export, and row detail review."
          : "Review access requests with saved views, bulk actions, owner assignment, and server-backed query state."
      }
      columns={columns}
      dataSource={dataSource}
      rowId={(row) => row.id}
      maxHeight={360}
      exportFilename={`${queue}-review-queue`}
      activeViewId={activeViewId}
      onViewChange={(id) => {
        setActiveViewId(id);
        onViewChange?.(id);
      }}
      savedViews={[
        { id: "needs-review", label: "Needs review", count: 2 },
        { id: "blocked", label: "Blocked", count: 1 },
        { id: "approved", label: "Approved", count: 1 },
      ]}
      metrics={[
        { label: "Needs review", value: "2", tone: "warning" },
        { label: "Blocked", value: "1", tone: "danger" },
        { label: "Approved today", value: "7", tone: "success" },
      ]}
      facets={[
        {
          id: "status",
          label: "Status",
          columnId: "status",
          options: [
            { value: "Needs review", label: "Needs review", count: 2 },
            { value: "Blocked", label: "Blocked", count: 1 },
            { value: "Approved", label: "Approved", count: 1 },
          ],
        },
        {
          id: "owner",
          label: "Owner",
          columnId: "owner",
          options: [
            { value: "M. Chen", label: "M. Chen" },
            { value: "A. Singh", label: "A. Singh" },
            { value: "L. Park", label: "L. Park" },
            { value: "N. Jones", label: "N. Jones" },
            { value: "Revenue ops", label: "Revenue ops" },
            { value: "Support", label: "Support" },
          ],
        },
      ]}
      selectedCount={props.selectedCount ?? 2}
      bulkActions={[
        { id: "assign", label: "Assign owner", onClick: () => onBulkAction?.("assign") },
        { id: "approve", label: "Approve", onClick: () => onBulkAction?.("approve") },
        { id: "reject", label: "Reject", danger: true, onClick: () => onBulkAction?.("reject") },
      ]}
      filterBar={
        <div className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] px-3 py-2 text-sm text-[color:var(--harbor-text-secondary)]">
          Server query: {describeQuery(query)}
        </div>
      }
      detailDrawerOpen={props.detailDrawerOpen}
      onDetailDrawerClose={() => onDetailDrawerClose?.()}
      detailDrawer={
        <div className="space-y-3">
          <div className="font-medium">{rows[0].request}</div>
          <p className="text-sm text-[color:var(--harbor-text-secondary)]">
            Request id {rows[0].id}. Owner: {rows[0].owner}. Check evidence, apply a decision, or assign the row before the SLA expires.
          </p>
        </div>
      }
      errorStateContent={{
        title: "Queue unavailable",
        description: "Retry the server data source when the request fails.",
      }}
      emptyStateContent={{
        title: "No requests",
        description: "Try clearing filters or changing saved views.",
      }}
    />
  );
}

function filtersForView(viewId: string): FilterState[] {
  if (viewId === "needs-review") return [{ id: "status", value: ["Needs review"] }];
  if (viewId === "blocked") return [{ id: "status", value: ["Blocked"] }];
  if (viewId === "approved") return [{ id: "status", value: ["Approved"] }];
  return [];
}

function applyServerQuery(rows: AccountRow[], query: DataWorkspaceServerQuery) {
  const searched = query.globalFilter.trim().toLowerCase();
  const filtered = rows.filter((row) => {
    const matchesSearch =
      searched.length === 0 ||
      [row.id, row.request, row.owner, row.status, row.sla, row.updated]
        .join(" ")
        .toLowerCase()
        .includes(searched);

    return (
      matchesSearch &&
      query.filters.every((filter) => matchesFilter(row, filter))
    );
  });
  const sorted = [...filtered].sort((a, b) => compareRows(a, b, query.sort));
  const start = query.pagination.page * query.pagination.pageSize;
  return sorted.slice(start, start + query.pagination.pageSize);
}

function matchesFilter(row: AccountRow, filter: FilterState) {
  const value = row[filter.id as keyof AccountRow];
  if (Array.isArray(filter.value)) {
    return filter.value.length === 0 || filter.value.includes(value);
  }
  return filter.value == null || filter.value === "" || filter.value === value;
}

function compareRows(a: AccountRow, b: AccountRow, sort: readonly SortState[]) {
  for (const rule of sort) {
    const aValue = String(a[rule.id as keyof AccountRow] ?? "");
    const bValue = String(b[rule.id as keyof AccountRow] ?? "");
    const result = aValue.localeCompare(bValue);
    if (result !== 0) return rule.direction === "asc" ? result : -result;
  }
  return 0;
}

function describeQuery(query: DataWorkspaceServerQuery) {
  const filters = query.filters
    .map((filter) => `${filter.id}=${Array.isArray(filter.value) ? filter.value.join("|") : String(filter.value)}`)
    .join(", ");
  const sort = query.sort
    .map((rule) => `${rule.id}:${rule.direction}`)
    .join(", ");
  return [
    query.viewId ? `view=${query.viewId}` : null,
    filters ? `filters ${filters}` : "filters none",
    query.globalFilter ? `search=${query.globalFilter}` : null,
    sort ? `sort ${sort}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export const playground = {
  component: DataWorkspaceDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    queue: { type: "select", options: ["access", "billing"], default: "access" },
    loading: { type: "boolean", default: false },
    error: { type: "boolean", default: false },
    selectedCount: { type: "number", default: 2, min: 0, max: 8 },
    detailDrawerOpen: { type: "boolean", default: false },
  },
  variants: [
    { label: "Access review", props: { queue: "access", selectedCount: 2 } },
    { label: "Billing ops", props: { queue: "billing", selectedCount: 1 } },
    { label: "Loading", props: { loading: true, selectedCount: 0 } },
    { label: "Error", props: { error: true, selectedCount: 0 } },
    { label: "Drawer", props: { detailDrawerOpen: true } },
  ],
  events: [
    { name: "onViewChange", signature: "(id: string) => void" },
    { name: "onQueryChange", signature: "(query: DataWorkspaceServerQuery) => void" },
    { name: "onBulkAction", signature: "(id: string) => void" },
    { name: "onDetailDrawerClose", signature: "() => void" },
  ],
  notes:
    "Use DataWorkspace for operational queues and backoffice tables where saved views, server queries, row details, export, and bulk decisions matter.",
};
