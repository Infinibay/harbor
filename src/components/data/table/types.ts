import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Columns                                                              */
/* ------------------------------------------------------------------ */

export type Align = "start" | "center" | "end";

export type FilterType = "text" | "number" | "select" | "boolean" | "date";

export interface ColumnFilterDef {
  type: FilterType;
  /** For `type="select"`, the allowed values + their human labels. */
  options?: Array<{ value: string; label: string }>;
  /** Custom predicate. When provided, replaces the built-in for this type.
   *  Receives the currently filtered-against value (from the FilterState)
   *  and the cell's resolved value. */
  predicate?: (filterValue: unknown, cellValue: unknown) => boolean;
}

export interface CellContext<T> {
  row: T;
  value: unknown;
  rowIndex: number;
  /** The column that produced this cell (self-reference). */
  column: ColumnDef<T>;
}

export interface HeaderContext<T> {
  column: ColumnDef<T>;
  sort: SortState | null;
}

export interface ColumnDef<T> {
  /** Stable identifier. Used as React key and as the field name in
   *  SortState / FilterState / column visibility / reorder. */
  id: string;
  /** Header content. Can be a string or any ReactNode; when a function
   *  is given, it receives sort state so you can customise the label. */
  header: ReactNode | ((ctx: HeaderContext<T>) => ReactNode);
  /** How to pull the value from a row. Defaults to `(row as any)[id]`
   *  when omitted. The accessor's return value feeds both the default
   *  cell renderer and the sorter / filter predicates. */
  accessor?: (row: T) => unknown;
  /** Custom cell renderer. Defaults to the accessor's value coerced to
   *  string (or an empty string for null / undefined). */
  cell?: (ctx: CellContext<T>) => ReactNode;
  /** Logical horizontal alignment. Default `"start"`. RTL-aware. */
  align?: Align;
  /** Column is sortable. Default `false`. */
  sortable?: boolean;
  /** Column is filterable. Pass a ColumnFilterDef to control the UI / logic. */
  filterable?: ColumnFilterDef;
  /** Explicit initial width in px. When omitted, `minWidth` drives the
   *  grid track's `minmax(<min>, 1fr)`. */
  width?: number;
  /** Minimum width in px. Default `64`. Resize won't let the user go
   *  below this. */
  minWidth?: number;
  /** Maximum width in px. Default unbounded. */
  maxWidth?: number;
  /** Allow the user to resize this column. Default `true`. */
  resizable?: boolean;
  /** Allow the user to hide this column via the column-visibility menu.
   *  Default `true`. */
  hideable?: boolean;
  /** Pin to a side. The pinned state can also be toggled at runtime via
   *  the table's `pinColumn` method. Default `undefined` (unpinned). */
  pinned?: "start" | "end";
  /** Start hidden. Default `false`. */
  hidden?: boolean;
  /** Custom sort comparator. Signature matches `Array.prototype.sort`. */
  compare?: (a: unknown, b: unknown, rowA: T, rowB: T) => number;
  /** How to aggregate this column's values when a grouping row is
   *  rendered above the column. `"count"` ignores the accessor and
   *  counts rows; the others consume the column's accessed values.
   *  A function receives the rows in the group and returns the cell
   *  content to render in the group header. */
  aggregate?:
    | "count"
    | "sum"
    | "avg"
    | "min"
    | "max"
    | "first"
    | "last"
    | ((rows: readonly T[]) => ReactNode);
  /** Make this column's cells editable. Double-click enters edit mode;
   *  Enter / blur commits; Escape cancels; Tab commits + moves to the
   *  next editable cell. The consumer's `onCommit` handler is
   *  responsible for persisting the new value. */
  editable?: ColumnEditConfig<T>;
}

export interface ColumnEditConfig<T> {
  /** Input widget to render in edit mode. */
  type: "text" | "number" | "select";
  /** For `type="select"`, the option list. Ignored otherwise. */
  options?: Array<{ value: string; label: string }>;
  /** Fired when the user commits a change (Enter or blur). The consumer
   *  is responsible for merging the new value back into the data. */
  onCommit: (row: T, nextValue: unknown) => void | Promise<void>;
  /** Optional sync validator. Return `true` to accept, a string to
   *  reject with that error message. Invalid values keep the cell in
   *  edit mode with the error flashing below the input. */
  validate?: (value: unknown, row: T) => true | string;
}

/* ------------------------------------------------------------------ */
/* State slices                                                         */
/* ------------------------------------------------------------------ */

export interface SortState {
  id: string;
  direction: "asc" | "desc";
}

