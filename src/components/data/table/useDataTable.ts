import { useCallback, useMemo, useRef, useState } from "react";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
  ColumnWidthsState,
  Density,
  EditingCellState,
  ExpandedState,
  FilterState,
  GroupingState,
  PaginationState,
  RowItem,
  SelectionState,
  SortState,
  TableInstance,
  UseDataTableOptions,
} from "./types";

/** Main hook. Produces a `TableInstance` that drives either the default
 *  `<DataTable>` chrome or a custom one you render yourself.
 *
 *  Every state slice is optionally controllable. If you pass both
 *  `sort` and `onSortChange`, the hook defers to you; otherwise it
 *  manages the slice internally (with an optional `defaultSort`).
 *  This is the same pattern Harbor uses elsewhere — consistent with
 *  HarborForm, HarborI18nProvider, etc. */
export function useDataTable<T>(
  options: UseDataTableOptions<T>,
): TableInstance<T> {
  const {
    rows,
    columns,
    rowId,
    mode = "client",
    totalCount: serverTotalCount,
  } = options;

  /* State slices --------------------------------------------------- */

  const sort = useControllable<readonly SortState[]>(
    options.sort,
    options.defaultSort ?? [],
    options.onSortChange as ((v: readonly SortState[]) => void) | undefined,
  );
  const filters = useControllable<readonly FilterState[]>(
    options.filters,
    options.defaultFilters ?? [],
    options.onFiltersChange as
      | ((v: readonly FilterState[]) => void)
      | undefined,
  );
  const globalFilter = useControllable<string>(
    options.globalFilter,
    options.defaultGlobalFilter ?? "",
    options.onGlobalFilterChange,
  );
  const pagination = useControllable<PaginationState>(
    options.pagination,
    {
      page: options.defaultPagination?.page ?? 0,
      pageSize: options.defaultPagination?.pageSize ?? 25,
    },
    options.onPaginationChange,
  );
  const selection = useControllable<SelectionState>(
    options.selected ? new Set(options.selected) : undefined,
    new Set(options.defaultSelected ?? []),
    options.onSelectionChange
      ? (v) => options.onSelectionChange!([...v])
      : undefined,
  );
  const columnVisibility = useControllable<ColumnVisibilityState>(
    options.columnVisibility,
    options.defaultColumnVisibility ?? buildInitialVisibility(columns),
    options.onColumnVisibilityChange,
  );
  const columnOrder = useControllable<ColumnOrderState>(
    options.columnOrder,
    options.defaultColumnOrder ?? columns.map((c) => c.id),
    options.onColumnOrderChange,
  );
  const density = useControllable<Density>(
    options.density,
    options.defaultDensity ?? "comfortable",
    options.onDensityChange,
  );
  const columnWidths = useControllable<ColumnWidthsState>(
    options.columnWidths,
    options.defaultColumnWidths ?? buildInitialColumnWidths(columns),
    options.onColumnWidthsChange,
  );
  const columnPinning = useControllable<ColumnPinningState>(
    options.columnPinning,
    options.defaultColumnPinning ?? buildInitialColumnPinning(columns),
    options.onColumnPinningChange,
  );
  const grouping = useControllable<GroupingState>(
    options.grouping,
    options.defaultGrouping ?? [],
    options.onGroupingChange,
  );
  const expanded = useControllable<ExpandedState>(
    options.expanded,
    options.defaultExpanded ?? {},
    options.onExpandedChange,
  );
  // Editing cell is always internal state — it's a UI-focus-y thing,
  // not something a consumer typically needs to control externally.
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);

  /* Track last-selected row for shift+range selection. Refs don't
   *  trigger re-renders and the range toggle doesn't need reactive
   *  state — it only reads this at click time. */
  const lastSelectedRef = useRef<string | null>(null);

  /* Derived: effective column order + visibility -------------------- */

  const columnsById = useMemo(() => {
    const m = new Map<string, ColumnDef<T>>();
    for (const c of columns) m.set(c.id, c);
    return m;
  }, [columns]);

  const visibleColumns = useMemo(() => {
    const visibility = columnVisibility.value;
    return columnOrder.value
      .map((id) => columnsById.get(id))
      .filter((c): c is ColumnDef<T> => Boolean(c))
      .filter((c) => visibility[c.id] !== false);
  }, [columnOrder.value, columnVisibility.value, columnsById]);

  /* Derived: processedRows (filter + sort). Skipped in server mode. */

  const processedRows = useMemo(() => {
    if (mode === "server") return rows;
    let out = rows as readonly T[];
    const q = globalFilter.value.trim().toLowerCase();
    if (q) {
      out = out.filter((row) =>
        columns.some((c) => {
          const v = getCellValue(c, row);
          if (v == null) return false;
          return String(v).toLowerCase().includes(q);
        }),
      );
    }
    if (filters.value.length > 0) {
      out = out.filter((row) =>
        filters.value.every((f) => {
          const col = columnsById.get(f.id);
          if (!col) return true;
          return runFilter(col, f.value, getCellValue(col, row));
        }),
      );
    }
    if (sort.value.length > 0) {
      out = [...out].sort((a, b) => {
        for (const s of sort.value) {
          const col = columnsById.get(s.id);
          if (!col) continue;
          const av = getCellValue(col, a);
          const bv = getCellValue(col, b);
          const c = col.compare
            ? col.compare(av, bv, a, b)
            : defaultCompare(av, bv);
          if (c !== 0) return s.direction === "asc" ? c : -c;
        }
        return 0;
      });
    }
    return out;
  }, [mode, rows, columns, columnsById, globalFilter.value, filters.value, sort.value]);

  const totalCount =
    mode === "server"
      ? (serverTotalCount ?? rows.length)
      : processedRows.length;

  /* Derived: pageRows ---------------------------------------------- */

  const pageRows = useMemo(() => {
    if (mode === "server") return processedRows;
    const { page, pageSize } = pagination.value;
    const start = page * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [mode, processedRows, pagination.value]);

  /* Mutators -------------------------------------------------------- */

  const setSort = useCallback(
    (next: SortState[]) => sort.set(next),
    [sort],
  );

  const toggleSort = useCallback(
    (id: string, shiftKey = false) => {
      const current = sort.value;
      const existing = current.find((s) => s.id === id);
      if (!existing) {
        sort.set(
          shiftKey
            ? [...current, { id, direction: "asc" }]
            : [{ id, direction: "asc" }],
        );
        return;
      }
      if (existing.direction === "asc") {
        sort.set(
          current.map((s) =>
            s.id === id ? { id, direction: "desc" as const } : s,
          ),
        );
        return;
      }
      // desc → clear
      sort.set(current.filter((s) => s.id !== id));
    },
    [sort],
  );

  const clearSort = useCallback(() => sort.set([]), [sort]);

  const setFilter = useCallback(
    (id: string, value: unknown) => {
      const existing = filters.value.find((f) => f.id === id);
      if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
        filters.set(filters.value.filter((f) => f.id !== id));
        return;
      }
      if (existing) {
        filters.set(
          filters.value.map((f) => (f.id === id ? { id, value } : f)),
        );
      } else {
        filters.set([...filters.value, { id, value }]);
      }
    },
    [filters],
  );

  const clearFilter = useCallback(
    (id: string) => filters.set(filters.value.filter((f) => f.id !== id)),
    [filters],
  );

  const setGlobalFilter = useCallback(
    (q: string) => globalFilter.set(q),
    [globalFilter],
  );

  const setPage = useCallback(
    (page: number) =>
      pagination.set({ ...pagination.value, page }),
    [pagination],
  );
  const setPageSize = useCallback(
    (size: number) =>
      pagination.set({ page: 0, pageSize: size }),
    [pagination],
  );

  const toggleRow = useCallback(
    (id: string) => {
      const next = new Set(selection.value);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      lastSelectedRef.current = id;
      selection.set(next);
    },
    [selection],
  );

  const toggleRowRange = useCallback(
    (id: string) => {
      const anchor = lastSelectedRef.current;
      if (!anchor) {
        toggleRow(id);
        return;
      }
      const ids = pageRows.map(rowId);
      const a = ids.indexOf(anchor);
      const b = ids.indexOf(id);
      if (a === -1 || b === -1) {
        toggleRow(id);
        return;
      }
      const [lo, hi] = a < b ? [a, b] : [b, a];
      const next = new Set(selection.value);
      for (let i = lo; i <= hi; i++) next.add(ids[i]);
      selection.set(next);
    },
    [pageRows, rowId, selection, toggleRow],
  );

  const selectAllOnPage = useCallback(() => {
    const pageIds = pageRows.map(rowId);
    const allSelected = pageIds.every((id) => selection.value.has(id));
    const next = new Set(selection.value);
    if (allSelected) {
      for (const id of pageIds) next.delete(id);
    } else {
      for (const id of pageIds) next.add(id);
    }
    selection.set(next);
  }, [pageRows, rowId, selection]);

  const clearSelection = useCallback(
    () => selection.set(new Set()),
    [selection],
  );

  const isRowSelected = useCallback(
    (id: string) => selection.value.has(id),
    [selection.value],
  );

  const toggleColumnVisibility = useCallback(
    (id: string) => {
      columnVisibility.set({
        ...columnVisibility.value,
        [id]: columnVisibility.value[id] === false ? true : false,
      });
    },
    [columnVisibility],
  );

  const setColumnOrder = useCallback(
    (order: string[]) => columnOrder.set(order),
    [columnOrder],
  );

  const resizeColumn = useCallback(
    (id: string, width: number) => {
      const col = columnsById.get(id);
      const min = col?.minWidth ?? 64;
      const max = col?.maxWidth ?? Infinity;
      const clamped = Math.max(min, Math.min(max, Math.round(width)));
      columnWidths.set({ ...columnWidths.value, [id]: clamped });
    },
    [columnWidths, columnsById],
  );

  const resetColumnWidth = useCallback(
    (id: string) => {
      const next = { ...columnWidths.value };
      delete next[id];
      columnWidths.set(next);
    },
    [columnWidths],
  );

  const pinColumn = useCallback(
    (id: string, side: "start" | "end" | null) => {
      const start = columnPinning.value.start.filter((x) => x !== id);
      const end = columnPinning.value.end.filter((x) => x !== id);
      if (side === "start") start.push(id);
      else if (side === "end") end.push(id);
      columnPinning.set({ start, end });
    },
    [columnPinning],
  );

  const setGrouping = useCallback(
    (next: string[]) => grouping.set(next),
    [grouping],
  );

  const toggleGrouping = useCallback(
    (id: string) => {
      grouping.set(
        grouping.value.includes(id)
          ? grouping.value.filter((g) => g !== id)
          : [...grouping.value, id],
      );
    },
    [grouping],
  );

  const toggleExpanded = useCallback(
    (key: string) => {
      const cur = expanded.value;
      const next = { ...cur };
      if (next[key]) delete next[key];
      else next[key] = true;
      expanded.set(next);
    },
    [expanded],
  );

  const expandAll = useCallback(() => {
    // Expand every known group + leaf. Group keys depend on data, so we
    // flip a sentinel `*` that the render path treats as "expand every
    // group it encounters" (cheaper than materialising every key).
    expanded.set({ "*": true, ...expanded.value });
  }, [expanded]);

  const collapseAll = useCallback(() => {
    expanded.set({});
  }, [expanded]);

  const isExpanded = useCallback(
    (key: string) => Boolean(expanded.value[key] ?? expanded.value["*"]),
    [expanded.value],
  );

  const startEdit = useCallback(
    (rowId: string, colId: string) => setEditingCell({ rowId, colId }),
    [],
  );
  const cancelEdit = useCallback(() => setEditingCell(null), []);

  const setDensity = useCallback(
    (d: Density) => density.set(d),
    [density],
  );

  /* Instance -------------------------------------------------------- */

  return {
    rows,
    processedRows,
    pageRows,
    totalCount,
    columns,
    visibleColumns,

    state: {
      sort: sort.value,
      filters: filters.value,
      globalFilter: globalFilter.value,
      pagination: pagination.value,
      selection: selection.value,
      columnVisibility: columnVisibility.value,
      columnOrder: columnOrder.value,
      columnWidths: columnWidths.value,
      columnPinning: columnPinning.value,
      grouping: grouping.value,
      expanded: expanded.value,
      editingCell,
      density: density.value,
    },

    setSort,
    toggleSort,
    clearSort,
    setFilter,
    clearFilter,
    setGlobalFilter,
    setPage,
    setPageSize,
    toggleRow,
    toggleRowRange,
    selectAllOnPage,
    clearSelection,
    isRowSelected,
    toggleColumnVisibility,
    setColumnOrder,
    resizeColumn,
    resetColumnWidth,
    pinColumn,
    setGrouping,
    toggleGrouping,
    toggleExpanded,
    expandAll,
    collapseAll,
    isExpanded,
    startEdit,
    cancelEdit,
    setDensity,

    rowId,
  };
}

