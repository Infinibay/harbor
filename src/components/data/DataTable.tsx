import { useMemo, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
import { LoadingOverlay } from "../feedback/LoadingOverlay";
import { useDataTable, getCellValue } from "./table/useDataTable";
import type { Density, UseDataTableOptions } from "./table/types";

export type {
  Align,
  CellContext,
  ColumnDef,
  Density,
  ColumnFilterDef,
  FilterState,
  FilterType,
  HeaderContext,
  SortState,
  TableInstance,
  UseDataTableOptions,
} from "./table/types";
export { useDataTable, getCellValue } from "./table/useDataTable";

export interface DataTableProps<T> extends UseDataTableOptions<T> {
  /** Enable the selection checkbox column. Default `false`. */
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
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_MIN_WIDTH = 120;

const ROW_HEIGHT: Record<Density, string> = {
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
 *  props (`selectable`, `onRowClick`, `loading`, `hidePagination`, …).
 *
 *  ```tsx
 *  const columns: ColumnDef<Row>[] = [
 *    { id: "name", header: "Service", sortable: true },
 *    { id: "status", header: "Status",
 *      cell: (ctx) => <Badge tone="success">{ctx.value}</Badge> },
 *    { id: "cpu", header: "CPU", align: "end", sortable: true },
 *  ];
 *
 *  <DataTable
 *    rows={services}
 *    columns={columns}
 *    rowId={(r) => r.id}
 *    selectable
 *    defaultSort={[{ id: "status", direction: "asc" }]}
 *  />
 *  ``` */
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
    className,
    style,
    ...hookOptions
  } = props;

  const table = useDataTable<T>(hookOptions);
  const { t } = useT();

  const { visibleColumns, pageRows, totalCount, state, rowId } = table;

  /* Grid template — one track per visible column (+ the selection
   *  column when enabled). Widths from `width` when given, else
   *  `minmax(<minWidth>, 1fr)` so auto-sized columns fill remaining
   *  space proportionally. */
  const gridTemplateColumns = useMemo(() => {
    const parts: string[] = [];
    if (selectable) parts.push("40px");
    for (const col of visibleColumns) {
      if (col.width != null) {
        parts.push(`${col.width}px`);
      } else {
        const min = col.minWidth ?? DEFAULT_MIN_WIDTH;
        const max = col.maxWidth != null ? `${col.maxWidth}px` : "1fr";
        parts.push(`minmax(${min}px, ${max})`);
      }
    }
    return parts.join(" ");
  }, [selectable, visibleColumns]);

  const rowStyle: CSSProperties = { gridTemplateColumns };

  const pageIds = pageRows.map(rowId);
  const allSelectedOnPage =
    pageIds.length > 0 && pageIds.every((id) => state.selection.has(id));
  const someSelectedOnPage =
    !allSelectedOnPage && pageIds.some((id) => state.selection.has(id));

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col",
        className,
      )}
      style={style}
    >
      {/* Scrollable grid region */}
      <div
        role="grid"
        aria-rowcount={totalCount}
        aria-colcount={visibleColumns.length + (selectable ? 1 : 0)}
        className="relative overflow-auto min-w-0"
      >
        <div className="min-w-max">
          {/* Header */}
          <div role="rowgroup" className="sticky top-0 z-10 bg-[#0f0f16]/95 backdrop-blur">
            <div
              role="row"
              aria-rowindex={1}
              className="grid border-b border-white/8"
              style={rowStyle}
            >
              {selectable ? (
                <div
                  role="columnheader"
                  aria-colindex={1}
                  className={cn(
                    "flex items-center justify-center",
                    CELL_PADDING_X[state.density],
                    ROW_HEIGHT[state.density],
                  )}
                >
                  <CheckCell
                    checked={allSelectedOnPage}
                    indeterminate={someSelectedOnPage}
                    onChange={() => table.selectAllOnPage()}
                    ariaLabel={t("harbor.datatable.selectAll") || "Select all rows on this page"}
                    disabled={pageRows.length === 0}
                  />
                </div>
              ) : null}
              {visibleColumns.map((col, idx) => {
                const sortEntry = state.sort.find((s) => s.id === col.id) ?? null;
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
                return (
                  <div
                    key={col.id}
                    role="columnheader"
                    aria-sort={ariaSort}
                    aria-colindex={idx + 1 + (selectable ? 1 : 0)}
                    className={cn(
                      "group flex items-center",
                      CELL_PADDING_X[state.density],
                      ROW_HEIGHT[state.density],
                      "text-[11px] uppercase tracking-wider font-medium text-white/45 select-none",
                      ALIGN_CLASS[col.align ?? "start"],
                      col.sortable &&
                        "cursor-pointer hover:text-white/85 transition-colors",
                      sortEntry && "text-white",
                    )}
                    onClick={(e) => {
                      if (!col.sortable) return;
                      table.toggleSort(col.id, e.shiftKey);
                    }}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "end" && "flex-row-reverse",
                      )}
                    >
                      <span className="truncate">{headerNode}</span>
                      {col.sortable ? (
                        <SortIndicator direction={sortEntry?.direction ?? null} />
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          {loading ? null : (
            <div role="rowgroup">
              {pageRows.length === 0 ? (
                <div className="p-10 grid place-items-center">
                  {emptyState ?? (
                    <span className="text-white/40 text-sm">
                      {t("harbor.datatable.empty") || "No data"}
                    </span>
                  )}
                </div>
              ) : (
                pageRows.map((row, rowIndex) => {
                  const id = rowId(row);
                  const selected = state.selection.has(id);
                  const canSelect =
                    !selectable ||
                    (isRowSelectable ? isRowSelectable(row) : true);
                  return (
                    <motion.div
                      key={id}
                      role="row"
                      aria-rowindex={rowIndex + 2} // +1 for header, +1 for 1-based
                      aria-selected={selectable ? selected : undefined}
                      initial={false}
                      className={cn(
                        "grid border-b border-white/5 transition-colors",
                        "hover:bg-white/[0.03]",
                        selected && "bg-fuchsia-500/[0.08]",
                        onRowClick && "cursor-pointer",
                      )}
                      style={rowStyle}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable ? (
                        <div
                          role="gridcell"
                          className={cn(
                            "flex items-center justify-center",
                            CELL_PADDING_X[state.density],
                            ROW_HEIGHT[state.density],
                          )}
                          onClick={(e) => e.stopPropagation()}
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
                              ariaLabel={t("harbor.datatable.selectRow") || "Select row"}
                            />
                          ) : null}
                        </div>
                      ) : null}
                      {visibleColumns.map((col, colIndex) => {
                        const value = getCellValue(col, row);
                        const content = col.cell
                          ? col.cell({ row, value, rowIndex, column: col })
                          : value == null
                            ? ""
                            : String(value);
                        return (
                          <div
                            key={col.id}
                            role="gridcell"
                            aria-colindex={colIndex + 1 + (selectable ? 1 : 0)}
                            className={cn(
                              "flex items-center",
                              CELL_PADDING_X[state.density],
                              ROW_HEIGHT[state.density],
                              "text-white/85 text-sm",
                              ALIGN_CLASS[col.align ?? "start"],
                            )}
                          >
                            <span className="truncate">{content}</span>
                          </div>
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

      {/* Pagination */}
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
/* Internal components                                                  */
/* ================================================================== */

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
          <span>
            {t("harbor.datatable.rowsPerPage") || "Rows per page"}
          </span>
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
