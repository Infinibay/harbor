import {
  useCallback,
  useEffect,
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
import { LoadingOverlay } from "../feedback/LoadingOverlay";
import { useDataTable, getCellValue } from "./table/useDataTable";
import type {
  ColumnDef,
  ColumnPinningState,
  ColumnWidthsState,
  Density,
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
  /** Show a `<LoadingOverlay>` over the body. Header stays in place. */
  loading?: boolean;
  loadingLabel?: ReactNode;
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
    loadingLabel,
    hidePagination,
    pageSizeOptions = [10, 25, 50, 100],
    maxHeight,
    rowHeight,
    overscan = 8,
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

  /* ---------- Virtualization ---------- */

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const virtualized = maxHeight != null;

  useEffect(() => {
    if (!virtualized) return;
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [virtualized]);

  const { startIdx, paddingTop, paddingBottom, renderRows } =
    useMemo(() => {
      if (!virtualized || !maxHeight) {
        return {
          startIdx: 0,
          paddingTop: 0,
          paddingBottom: 0,
          renderRows: pageRows,
        };
      }
      const visCount = Math.ceil(maxHeight / rowHeightPx) + overscan * 2;
      const s = Math.max(0, Math.floor(scrollTop / rowHeightPx) - overscan);
      const e = Math.min(pageRows.length, s + visCount);
      return {
        startIdx: s,
        paddingTop: s * rowHeightPx,
        paddingBottom: (pageRows.length - e) * rowHeightPx,
        renderRows: pageRows.slice(s, e),
      };
    }, [virtualized, maxHeight, rowHeightPx, scrollTop, overscan, pageRows]);

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
      <div
        role="grid"
        aria-rowcount={totalCount}
        aria-colcount={colCount}
        className="relative overflow-auto min-w-0"
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

          {/* Body */}
          {loading ? null : (
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
                renderRows.map((row, i) => {
                  const rowIndex = startIdx + i;
                  const id = rowId(row);
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
                        return (
                          <BodyCell
                            key={col.id}
                            density={state.density}
                            align={col.align ?? "start"}
                            colId={col.id}
                            ariaColIndex={colIndex + 1 + (selectable ? 1 : 0)}
                            stickyStart={
                              pinSide === "start" ? pinOffset : undefined
                            }
                            stickyEnd={pinSide === "end" ? pinOffset : undefined}
                            zIndex={pinSide ? 10 : undefined}
                          >
                            {content}
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

        {loading ? <LoadingOverlay label={loadingLabel} fill /> : null}
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
  density: Density;
  align?: "start" | "center" | "end";
  colId?: string;
  ariaColIndex?: number;
  stickyStart?: number;
  stickyEnd?: number;
  zIndex?: number;
  onClick?: (e: React.MouseEvent) => void;
  children: ReactNode;
}

function BodyCell({
  density,
  align = "start",
  colId,
  ariaColIndex,
  stickyStart,
  stickyEnd,
  zIndex,
  onClick,
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
      role="gridcell"
      aria-colindex={ariaColIndex}
      data-col-id={colId}
      className={cn(
        "flex items-center text-sm text-white/85",
        CELL_PADDING_X[density],
        ROW_HEIGHT_CLASS[density],
        ALIGN_CLASS[align],
      )}
      style={style}
      onClick={onClick}
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
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