/* ================================================================== */
/* Helpers                                                              */
/* ================================================================== */

/** Symmetric controllable state: accepts either an outside-controlled
 *  value + onChange, or manages an internal slice with a default and
 *  optional onChange observer. The returned `.set` is the write
 *  primitive every mutator calls. */
interface Controllable<V> {
  value: V;
  set: (next: V) => void;
}
function useControllable<V>(
  controlled: V | undefined,
  initial: V,
  onChange?: (next: V) => void,
): Controllable<V> {
  const [internal, setInternal] = useState<V>(initial);
  const isControlled = controlled !== undefined;
  const value = (isControlled ? (controlled as V) : internal);
  const set = useCallback(
    (next: V) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return { value, set };
}

function buildInitialVisibility<T>(
  cols: readonly ColumnDef<T>[],
): ColumnVisibilityState {
  const out: Record<string, boolean> = {};
  for (const c of cols) {
    if (c.hidden) out[c.id] = false;
  }
  return out;
}

function buildInitialColumnWidths<T>(
  cols: readonly ColumnDef<T>[],
): ColumnWidthsState {
  const out: Record<string, number> = {};
  for (const c of cols) {
    if (typeof c.width === "number") out[c.id] = c.width;
  }
  return out;
}

function buildInitialColumnPinning<T>(
  cols: readonly ColumnDef<T>[],
): ColumnPinningState {
  const start: string[] = [];
  const end: string[] = [];
  for (const c of cols) {
    if (c.pinned === "start") start.push(c.id);
    else if (c.pinned === "end") end.push(c.id);
  }
  return { start, end };
}

/** Read a column's value from a row. Defaults to `row[id]` when no
 *  accessor was provided. */
export function getCellValue<T>(col: ColumnDef<T>, row: T): unknown {
  if (col.accessor) return col.accessor(row);
  // Index access fallback — covers the common case where id === field name.
  return (row as unknown as Record<string, unknown>)[col.id];
}

/** Default sort comparator. Numbers numerically; strings via
 *  `localeCompare` with `numeric: true` so "file2" < "file10"; nulls
 *  last. */
function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function runFilter<T>(
  col: ColumnDef<T>,
  filterValue: unknown,
  cellValue: unknown,
): boolean {
  const def = col.filterable;
  if (!def) return true;
  if (def.predicate) return def.predicate(filterValue, cellValue);
  switch (def.type) {
    case "text": {
      const q = String(filterValue ?? "").toLowerCase();
      if (!q) return true;
      return String(cellValue ?? "").toLowerCase().includes(q);
    }
    case "number": {
      const { min, max } = (filterValue as { min?: number; max?: number }) ?? {};
      const n = Number(cellValue);
      if (Number.isNaN(n)) return false;
      if (min != null && n < min) return false;
      if (max != null && n > max) return false;
      return true;
    }
    case "select": {
      const allowed = (filterValue as string[]) ?? [];
      if (allowed.length === 0) return true;
      return allowed.includes(String(cellValue));
    }
    case "boolean": {
      if (filterValue == null) return true;
      return Boolean(cellValue) === Boolean(filterValue);
    }
    case "date": {
      const { from, to } = (filterValue as { from?: string; to?: string }) ?? {};
      const d = cellValue instanceof Date
        ? cellValue
        : new Date(String(cellValue));
      if (from && d < new Date(from)) return false;
      if (to && d > new Date(to)) return false;
      return true;
    }
    default:
      return true;
  }
}

/* ================================================================== */
/* Grouping / expansion — row item builder                              */
/* ================================================================== */

export interface BuildRowItemsOptions<T> {
  rows: readonly T[];
  grouping: readonly string[];
  expanded: ExpandedState;
  columnsById: ReadonlyMap<string, ColumnDef<T>>;
  rowId: (row: T) => string;
  renderExpandedAvailable: boolean;
}

/** Flatten data rows into a linear render list, injecting group-header
 *  items (and expanded-detail placeholders) according to the hook's
 *  grouping + expanded state.
 *
 *  Keeps it single-level for the general case — `grouping` typically
 *  holds a single column id. Multi-entry arrays fall back to grouping
 *  by the first entry only (enough for 95% of product dashboards;
 *  multi-level nesting is a future extension). */
export function buildRowItems<T>({
  rows,
  grouping,
  expanded,
  columnsById,
  rowId,
  renderExpandedAvailable,
}: BuildRowItemsOptions<T>): RowItem<T>[] {
  const items: RowItem<T>[] = [];
  const expandAll = Boolean(expanded["*"]);

  if (grouping.length === 0) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const id = rowId(row);
      const isExpanded = Boolean(expanded[id] ?? expandAll);
      items.push({
        kind: "row",
        id,
        row,
        level: 0,
        index: i,
        canExpand: renderExpandedAvailable,
        expanded: isExpanded,
      });
      if (renderExpandedAvailable && isExpanded) {
        items.push({
          kind: "detail",
          id: `detail:${id}`,
          row,
          level: 0,
        });
      }
    }
    return items;
  }

  // Single-level grouping by the first grouping id. Preserves the
  // order the rows arrived in — the caller has already applied sort.
  const groupColId = grouping[0];
  const groupCol = columnsById.get(groupColId);
  if (!groupCol) {
    // Unknown column — fall through as if ungrouped.
    return buildRowItems({
      rows,
      grouping: [],
      expanded,
      columnsById,
      rowId,
      renderExpandedAvailable,
    });
  }

  // Partition rows by group value, preserving first-seen order.
  const partitions = new Map<string, { value: unknown; rows: T[] }>();
  for (const row of rows) {
    const raw =
      groupCol.accessor != null
        ? groupCol.accessor(row)
        : (row as Record<string, unknown>)[groupColId];
    const key = raw == null ? "∅" : String(raw);
    let bucket = partitions.get(key);
    if (!bucket) {
      bucket = { value: raw, rows: [] };
      partitions.set(key, bucket);
    }
    bucket.rows.push(row);
  }

  let idx = 0;
  for (const [key, bucket] of partitions) {
    const groupKey = `group:${groupColId}:${key}`;
    const isExpanded = Boolean(expanded[groupKey] ?? expandAll);
    items.push({
      kind: "group",
      id: groupKey,
      level: 0,
      groupId: groupColId,
      groupValue: bucket.value,
      count: bucket.rows.length,
      rows: bucket.rows,
      expanded: isExpanded,
    });
    if (isExpanded) {
      for (const row of bucket.rows) {
        const rid = rowId(row);
        const leafExpanded = Boolean(expanded[rid] ?? expandAll);
        items.push({
          kind: "row",
          id: rid,
          row,
          level: 1,
          index: idx++,
          canExpand: renderExpandedAvailable,
          expanded: leafExpanded,
        });
        if (renderExpandedAvailable && leafExpanded) {
          items.push({
            kind: "detail",
            id: `detail:${rid}`,
            row,
            level: 1,
          });
        }
      }
    }
  }
  return items;
}

/** Resolve the aggregated cell content for a grouped column. Returns
 *  `undefined` when the column has no `aggregate` configured. */
export function aggregateColumn<T>(
  col: ColumnDef<T>,
  rows: readonly T[],
): unknown {
  const agg = col.aggregate;
  if (agg == null) return undefined;
  if (typeof agg === "function") return agg(rows);
  const values = rows.map((r) =>
    col.accessor
      ? col.accessor(r)
      : (r as Record<string, unknown>)[col.id],
  );
  switch (agg) {
    case "count":
      return rows.length;
    case "sum":
      return values.reduce<number>(
        (acc, v) => acc + (typeof v === "number" ? v : 0),
        0,
      );
    case "avg": {
      const nums = values.filter((v): v is number => typeof v === "number");
      if (nums.length === 0) return undefined;
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    }
    case "min":
      return values.reduce<number | undefined>((acc, v) => {
        if (typeof v !== "number") return acc;
        return acc == null || v < acc ? v : acc;
      }, undefined);
    case "max":
      return values.reduce<number | undefined>((acc, v) => {
        if (typeof v !== "number") return acc;
        return acc == null || v > acc ? v : acc;
      }, undefined);
    case "first":
      return values[0];
    case "last":
      return values[values.length - 1];
  }
}
