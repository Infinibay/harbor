import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
import { Skeleton } from "../display/Skeleton";
import { Menu, MenuItem, MenuSeparator } from "../overlays/Menu";
import { Select } from "../inputs/Select";
import {
  aggregateColumn,
  buildRowItems,
  useDataTable,
  getCellValue,
} from "./table/useDataTable";
import type {
  ColumnDef,
  ColumnPinningState,
  ColumnWidthsState,
  Density,
  RowItem,
  TableInstance,
  UseDataTableOptions,
} from "./table/types";

export type {
  Align,
  CellContext,
  ColumnDef,
  ColumnFilterDef,
  ColumnPinningState,
  ColumnWidthsState,
  Density,
  FilterState,
  FilterType,
  HeaderContext,
  PaginationState,
  SortState,
  TableInstance,
  UseDataTableOptions,
} from "./table/types";
export { useDataTable, getCellValue } from "./table/useDataTable";

export interface DataTableProps<T> extends UseDataTableOptions<T> {
  /** Enable the selection checkbox column. Default `false`. Always pinned
   *  to the inline-start edge when enabled. */
  selectable?: boolean;
  /** Per-row selection gate. Rows for which this returns `false` get
   *  an empty cell where the checkbox would be. Click behaviour on the
   *  rest of the row is not affected. */
  isRowSelectable?: (row: T) => boolean;
  /** Called when a row is clicked. The cell with the checkbox + any
   *  nested button stop propagation so they don't also trigger this. */
  onRowClick?: (row: T) => void;
  /** Replaces the default "No data" placeholder when the filtered +
   *  paginated result is empty. */
  emptyState?: ReactNode;
  /** Render skeleton rows while data is being fetched. Header + toolbar
   *  stay in place; the body is replaced. */
  loading?: boolean;
  /** Number of skeleton rows to render when `loading` is on. Defaults
   *  to the current `pageSize`, capped at `10`. */
  skeletonRows?: number;
  /** @deprecated kept for backwards compatibility; no longer used when
   *  `loading` renders skeleton rows. */
  loadingLabel?: ReactNode;
  /** Replaces the body with an error panel when set. String / number
   *  values render as the title; a ReactNode replaces the whole panel. */
  error?: ReactNode;
  /** Shown as a Retry button in the built-in error panel. Not used when
   *  `error` is a custom ReactNode (supply your own retry). */
  onRetry?: () => void;
  /** Hide the pagination bar even when pageSize < totalCount. Useful
   *  for tables driven by an external pager. Default `false`. */
  hidePagination?: boolean;
  /** Available page sizes in the pagination picker. Default
   *  `[10, 25, 50, 100]`. */
  pageSizeOptions?: number[];
  /** Cap the scroll viewport at this height (px). Setting this also
   *  enables row virtualization — only rows in / near the viewport are
   *  rendered, so tables with tens of thousands of rows stay smooth. */
  maxHeight?: number;
  /** Override the per-row height in px. Defaults derive from density
   *  (compact 32 / comfortable 44 / spacious 56). Only meaningful when
   *  `maxHeight` is set — without virtualization the CSS height classes
   *  do the work. */
  rowHeight?: number;
  /** Rows rendered above + below the visible viewport during
   *  virtualization, to hide the pop-in during fast scrolls. Default `8`. */
  overscan?: number;
  /** Render detail content under a row when it's expanded. Supplying
   *  this enables the row-level expand toggle (caret in the first
   *  column). Without grouping, clicking any row's caret calls
   *  `toggleExpanded(rowId)` + renders `renderExpanded(row)` below. */
  renderExpanded?: (row: T) => ReactNode;
  /** Height (px) of a rendered expanded-detail row when virtualization
   *  is active. Ignored otherwise. Default `120`. */
  expandedRowHeight?: number;
  /** Render a per-column menu button (⋯) in each data header. The menu
   *  exposes sort / pin / hide / move actions. Default `true`. */
  columnMenu?: boolean;
  /** Render a "Columns" picker on top of the grid — a dropdown with a
   *  checkbox per column to toggle visibility. Default `false`. */
  showColumnPicker?: boolean;
  /** Render a global search input in the toolbar. The input is
   *  debounced before it commits to `state.globalFilter`, so server
   *  mode doesn't fire a request per keystroke. Default `false`. */
  showGlobalSearch?: boolean;
  /** Debounce (ms) for the global search input. `0` commits on every
   *  keystroke. Default `300`. */
  globalSearchDebounce?: number;
  /** Placeholder for the global search input. Defaults to the
   *  `harbor.search.placeholder` i18n string. */
  globalSearchPlaceholder?: string;
  /** Enable keyboard navigation (arrow keys, Enter, Space, Escape,
   *  Cmd/Ctrl+A). Default `true`. */
  keyboardNavigation?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_MIN_WIDTH = 120;
const DEFAULT_COLUMN_WIDTH = 160;
const RESIZE_HANDLE_WIDTH = 6;
const SELECT_COLUMN_WIDTH = 40;

const ROW_PX: Record<Density, number> = {
  compact: 32,
  comfortable: 44,
  spacious: 56,
};

const ROW_HEIGHT_CLASS: Record<Density, string> = {
  compact: "h-8",
  comfortable: "h-11",
  spacious: "h-14",
};

const CELL_PADDING_X: Record<Density, string> = {
  compact: "px-2",
  comfortable: "px-4",
  spacious: "px-5",
};

const ALIGN_CLASS = {
  start: "justify-start text-start",
  center: "justify-center text-center",
  end: "justify-end text-end",
} as const;

/** Harbor's enterprise DataTable. Drop-in default chrome around
 *  `useDataTable` — same options as the hook, plus a few presentational
 *  props (`selectable`, `onRowClick`, `loading`, `hidePagination`,
 *  `maxHeight`, `rowHeight`, …).
 *
 *  Features covered by this phase:
 *  - Multi-column sort (Shift to append)
 *  - Per-column + global filter
 *  - Pagination (client / server)
 *  - Row selection (single / multi / Shift-range)
 *  - Column visibility + order
 *  - Column resize (drag the right edge; double-click auto-sizes)
 *  - Column pin to start / end (sticky with computed offsets)
 *  - Row virtualization when `maxHeight` is set
 *  - ARIA grid (role="grid", row/columnheader/gridcell, aria-sort,
 *    aria-rowcount / aria-colcount / aria-rowindex / aria-colindex /
 *    aria-selected). */
export function DataTable<T>(props: DataTableProps<T>) {
  const {
    selectable,
    isRowSelectable,
    onRowClick,
    emptyState,
    loading,
    skeletonRows,
    // `loadingLabel` is deprecated but still accepted for backwards
    // compat. It no longer drives the loading UI — skeleton rows do.
    loadingLabel: _loadingLabel,
    error,
    onRetry,
    hidePagination,
    pageSizeOptions = [10, 25, 50, 100],
    maxHeight,
    rowHeight,
    overscan = 8,
    columnMenu = true,
    showColumnPicker = false,
    showGlobalSearch = false,
    globalSearchDebounce = 300,
    globalSearchPlaceholder,
    keyboardNavigation = true,
    renderExpanded,
    expandedRowHeight = 120,
    className,
    style,
    ...hookOptions
  } = props;

  const table = useDataTable<T>(hookOptions);
  const { t } = useT();

  const { visibleColumns, pageRows, totalCount, state, rowId } = table;
  const rowHeightPx = rowHeight ?? ROW_PX[state.density];

  /* ---------- Visual column order + width / pin offsets ---------- */

  const layout = useMemo(
    () =>
      computeLayout({
        visibleColumns,
        widths: state.columnWidths,
        pinning: state.columnPinning,
        selectable: Boolean(selectable),
      }),
    [visibleColumns, state.columnWidths, state.columnPinning, selectable],
  );

  /* Inline CSS vars so mid-drag resize can update widths cheaply via
   *  direct DOM writes — no re-render per pointer move. */
  const tableRef = useRef<HTMLDivElement>(null);

  const gridStyle = useMemo<CSSProperties>(() => {
    const vars: Record<string, string> = {};
    for (const col of layout.orderedColumns) {
      const w = layout.widthOf(col.id);
      vars[`--harbor-col-w-${col.id}`] = w != null ? `${w}px` : "1fr";
    }
    return {
      gridTemplateColumns: layout.gridTemplateColumns,
      ...(vars as CSSProperties),
    };
  }, [layout]);

  /* ---------- Row items (grouping + expanded) ---------- */

  const rowItems = useMemo<RowItem<T>[]>(
    () =>
      buildRowItems<T>({
        rows: pageRows,
        grouping: state.grouping,
        expanded: state.expanded,
        columnsById: layout.columnsById,
        rowId,
        renderExpandedAvailable: Boolean(renderExpanded),
      }),
    [
      pageRows,
      state.grouping,
      state.expanded,
      layout.columnsById,
      rowId,
      renderExpanded,
    ],
  );

  /* ---------- Virtualization ---------- */

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  // Virtualization only applies when items are uniform leaf rows. With
  // grouping or expandable detail rows, item heights differ — disable
  // virt and let the browser scroll the full list. Large-scale grouped
  // views are an uncommon combination; 100k+ virtualization is reserved
  // for the flat case.
  const virtualized =
    maxHeight != null &&
    state.grouping.length === 0 &&
    !renderExpanded;

  useEffect(() => {
    if (!virtualized) return;
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [virtualized]);

  const { paddingTop, paddingBottom, renderItems } = useMemo(() => {
    if (!virtualized || !maxHeight) {
      return {
        paddingTop: 0,
        paddingBottom: 0,
        renderItems: rowItems,
      };
    }
    const visCount = Math.ceil(maxHeight / rowHeightPx) + overscan * 2;
    const s = Math.max(0, Math.floor(scrollTop / rowHeightPx) - overscan);
    const e = Math.min(rowItems.length, s + visCount);
    return {
      paddingTop: s * rowHeightPx,
      paddingBottom: (rowItems.length - e) * rowHeightPx,
      renderItems: rowItems.slice(s, e),
    };
  }, [virtualized, maxHeight, rowHeightPx, scrollTop, overscan, rowItems]);

  /* ---------- Selection summary ---------- */

  const pageIds = pageRows.map(rowId);
  const allSelectedOnPage =
    pageIds.length > 0 && pageIds.every((id) => state.selection.has(id));
  const someSelectedOnPage =
    !allSelectedOnPage && pageIds.some((id) => state.selection.has(id));

  /* ---------- Resize pointer handler ---------- */

  const beginResize = useCallback(
    (id: string, startWidth: number) =>
      (e: ReactPointerEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const col = layout.columnsById.get(id);
        const min = col?.minWidth ?? 64;
        const max = col?.maxWidth ?? Infinity;
        let latest = startWidth;
        function onMove(ev: PointerEvent) {
          const delta = ev.clientX - startX;
          latest = Math.max(min, Math.min(max, startWidth + delta));
          tableRef.current?.style.setProperty(
            `--harbor-col-w-${id}`,
            `${latest}px`,
          );
        }
        function onUp() {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          table.resizeColumn(id, latest);
        }
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
    [layout.columnsById, table],
  );

  const autoSizeColumn = useCallback(
    (id: string) => {
      const root = tableRef.current;
      if (!root) return;
      // Measure every rendered cell for this column, pick the widest.
      const cells = root.querySelectorAll<HTMLElement>(
        `[data-col-id="${cssEscape(id)}"]`,
      );
      let max = 0;
      for (const cell of cells) {
        const span = cell.querySelector<HTMLElement>("[data-measure]");
        if (!span) continue;
        // scrollWidth ignores `truncate`'s `overflow: hidden` and reports
        // the natural width of the content — what we want.
        max = Math.max(max, span.scrollWidth);
      }
      if (max > 0) {
        // Padding + a small breathing margin on both sides.
        table.resizeColumn(id, max + 32);
      } else {
        table.resetColumnWidth(id);
      }
    },
    [table],
  );

  /* ---------- Keyboard navigation ---------- */

  const [activeCell, setActiveCell] = useState<{
    rowIdx: number;
    colIdx: number;
  } | null>(null);

  const onGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!keyboardNavigation) return;
      // Ignore key events originating in form controls — we don't want
      // ArrowLeft to steal caret movement inside an input.
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const maxCol = layout.orderedColumns.length - 1;
      const maxRow = pageRows.length - 1;
      if (maxRow < 0 || maxCol < 0) return;

      // First navigation key press while no cell is active brings focus
      // into the grid at (0,0) without moving further — so a single
      // ArrowDown lands on row 1, not row 2.
      if (activeCell == null) {
        const navKeys = [
          "ArrowDown",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End",
          " ",
          "Enter",
        ];
        if (navKeys.includes(e.key)) {
          e.preventDefault();
          setActiveCell({ rowIdx: 0, colIdx: 0 });
          return;
        }
      }

      const cur = activeCell ?? { rowIdx: 0, colIdx: 0 };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveCell({
          rowIdx: Math.min(maxRow, cur.rowIdx + 1),
          colIdx: cur.colIdx,
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveCell({
          rowIdx: Math.max(0, cur.rowIdx - 1),
          colIdx: cur.colIdx,
        });
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveCell({
          rowIdx: cur.rowIdx,
          colIdx: Math.min(maxCol, cur.colIdx + 1),
        });
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveCell({
          rowIdx: cur.rowIdx,
          colIdx: Math.max(0, cur.colIdx - 1),
        });
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActiveCell({ rowIdx: cur.rowIdx, colIdx: 0 });
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setActiveCell({ rowIdx: cur.rowIdx, colIdx: maxCol });
        return;
      }
      if (e.key === " " && selectable) {
        e.preventDefault();
        const row = pageRows[cur.rowIdx];
        if (row) {
          const id = rowId(row);
          if (e.shiftKey) table.toggleRowRange(id);
          else table.toggleRow(id);
        }
        return;
      }
      if (e.key === "Enter") {
        const row = pageRows[cur.rowIdx];
        const col = layout.orderedColumns[cur.colIdx];
        if (row && col?.editable) {
          e.preventDefault();
          table.startEdit(rowId(row), col.id);
          return;
        }
        if (row && onRowClick) {
          e.preventDefault();
          onRowClick(row);
          return;
        }
      }
      if (e.key === "Escape") {
        setActiveCell(null);
        table.clearSelection();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        table.selectAllOnPage();
        return;
      }
    },
    [
      keyboardNavigation,
      layout.orderedColumns.length,
      pageRows,
      activeCell,
      selectable,
      rowId,
      table,
      onRowClick,
    ],
  );

  // Clamp active cell when data changes (filter, page flip) so we
  // don't point at a row that no longer exists.
  useEffect(() => {
    if (!activeCell) return;
    const maxRow = pageRows.length - 1;
    const maxCol = layout.orderedColumns.length - 1;
    if (maxRow < 0 || maxCol < 0) {
      setActiveCell(null);
      return;
    }
    if (activeCell.rowIdx > maxRow || activeCell.colIdx > maxCol) {
      setActiveCell({
        rowIdx: Math.min(activeCell.rowIdx, maxRow),
        colIdx: Math.min(activeCell.colIdx, maxCol),
      });
    }
  }, [activeCell, pageRows.length, layout.orderedColumns.length]);

  const gridIdRoot = useId();
  const gridId = `harbor-grid-${gridIdRoot}`;
  const activeCellId =
    activeCell &&
    pageRows[activeCell.rowIdx] &&
    layout.orderedColumns[activeCell.colIdx]
      ? buildCellId(
          gridId,
          rowId(pageRows[activeCell.rowIdx]),
          layout.orderedColumns[activeCell.colIdx].id,
        )
      : undefined;

  /* ---------- Render ---------- */

  const colCount = layout.orderedColumns.length + (selectable ? 1 : 0);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col",
        className,
      )}
      style={style}
      ref={tableRef}
    >
      {showGlobalSearch || showColumnPicker ? (
        <div className="border-b border-white/8 px-4 py-2 flex items-center gap-3">
          {showGlobalSearch ? (
            <GlobalSearchInput
              value={table.state.globalFilter}
              onCommit={table.setGlobalFilter}
              debounce={globalSearchDebounce}
              placeholder={globalSearchPlaceholder}
            />
          ) : null}
          <div className="flex-1" />
          {showColumnPicker ? <ColumnVisibilityPicker table={table} /> : null}
        </div>
      ) : null}
      <div
        role="grid"
        id={gridId}
        aria-rowcount={totalCount}
        aria-colcount={colCount}
        aria-activedescendant={activeCellId}
        tabIndex={keyboardNavigation ? 0 : undefined}
        onKeyDown={keyboardNavigation ? onGridKeyDown : undefined}
        className="relative overflow-auto min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40 focus-visible:ring-inset"
        style={maxHeight != null ? { maxHeight } : undefined}
        ref={scrollRef}
      >
        <div className="min-w-max">
          {/* Header */}
          <div
            role="rowgroup"
            className="sticky top-0 z-20 bg-[#0f0f16]/95 backdrop-blur"
          >
            <div
              role="row"
              aria-rowindex={1}
              className="grid border-b border-white/8"
              style={gridStyle}
            >
              {selectable ? (
                <HeaderCell
                  kind="select"
                  density={state.density}
                  stickyStart={0}
                  zIndex={30}
                >
                  <CheckCell
                    checked={allSelectedOnPage}
                    indeterminate={someSelectedOnPage}
                    onChange={() => table.selectAllOnPage()}
                    ariaLabel={
                      t("harbor.datatable.selectAll") ||
                      "Select all rows on this page"
                    }
                    disabled={pageRows.length === 0}
                  />
                </HeaderCell>
              ) : null}
              {layout.orderedColumns.map((col, idx) => {
                const sortEntry =
                  state.sort.find((s) => s.id === col.id) ?? null;
                const ariaSort =
                  sortEntry?.direction === "asc"
                    ? "ascending"
                    : sortEntry?.direction === "desc"
                      ? "descending"
                      : col.sortable
                        ? "none"
                        : undefined;
                const headerNode =
                  typeof col.header === "function"
                    ? col.header({ column: col, sort: sortEntry })
                    : col.header;
                const pinSide = layout.pinSideOf(col.id);
                const pinOffset =
                  pinSide === "start"
                    ? layout.startOffsetOf(col.id)
                    : pinSide === "end"
                      ? layout.endOffsetOf(col.id)
                      : undefined;
                const resizable = col.resizable !== false;
                return (
                  <HeaderCell
                    key={col.id}
                    kind="data"
                    density={state.density}
                    align={col.align ?? "start"}
                    sortable={Boolean(col.sortable)}
                    sortEntry={sortEntry}
                    onClick={
                      col.sortable
                        ? (e) => table.toggleSort(col.id, e.shiftKey)
                        : undefined
                    }
                    ariaSort={ariaSort}
                    ariaColIndex={idx + 1 + (selectable ? 1 : 0)}
                    stickyStart={pinSide === "start" ? pinOffset : undefined}
                    stickyEnd={pinSide === "end" ? pinOffset : undefined}
                    zIndex={pinSide ? 30 : undefined}
                  >
                    {headerNode}
                    {columnMenu ? (
                      <HeaderMenu
                        table={table}
                        col={col}
                        pinSide={pinSide}
                        offsetEnd={resizable ? RESIZE_HANDLE_WIDTH + 2 : 4}
                      />
                    ) : null}
                    {resizable ? (
                      <ResizeHandle
                        onPointerDown={(e) => {
                          const w =
                            layout.widthOf(col.id) ??
                            measureCurrentColumnWidth(tableRef.current, col.id);
                          if (w != null) beginResize(col.id, w)(e);
                        }}
                        onDoubleClick={() => autoSizeColumn(col.id)}
                      />
                    ) : null}
                  </HeaderCell>
                );
              })}
            </div>
          </div>

          {/* Body — error > loading > empty > rows */}
          {error != null ? (
            <ErrorPanel error={error} onRetry={onRetry} />
          ) : loading ? (
            <SkeletonRows
              columns={layout.orderedColumns}
              selectable={Boolean(selectable)}
              count={
                skeletonRows ??
                Math.min(10, state.pagination.pageSize)
              }
              density={state.density}
              gridStyle={gridStyle}
            />
          ) : (
            <div
              role="rowgroup"
              style={{
                paddingTop: virtualized ? paddingTop : undefined,
                paddingBottom: virtualized ? paddingBottom : undefined,
              }}
            >
              {pageRows.length === 0 ? (
                <div className="p-10 grid place-items-center">
                  {emptyState ?? (
                    <span className="text-white/40 text-sm">
                      {t("harbor.datatable.empty") || "No data"}
                    </span>
                  )}
                </div>
              ) : (
                renderItems.map((item) => {
                  if (item.kind === "group") {
                    return (
                      <GroupRow
                        key={item.id}
                        item={item}
                        layout={layout}
                        selectable={Boolean(selectable)}
                        density={state.density}
                        onToggle={() => table.toggleExpanded(item.id)}
                      />
                    );
                  }
                  if (item.kind === "detail") {
                    return (
                      <div
                        key={item.id}
                        role="row"
                        className="border-b border-white/5 bg-white/[0.02]"
                        style={{
                          height: virtualized ? expandedRowHeight : undefined,
                          paddingInlineStart: item.level > 0 ? 24 : 0,
                        }}
                      >
                        <div className="px-5 py-3 min-w-max">
                          {renderExpanded?.(item.row)}
                        </div>
                      </div>
                    );
                  }
                  // Leaf data row.
                  const row = item.row;
                  const rowIndex = item.index;
                  const id = item.id;
                  const selected = state.selection.has(id);
                  const canSelect =
                    !selectable ||
                    (isRowSelectable ? isRowSelectable(row) : true);
                  return (
                    <motion.div
                      key={id}
                      role="row"
                      aria-rowindex={rowIndex + 2}
                      aria-selected={selectable ? selected : undefined}
                      initial={false}
                      className={cn(
                        "grid border-b border-white/5 transition-colors",
                        "hover:bg-white/[0.03]",
                        selected && "bg-fuchsia-500/[0.08]",
                        onRowClick && "cursor-pointer",
                      )}
                      style={
                        virtualized
                          ? { ...gridStyle, height: rowHeightPx }
                          : gridStyle
                      }
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable ? (
                        <BodyCell
                          density={state.density}
                          stickyStart={0}
                          zIndex={10}
                          onClick={(e) => e.stopPropagation()}
                          align="center"
                        >
                          {canSelect ? (
                            <CheckCell
                              checked={selected}
                              onChange={(e) => {
                                if (
                                  (e as unknown as { shiftKey?: boolean })
                                    .shiftKey
                                ) {
                                  table.toggleRowRange(id);
                                } else {
                                  table.toggleRow(id);
                                }
                              }}
                              ariaLabel={
                                t("harbor.datatable.selectRow") || "Select row"
                              }
                            />
                          ) : null}
                        </BodyCell>
                      ) : null}
                      {layout.orderedColumns.map((col, colIndex) => {
                        const value = getCellValue(col, row);
                        const content = col.cell
                          ? col.cell({ row, value, rowIndex, column: col })
                          : value == null
                            ? ""
                            : String(value);
                        const pinSide = layout.pinSideOf(col.id);
                        const pinOffset =
                          pinSide === "start"
                            ? layout.startOffsetOf(col.id)
                            : pinSide === "end"
                              ? layout.endOffsetOf(col.id)
                              : undefined;
                        const isActive =
                          keyboardNavigation &&
                          activeCell != null &&
                          activeCell.rowIdx === rowIndex &&
                          activeCell.colIdx === colIndex;
                        const isFirstDataCell = colIndex === 0;
                        const canExpand = item.canExpand;
                        const isEditing =
                          state.editingCell != null &&
                          state.editingCell.rowId === id &&
                          state.editingCell.colId === col.id;
                        return (
                          <BodyCell
                            key={col.id}
                            id={buildCellId(gridId, id, col.id)}
                            density={state.density}
                            align={col.align ?? "start"}
                            colId={col.id}
                            ariaColIndex={colIndex + 1 + (selectable ? 1 : 0)}
                            stickyStart={
                              pinSide === "start" ? pinOffset : undefined
                            }
                            stickyEnd={pinSide === "end" ? pinOffset : undefined}
                            zIndex={pinSide ? 10 : undefined}
                            active={isActive}
                            onDoubleClick={
                              col.editable
                                ? (e) => {
                                    e.stopPropagation();
                                    table.startEdit(id, col.id);
                                  }
                                : undefined
                            }
                          >
                            {isFirstDataCell && canExpand ? (
                              <ExpandToggle
                                expanded={item.expanded}
                                indent={item.level}
                                onToggle={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  table.toggleExpanded(id);
                                }}
                              />
                            ) : null}
                            {isEditing && col.editable ? (
                              <EditingCellInput
                                row={row}
                                value={value}
                                config={col.editable}
                                onCommit={async (next) => {
                                  const v = col.editable!.validate?.(next, row);
                                  if (v !== undefined && v !== true) return;
                                  await col.editable!.onCommit(row, next);
                                  table.cancelEdit();
                                }}
                                onCancel={table.cancelEdit}
                              />
                            ) : (
                              content
                            )}
                          </BodyCell>
                        );
                      })}
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {!hidePagination ? (
        <Pagination
          page={state.pagination.page}
          pageSize={state.pagination.pageSize}
          total={totalCount}
          pageSizeOptions={pageSizeOptions}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      ) : null}
    </div>
  );
}

/* ================================================================== */
/* Layout math                                                          */
/* ================================================================== */

interface Layout<T> {
  /** Ordered columns: pinned-start (in pinning.start order) + unpinned
   *  (in columnOrder) + pinned-end (in pinning.end order). */
  orderedColumns: readonly ColumnDef<T>[];
  columnsById: ReadonlyMap<string, ColumnDef<T>>;
  gridTemplateColumns: string;
  /** Numeric width resolved for a column — user resize takes priority,
   *  then ColumnDef.width, then undefined (auto-size via grid track). */
  widthOf: (id: string) => number | undefined;
  pinSideOf: (id: string) => "start" | "end" | null;
  startOffsetOf: (id: string) => number;
  endOffsetOf: (id: string) => number;
}

function computeLayout<T>({
  visibleColumns,
  widths,
  pinning,
  selectable,
}: {
  visibleColumns: readonly ColumnDef<T>[];
  widths: ColumnWidthsState;
  pinning: ColumnPinningState;
  selectable: boolean;
}): Layout<T> {
  const columnsById = new Map<string, ColumnDef<T>>();
  for (const c of visibleColumns) columnsById.set(c.id, c);

  const pinStartIds = pinning.start.filter((id) => columnsById.has(id));
  const pinEndIds = pinning.end.filter((id) => columnsById.has(id));
  const pinnedSet = new Set([...pinStartIds, ...pinEndIds]);
  const mid = visibleColumns.filter((c) => !pinnedSet.has(c.id));

  const orderedColumns: ColumnDef<T>[] = [
    ...pinStartIds
      .map((id) => columnsById.get(id))
      .filter((c): c is ColumnDef<T> => Boolean(c)),
    ...mid,
    ...pinEndIds
      .map((id) => columnsById.get(id))
      .filter((c): c is ColumnDef<T> => Boolean(c)),
  ];

  function widthOf(id: string): number | undefined {
    const committed = widths[id];
    if (committed != null) return committed;
    const col = columnsById.get(id);
    return col?.width;
  }

  /** Pinned columns need a numeric width to compute offsets. If a
   *  pinned column is otherwise auto-sized, fall back to the column's
   *  `minWidth` (or DEFAULT_COLUMN_WIDTH). */
  function pinnedWidthOf(id: string): number {
    const w = widthOf(id);
    if (w != null) return w;
    const col = columnsById.get(id);
    return col?.minWidth ?? DEFAULT_COLUMN_WIDTH;
  }

  const startOffsets = new Map<string, number>();
  let offset = selectable ? SELECT_COLUMN_WIDTH : 0;
  for (const id of pinStartIds) {
    startOffsets.set(id, offset);
    offset += pinnedWidthOf(id);
  }

  const endOffsets = new Map<string, number>();
  let rightOffset = 0;
  for (let i = pinEndIds.length - 1; i >= 0; i--) {
    const id = pinEndIds[i];
    endOffsets.set(id, rightOffset);
    rightOffset += pinnedWidthOf(id);
  }

  const parts: string[] = [];
  if (selectable) parts.push(`${SELECT_COLUMN_WIDTH}px`);
  for (const col of orderedColumns) {
    const w = widthOf(col.id);
    if (w != null) {
      parts.push(`${w}px`);
    } else {
      const min = col.minWidth ?? DEFAULT_MIN_WIDTH;
      const max = col.maxWidth != null ? `${col.maxWidth}px` : "1fr";
      parts.push(`minmax(${min}px, ${max})`);
    }
  }

  function pinSideOf(id: string): "start" | "end" | null {
    if (startOffsets.has(id)) return "start";
    if (endOffsets.has(id)) return "end";
    return null;
  }

  return {
    orderedColumns,
    columnsById,
    gridTemplateColumns: parts.join(" "),
    widthOf,
    pinSideOf,
    startOffsetOf: (id) => startOffsets.get(id) ?? 0,
    endOffsetOf: (id) => endOffsets.get(id) ?? 0,
  };
}

function measureCurrentColumnWidth(
  root: HTMLElement | null,
  colId: string,
): number | undefined {
  if (!root) return undefined;
  const cell = root.querySelector<HTMLElement>(
    `[data-col-id="${cssEscape(colId)}"]`,
  );
  return cell?.getBoundingClientRect().width;
}

function cssEscape(s: string): string {
  // Narrow fallback: escape characters that confuse attribute selectors.
  // Column ids are identifiers in practice, so this path is rarely hit.
  return s.replace(/(["\\])/g, "\\$1");
}

function buildCellId(gridId: string, rowId: string, colId: string): string {
  // Replace characters that would break a CSS `id` selector in case a
  // screen reader or ARIA tool queries by id.
  const safe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${gridId}__${safe(rowId)}__${safe(colId)}`;
}

/* ================================================================== */
/* Internal subcomponents                                               */
/* ================================================================== */

interface HeaderCellProps {
  kind: "select" | "data";
  density: Density;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  sortEntry?: { id: string; direction: "asc" | "desc" } | null;
  ariaSort?: "ascending" | "descending" | "none";
  ariaColIndex?: number;
  stickyStart?: number;
  stickyEnd?: number;
  zIndex?: number;
  onClick?: (e: React.MouseEvent) => void;
  children: ReactNode;
}

function HeaderCell({
  kind,
  density,
  align = "start",
  sortable,
  sortEntry,
  ariaSort,
  ariaColIndex,
  stickyStart,
  stickyEnd,
  zIndex,
  onClick,
  children,
}: HeaderCellProps) {
  const sticky = stickyStart != null || stickyEnd != null;
  const style: CSSProperties | undefined = sticky
    ? {
        position: "sticky",
        insetInlineStart: stickyStart,
        insetInlineEnd: stickyEnd,
        zIndex,
        background: "rgb(15 15 22 / 0.95)",
      }
    : undefined;

  return (
    <div
      role="columnheader"
      aria-sort={ariaSort}
      aria-colindex={ariaColIndex}
      className={cn(
        "group relative flex items-center",
        CELL_PADDING_X[density],
        ROW_HEIGHT_CLASS[density],
        "text-[11px] uppercase tracking-wider font-medium text-white/45 select-none",
        ALIGN_CLASS[align],
        sortable && "cursor-pointer hover:text-white/85 transition-colors",
        sortEntry && "text-white",
      )}
      style={style}
      onClick={onClick}
    >
      {kind === "select" ? (
        children
      ) : (
        <>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 min-w-0",
              align === "end" && "flex-row-reverse",
            )}
          >
            <span className="truncate">{children}</span>
            {sortable ? (
              <SortIndicator direction={sortEntry?.direction ?? null} />
            ) : null}
          </span>
        </>
      )}
    </div>
  );
}

interface BodyCellProps {
  id?: string;
  density: Density;
  align?: "start" | "center" | "end";
  colId?: string;
  ariaColIndex?: number;
  stickyStart?: number;
  stickyEnd?: number;
  zIndex?: number;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  children: ReactNode;
}

function BodyCell({
  id,
  density,
  align = "start",
  colId,
  ariaColIndex,
  stickyStart,
  stickyEnd,
  zIndex,
  onClick,
  onDoubleClick,
  active,
  children,
}: BodyCellProps) {
  const sticky = stickyStart != null || stickyEnd != null;
  const style: CSSProperties | undefined = sticky
    ? {
        position: "sticky",
        insetInlineStart: stickyStart,
        insetInlineEnd: stickyEnd,
        zIndex,
        background: "rgb(15 15 22)",
      }
    : undefined;
  return (
    <div
      id={id}
      role="gridcell"
      aria-colindex={ariaColIndex}
      data-col-id={colId}
      className={cn(
        "flex items-center text-sm text-white/85",
        CELL_PADDING_X[density],
        ROW_HEIGHT_CLASS[density],
        ALIGN_CLASS[align],
        active &&
          "outline outline-2 outline-offset-[-2px] outline-fuchsia-400/70",
      )}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <span className="truncate" data-measure>
        {children}
      </span>
    </div>
  );
}

interface ResizeHandleProps {
  onPointerDown: (e: ReactPointerEvent<HTMLSpanElement>) => void;
  onDoubleClick: () => void;
}

function ResizeHandle({ onPointerDown, onDoubleClick }: ResizeHandleProps) {
  return (
    <span
      aria-hidden
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute inset-y-0 end-0 cursor-col-resize select-none",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        "before:absolute before:inset-y-2 before:end-0 before:w-px before:bg-white/25",
        "hover:before:bg-fuchsia-400/70",
      )}
      style={{ width: RESIZE_HANDLE_WIDTH }}
    />
  );
}

function SortIndicator({
  direction,
}: {
  direction: "asc" | "desc" | null;
}) {
  if (direction === "asc") {
    return (
      <motion.span
        key="asc"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="inline-block text-fuchsia-300"
        aria-hidden
      >
        ↑
      </motion.span>
    );
  }
  if (direction === "desc") {
    return (
      <motion.span
        key="desc"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="inline-block text-fuchsia-300"
        aria-hidden
      >
        ↓
      </motion.span>
    );
  }
  return (
    <span
      className="inline-block text-white/40 group-hover:text-white/70 transition-colors leading-none"
      aria-hidden
    >
      ↕
    </span>
  );
}

function CheckCell({
  checked,
  indeterminate,
  onChange,
  disabled,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={onChange}
      whileTap={disabled ? undefined : { scale: 0.85 }}
      disabled={disabled}
      animate={{
        background:
          checked || indeterminate
            ? "linear-gradient(135deg,#a855f7,#38bdf8)"
            : "rgb(var(--harbor-text) / 0.06)",
        borderColor:
          checked || indeterminate
            ? "transparent"
            : "rgb(var(--harbor-text) / 0.35)",
        opacity: disabled ? 0.35 : 1,
      }}
      className="w-4 h-4 rounded border grid place-items-center disabled:cursor-not-allowed"
    >
      {indeterminate ? (
        <span className="block w-2 h-0.5 bg-white rounded" aria-hidden />
      ) : checked ? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12 L10 17 L19 7" />
        </svg>
      ) : null}
    </motion.button>
  );
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const { t, formatNumber } = useT();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : page * pageSize + 1;
  const end = Math.min(total, (page + 1) * pageSize);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="border-t border-white/8 px-4 py-2 flex items-center justify-between gap-3 text-xs text-white/60">
      <div className="flex items-center gap-2">
        <span>
          {t("harbor.datatable.showingRange", { start, end, total }) ||
            `Showing ${formatNumber(start)}–${formatNumber(end)} of ${formatNumber(total)}`}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <span>{t("harbor.datatable.rowsPerPage") || "Rows per page"}</span>
          <span className="w-[76px]">
            <Select
              size="sm"
              value={String(pageSize)}
              onChange={(v) => onPageSizeChange(Number(v))}
              options={pageSizeOptions.map((n) => ({
                value: String(n),
                label: String(n),
              }))}
            />
          </span>
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(0)}
            disabled={!canPrev}
            className="w-7 h-7 rounded grid place-items-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("harbor.datatable.firstPage") || "First page"}
          >
            «
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev}
            className="w-7 h-7 rounded grid place-items-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("harbor.datatable.prevPage") || "Previous page"}
          >
            ‹
          </button>
          <span className="px-2 tabular-nums">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
            className="w-7 h-7 rounded grid place-items-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("harbor.datatable.nextPage") || "Next page"}
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={!canNext}
            className="w-7 h-7 rounded grid place-items-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("harbor.datatable.lastPage") || "Last page"}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* HeaderMenu — per-column dropdown with sort / pin / hide / move      */
/* ================================================================== */

interface HeaderMenuProps<T> {
  table: TableInstance<T>;
  col: ColumnDef<T>;
  pinSide: "start" | "end" | null;
  /** Pixels to leave free on the trailing edge so the trigger doesn't
   *  sit behind the resize handle. */
  offsetEnd: number;
}

function HeaderMenu<T>({ table, col, pinSide, offsetEnd }: HeaderMenuProps<T>) {
  const { t } = useT();
  const sortEntry = table.state.sort.find((s) => s.id === col.id) ?? null;
  const colOrder = table.state.columnOrder;
  const colIdx = colOrder.indexOf(col.id);
  const canMoveLeft = colIdx > 0;
  const canMoveRight = colIdx >= 0 && colIdx < colOrder.length - 1;
  // Don't allow hiding the last visible column — would leave the table
  // with just the selection checkbox column, which is unusable.
  const visibleCount = table.visibleColumns.length;
  const canHide = col.hideable !== false && visibleCount > 1;

  function setSortDir(dir: "asc" | "desc" | null) {
    const others = table.state.sort.filter((s) => s.id !== col.id);
    if (dir === null) table.setSort(others);
    else table.setSort([...others, { id: col.id, direction: dir }]);
  }

  function move(delta: number) {
    const next = [...colOrder];
    const newIdx = colIdx + delta;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[colIdx], next[newIdx]] = [next[newIdx], next[colIdx]];
    table.setColumnOrder(next);
  }

  return (
    <Menu
      side="bottom"
      align="end"
      trigger={
        <button
          type="button"
          aria-label={t("harbor.datatable.menu.open") || "Column menu"}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ insetInlineEnd: offsetEnd }}
          className={cn(
            "absolute inset-y-0 my-auto w-5 h-5 rounded grid place-items-center",
            "text-white/45 hover:text-white hover:bg-white/10",
            "opacity-0 group-hover:opacity-100 transition-opacity",
          )}
        >
          <span aria-hidden className="text-[14px] leading-none">⋯</span>
        </button>
      }
    >
      {col.sortable ? (
        <>
          <MenuItem
            onClick={() => setSortDir("asc")}
            disabled={sortEntry?.direction === "asc"}
          >
            {t("harbor.datatable.menu.sortAsc")}
          </MenuItem>
          <MenuItem
            onClick={() => setSortDir("desc")}
            disabled={sortEntry?.direction === "desc"}
          >
            {t("harbor.datatable.menu.sortDesc")}
          </MenuItem>
          {sortEntry ? (
            <MenuItem onClick={() => setSortDir(null)}>
              {t("harbor.datatable.menu.clearSort")}
            </MenuItem>
          ) : null}
          <MenuSeparator />
        </>
      ) : null}

      <MenuItem
        onClick={() => table.pinColumn(col.id, "start")}
        disabled={pinSide === "start"}
      >
        {t("harbor.datatable.menu.pinStart")}
      </MenuItem>
      <MenuItem
        onClick={() => table.pinColumn(col.id, "end")}
        disabled={pinSide === "end"}
      >
        {t("harbor.datatable.menu.pinEnd")}
      </MenuItem>
      {pinSide ? (
        <MenuItem onClick={() => table.pinColumn(col.id, null)}>
          {t("harbor.datatable.menu.unpin")}
        </MenuItem>
      ) : null}
      <MenuSeparator />

      <MenuItem onClick={() => move(-1)} disabled={!canMoveLeft}>
        {t("harbor.datatable.menu.moveLeft")}
      </MenuItem>
      <MenuItem onClick={() => move(1)} disabled={!canMoveRight}>
        {t("harbor.datatable.menu.moveRight")}
      </MenuItem>

      {canHide ? (
        <>
          <MenuSeparator />
          <MenuItem
            onClick={() => table.toggleColumnVisibility(col.id)}
            danger
          >
            {t("harbor.datatable.menu.hide")}
          </MenuItem>
        </>
      ) : null}
    </Menu>
  );
}

/* ================================================================== */
/* ColumnVisibilityPicker — toolbar dropdown with a checkbox per col   */
/* ================================================================== */

interface ColumnVisibilityPickerProps<T> {
  table: TableInstance<T>;
}

/* ================================================================== */
/* EditingCellInput — inline input rendered inside an editing cell     */
/* ================================================================== */

interface EditingCellInputProps<T> {
  row: T;
  value: unknown;
  config: NonNullable<ColumnDef<T>["editable"]>;
  onCommit: (next: unknown) => void;
  onCancel: () => void;
}

function EditingCellInput<T>({
  row,
  value,
  config,
  onCommit,
  onCancel,
}: EditingCellInputProps<T>) {
  const initial =
    config.type === "number"
      ? typeof value === "number"
        ? value
        : Number(value ?? 0)
      : value == null
        ? ""
        : String(value);
  const [draft, setDraft] = useState<string | number>(
    initial as string | number,
  );
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  useEffect(() => {
    // Auto-focus + select-all so a second click doesn't land caret
    // somewhere awkward.
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (
      "setSelectionRange" in el &&
      typeof (el as HTMLInputElement).setSelectionRange === "function"
    ) {
      try {
        (el as HTMLInputElement).select();
      } catch {
        // select() fails on non-text inputs (number / select) — ignore.
      }
    }
  }, []);

  function attempt(next: unknown) {
    const v = config.validate?.(next, row);
    if (v !== undefined && v !== true) {
      setError(v);
      return false;
    }
    setError(null);
    onCommit(next);
    return true;
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      attempt(draft);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    } else if (e.key === "Tab") {
      // Commit on Tab but let focus leave naturally — the parent grid
      // will pick up keyboard focus afterwards.
      attempt(draft);
    }
    // Stop Arrow / Space / Cmd-A bleeding into the grid's key handler.
    e.stopPropagation();
  }

  const common = {
    ref: ref as React.Ref<HTMLInputElement & HTMLSelectElement>,
    onKeyDown: onKey,
    onBlur: () => attempt(draft),
    "aria-invalid": error ? true : undefined,
    className: cn(
      "w-full h-7 px-2 rounded-md text-sm text-white outline-none",
      "bg-[#14141c] border",
      error ? "border-rose-400/70" : "border-fuchsia-400/60",
    ),
  } as const;

  if (config.type === "select") {
    return (
      <span className="relative block w-full">
        <select
          {...common}
          value={String(draft ?? "")}
          onChange={(e) => setDraft(e.target.value)}
        >
          {(config.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error ? (
          <span
            role="alert"
            className="absolute left-0 top-full mt-1 text-[10px] text-rose-300"
          >
            {error}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <span className="relative block w-full">
      <input
        {...common}
        type={config.type === "number" ? "number" : "text"}
        value={String(draft ?? "")}
        onChange={(e) =>
          setDraft(
            config.type === "number"
              ? e.target.value === ""
                ? ""
                : Number(e.target.value)
              : e.target.value,
          )
        }
      />
      {error ? (
        <span
          role="alert"
          className="absolute left-0 top-full mt-1 text-[10px] text-rose-300"
        >
          {error}
        </span>
      ) : null}
    </span>
  );
}

/* ================================================================== */
/* ExpandToggle — caret button inside a row's first data cell          */
/* ================================================================== */

interface ExpandToggleProps {
  expanded: boolean;
  indent: number;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ExpandToggle({ expanded, indent, onToggle }: ExpandToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse row" : "Expand row"}
      className={cn(
        "me-1.5 w-5 h-5 rounded grid place-items-center shrink-0",
        "text-white/55 hover:text-white hover:bg-white/10 transition-colors",
      )}
      style={{ marginInlineStart: indent > 0 ? indent * 20 : 0 }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 160ms ease",
        }}
        aria-hidden
      >
        <path d="M9 6 L15 12 L9 18" />
      </svg>
    </button>
  );
}

/* ================================================================== */
/* GroupRow — single full-width grouping header with aggregates        */
/* ================================================================== */

interface GroupRowProps<T> {
  item: Extract<RowItem<T>, { kind: "group" }>;
  layout: Layout<T>;
  selectable: boolean;
  density: Density;
  onToggle: () => void;
}

function GroupRow<T>({
  item,
  layout,
  selectable,
  density,
  onToggle,
}: GroupRowProps<T>) {
  const groupCol = layout.columnsById.get(item.groupId);
  const groupLabel =
    typeof groupCol?.header === "string"
      ? groupCol.header
      : groupCol?.id ?? item.groupId;
  const groupValue =
    item.groupValue == null ? "—" : String(item.groupValue);

  // Columns with an `aggregate` configured. Rendered as a compact inline
  // list (`Avg CPU 67`, `Sum Requests 12.4k`, …) alongside the group
  // value + count.
  const aggregates = layout.orderedColumns
    .filter((c) => c.aggregate != null && c.id !== item.groupId)
    .map((c) => {
      const value = aggregateColumn(c, item.rows);
      if (value == null) return null;
      const label =
        typeof c.header === "string" ? c.header : c.id;
      return { id: c.id, label, value };
    })
    .filter(Boolean) as Array<{
    id: string;
    label: string;
    value: unknown;
  }>;

  return (
    <div
      role="row"
      aria-expanded={item.expanded}
      className={cn(
        "border-b border-white/8 bg-white/[0.03]",
        "flex items-center gap-3 min-w-max",
        "text-[11px] uppercase tracking-wider text-white/70",
        CELL_PADDING_X[density],
        ROW_HEIGHT_CLASS[density],
      )}
      onClick={onToggle}
    >
      {selectable ? (
        <span className="w-10 shrink-0" aria-hidden />
      ) : null}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={item.expanded ? "Collapse group" : "Expand group"}
        aria-expanded={item.expanded}
        className="w-5 h-5 rounded grid place-items-center text-white/55 hover:text-white hover:bg-white/10"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: item.expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
          aria-hidden
        >
          <path d="M9 6 L15 12 L9 18" />
        </svg>
      </button>
      <span className="text-white/55 font-normal normal-case">
        {groupLabel}
      </span>
      <span className="text-white font-medium normal-case">{groupValue}</span>
      <span className="text-white/40 normal-case">· {item.count}</span>
      {aggregates.length > 0 ? (
        <span className="flex items-center gap-3 normal-case text-white/55 font-normal">
          {aggregates.map((a) => (
            <span key={a.id}>
              <span className="text-white/40">{a.label}:</span>{" "}
              <span className="text-white/80">{formatAggregate(a.value)}</span>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}

function formatAggregate(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "number") {
    return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(2);
  }
  return String(v);
}

/* ================================================================== */
/* SkeletonRows — loading placeholder that matches column widths       */
/* ================================================================== */

interface SkeletonRowsProps<T> {
  columns: readonly ColumnDef<T>[];
  selectable: boolean;
  count: number;
  density: Density;
  gridStyle: CSSProperties;
}

function SkeletonRows<T>({
  columns,
  selectable,
  count,
  density,
  gridStyle,
}: SkeletonRowsProps<T>) {
  // Deterministic pseudo-random widths so each skeleton row looks
  // varied without re-rolling on every render.
  const widthFor = (i: number, j: number) => 40 + ((i * 53 + j * 17) % 55);
  return (
    <div role="rowgroup" aria-busy="true">
      {Array.from({ length: Math.max(1, count) }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          role="row"
          aria-hidden
          className="grid border-b border-white/5"
          style={gridStyle}
        >
          {selectable ? (
            <div
              className={cn(
                "flex items-center justify-center",
                CELL_PADDING_X[density],
                ROW_HEIGHT_CLASS[density],
              )}
            >
              <Skeleton width={14} height={14} />
            </div>
          ) : null}
          {columns.map((col, colIdx) => (
            <div
              key={col.id}
              className={cn(
                "flex items-center",
                CELL_PADDING_X[density],
                ROW_HEIGHT_CLASS[density],
              )}
            >
              <Skeleton width={`${widthFor(rowIdx, colIdx)}%`} height={12} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* ErrorPanel — body-replacing error state with optional retry         */
/* ================================================================== */

interface ErrorPanelProps {
  error: ReactNode;
  onRetry?: () => void;
}

function ErrorPanel({ error, onRetry }: ErrorPanelProps) {
  const { t } = useT();
  // A plain string / number is the title; anything richer owns its own
  // layout (consumer's responsibility).
  const isSimple =
    typeof error === "string" ||
    typeof error === "number" ||
    error instanceof Error;
  if (!isSimple) {
    return (
      <div className="p-10 grid place-items-center" role="alert">
        {error}
      </div>
    );
  }
  const message =
    error instanceof Error ? error.message : String(error);
  return (
    <div
      role="alert"
      className="p-10 flex flex-col items-center justify-center gap-3 text-center"
    >
      <div className="w-10 h-10 rounded-full grid place-items-center bg-rose-500/15 text-rose-300">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 7v6" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <div className="text-sm text-white/85">{message}</div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "mt-1 px-3 h-8 rounded-md text-xs",
            "bg-white/5 border border-white/10 text-white/85",
            "hover:bg-white/10 transition-colors",
          )}
        >
          {t("harbor.action.retry") || "Retry"}
        </button>
      ) : null}
    </div>
  );
}

/* ================================================================== */
/* GlobalSearchInput — debounced search, wired to state.globalFilter   */
/* ================================================================== */

interface GlobalSearchInputProps {
  value: string;
  onCommit: (q: string) => void;
  debounce: number;
  placeholder?: string;
}

function GlobalSearchInput({
  value,
  onCommit,
  debounce,
  placeholder,
}: GlobalSearchInputProps) {
  const { t } = useT();
  const [local, setLocal] = useState(value);
  const timer = useRef<number | null>(null);

  // Sync local state when the controlled value changes from outside
  // (e.g. consumer cleared the filter programmatically).
  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function onChange(next: string) {
    setLocal(next);
    if (timer.current) window.clearTimeout(timer.current);
    if (debounce <= 0) {
      onCommit(next);
      return;
    }
    timer.current = window.setTimeout(() => onCommit(next), debounce);
  }

  return (
    <div className="relative w-full max-w-xs">
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="absolute inset-y-0 start-2.5 my-auto text-white/40"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={local}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          placeholder ?? t("harbor.search.placeholder") ?? "Search…"
        }
        aria-label={
          placeholder ?? t("harbor.search.placeholder") ?? "Search"
        }
        className={cn(
          "w-full h-8 ps-8 pe-3 rounded-md text-sm text-white",
          "bg-white/5 border border-white/10",
          "placeholder:text-white/30",
          "focus:outline-none focus:border-fuchsia-400/60",
        )}
      />
    </div>
  );
}

function ColumnVisibilityPicker<T>({ table }: ColumnVisibilityPickerProps<T>) {
  const { t } = useT();
  const visible = (col: ColumnDef<T>) =>
    table.state.columnVisibility[col.id] !== false;
  const allVisible = table.columns.every(visible);
  const noneVisible = table.columns.every((c) => !visible(c));

  function showAll() {
    for (const c of table.columns) {
      if (!visible(c)) table.toggleColumnVisibility(c.id);
    }
  }
  function hideAll() {
    for (const c of table.columns) {
      if (visible(c) && c.hideable !== false) {
        table.toggleColumnVisibility(c.id);
      }
    }
  }

  return (
    <Menu
      side="bottom"
      align="end"
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 px-3 h-8 rounded-md text-xs",
            "bg-white/5 border border-white/10 text-white/75",
            "hover:bg-white/[0.08] hover:text-white transition-colors",
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <rect x="3" y="4" width="4" height="16" rx="1" />
            <rect x="10" y="4" width="4" height="16" rx="1" />
            <rect x="17" y="4" width="4" height="16" rx="1" />
          </svg>
          {t("harbor.datatable.columns.title") || "Columns"}
        </button>
      }
    >
      <MenuItem onClick={showAll} disabled={allVisible}>
        {t("harbor.datatable.columns.showAll") || "Show all"}
      </MenuItem>
      <MenuItem onClick={hideAll} disabled={noneVisible}>
        {t("harbor.datatable.columns.hideAll") || "Hide all"}
      </MenuItem>
      <MenuSeparator />
      {table.columns.map((col) => {
        const isVisible = visible(col);
        const locked = col.hideable === false;
        return (
          <MenuItem
            key={col.id}
            disabled={locked}
            onClick={() =>
              locked ? undefined : table.toggleColumnVisibility(col.id)
            }
            icon={
              <span
                aria-hidden
                className={cn(
                  "w-3.5 h-3.5 rounded border grid place-items-center",
                  isVisible
                    ? "bg-fuchsia-500 border-fuchsia-400"
                    : "border-white/30",
                )}
              >
                {isVisible ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 12 L10 17 L19 7" />
                  </svg>
                ) : null}
              </span>
            }
          >
            {typeof col.header === "string"
              ? col.header
              : typeof col.header === "number"
                ? String(col.header)
                : col.id}
          </MenuItem>
        );
      })}
    </Menu>
  );
}