export interface FilterState {
  id: string;
  /** Shape depends on the column's `filterable.type`:
   *  - `"text"`: string (case-insensitive substring match)
   *  - `"number"`: `{ min?: number; max?: number }`
   *  - `"select"`: string[] (any-of)
   *  - `"boolean"`: boolean | null
   *  - `"date"`: `{ from?: string; to?: string }` (ISO dates) */
  value: unknown;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export type SelectionState = ReadonlySet<string>;

export type ColumnVisibilityState = Readonly<Record<string, boolean>>;

export type ColumnOrderState = readonly string[];

export type GroupingState = readonly string[];

/** Expanded state keys are stable per-row-id for leaf expansion and
 *  `"group:<colId>:<value>"` for group headers. */
export type ExpandedState = Readonly<Record<string, boolean>>;

export type ColumnWidthsState = Readonly<Record<string, number>>;

/** Columns pinned to the start (inline-start edge, i.e. left in LTR /
 *  right in RTL) or to the end. Order within each array follows render
 *  order of the pinned group. */
export interface ColumnPinningState {
  start: readonly string[];
  end: readonly string[];
}

export type Density = "compact" | "comfortable" | "spacious";

export interface EditingCellState {
  rowId: string;
  colId: string;
}

/* ------------------------------------------------------------------ */
/* Render items                                                         */
/* ------------------------------------------------------------------ */

/** A row-render item produced by `buildRowItems`. The body renders the
 *  list of items in order; each kind gets a different layout.
 *  - `row`   : a normal data row
 *  - `group` : a grouping header (toggle + aggregates)
 *  - `detail`: the expanded-row content rendered below the row that
 *              opened it (driven by `renderExpanded`) */
export type RowItem<T> =
  | {
      kind: "row";
      id: string;
      row: T;
      level: number;
      index: number;
      canExpand: boolean;
      expanded: boolean;
    }
  | {
      kind: "group";
      id: string;
      level: number;
      groupId: string;
      groupValue: unknown;
      count: number;
      rows: readonly T[];
      expanded: boolean;
    }
  | {
      kind: "detail";
      id: string;
      row: T;
      level: number;
    };

/* ------------------------------------------------------------------ */
/* Instance                                                             */
/* ------------------------------------------------------------------ */

export interface TableInstance<T> {
  /* Derived data */
  /** Original rows passed to the hook. */
  rows: readonly T[];
  /** Rows after filter + sort. */
  processedRows: readonly T[];
  /** Rows visible on the current page. */
  pageRows: readonly T[];
  /** Total after filter (sum of all pages). */
  totalCount: number;
  /** All columns, in the order they were defined. */
  columns: readonly ColumnDef<T>[];
  /** Columns in the user-chosen order, visibility filter applied. */
  visibleColumns: readonly ColumnDef<T>[];

  /* State */
  state: {
    sort: readonly SortState[];
    filters: readonly FilterState[];
    globalFilter: string;
    pagination: PaginationState;
    selection: SelectionState;
    columnVisibility: ColumnVisibilityState;
    columnOrder: ColumnOrderState;
    columnWidths: ColumnWidthsState;
    columnPinning: ColumnPinningState;
    grouping: GroupingState;
    expanded: ExpandedState;
    editingCell: EditingCellState | null;
    density: Density;
  };

  /* Mutators */
  setSort: (next: SortState[]) => void;
  toggleSort: (id: string, shiftKey?: boolean) => void;
  clearSort: () => void;
  setFilter: (id: string, value: unknown) => void;
  clearFilter: (id: string) => void;
  setGlobalFilter: (q: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleRow: (id: string) => void;
  toggleRowRange: (id: string) => void;
  selectAllOnPage: () => void;
  clearSelection: () => void;
  isRowSelected: (id: string) => boolean;
  toggleColumnVisibility: (id: string) => void;
  setColumnOrder: (order: string[]) => void;
  resizeColumn: (id: string, width: number) => void;
  resetColumnWidth: (id: string) => void;
  pinColumn: (id: string, side: "start" | "end" | null) => void;
  setGrouping: (next: string[]) => void;
  toggleGrouping: (id: string) => void;
  toggleExpanded: (key: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (key: string) => boolean;
  startEdit: (rowId: string, colId: string) => void;
  cancelEdit: () => void;
  setDensity: (d: Density) => void;

  /* Identity */
  rowId: (row: T) => string;
}

/* ------------------------------------------------------------------ */
/* Hook options                                                         */
/* ------------------------------------------------------------------ */

export interface UseDataTableOptions<T> {
  rows: readonly T[];
  columns: readonly ColumnDef<T>[];
  rowId: (row: T) => string;

  /* Controlled / initial state per slice */
  sort?: SortState[];
  defaultSort?: SortState[];
  onSortChange?: (next: SortState[]) => void;

  filters?: FilterState[];
  defaultFilters?: FilterState[];
  onFiltersChange?: (next: FilterState[]) => void;

  globalFilter?: string;
  defaultGlobalFilter?: string;
  onGlobalFilterChange?: (q: string) => void;

  pagination?: PaginationState;
  defaultPagination?: Partial<PaginationState>;
  onPaginationChange?: (next: PaginationState) => void;

  selected?: string[];
  defaultSelected?: string[];
  onSelectionChange?: (ids: string[]) => void;

  columnVisibility?: ColumnVisibilityState;
  defaultColumnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (next: ColumnVisibilityState) => void;

  columnOrder?: ColumnOrderState;
  defaultColumnOrder?: ColumnOrderState;
  onColumnOrderChange?: (next: ColumnOrderState) => void;

  columnWidths?: ColumnWidthsState;
  defaultColumnWidths?: ColumnWidthsState;
  onColumnWidthsChange?: (next: ColumnWidthsState) => void;

  columnPinning?: ColumnPinningState;
  defaultColumnPinning?: ColumnPinningState;
  onColumnPinningChange?: (next: ColumnPinningState) => void;

  grouping?: GroupingState;
  defaultGrouping?: GroupingState;
  onGroupingChange?: (next: GroupingState) => void;

  expanded?: ExpandedState;
  defaultExpanded?: ExpandedState;
  onExpandedChange?: (next: ExpandedState) => void;

  density?: Density;
  defaultDensity?: Density;
  onDensityChange?: (d: Density) => void;

  /** `"client"` (default) runs sort / filter / paginate locally.
   *  `"server"` skips local processing; the consumer is expected to
   *  pass pre-computed rows and totalCount via the hook options and
   *  react to the onXChange callbacks. */
  mode?: "client" | "server";
  /** Required in server mode — total row count across all pages. */
  totalCount?: number;
}
