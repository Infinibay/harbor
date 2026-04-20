import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
import { LoadingOverlay } from "../feedback/LoadingOverlay";

export interface Column<T> {
  key: keyof T | string;
  label: ReactNode;
  width?: number | string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  /** When provided, controls per-row checkbox visibility. Rows for which
   *  this returns false render an empty selection cell. Does not affect
   *  click behaviour. */
  isRowSelectable?: (row: T) => boolean;
  selected?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  dense?: boolean;
  /** Render a centered LoadingOverlay instead of the tbody. The header
   *  stays in place so layout doesn't jump. */
  loading?: boolean;
  loadingLabel?: ReactNode;
  className?: string;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  selectable,
  isRowSelectable,
  selected = [],
  onSelectionChange,
  onRowClick,
  dense,
  loading,
  loadingLabel,
  className,
  emptyState,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => String(c.key) === sort.key);
    if (!col) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = (a as any)[sort.key];
      const bv = (b as any)[sort.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      const c =
        typeof av === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, {
              numeric: true,
            });
      return sort.dir === "asc" ? c : -c;
    });
    return copy;
  }, [rows, columns, sort]);

  const selectableRowIds = useMemo(() => {
    if (!selectable) return [];
    if (!isRowSelectable) return rows.map(rowKey);
    return rows.filter(isRowSelectable).map(rowKey);
  }, [selectable, isRowSelectable, rows, rowKey]);

  const allSelected =
    selectable &&
    selectableRowIds.length > 0 &&
    selectableRowIds.every((id) => selected.includes(id));

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selected.filter((id) => !selectableRowIds.includes(id)));
    } else {
      const next = new Set(selected);
      selectableRowIds.forEach((id) => next.add(id));
      onSelectionChange([...next]);
    }
  }
  function toggleOne(id: string) {
    if (!onSelectionChange) return;
    onSelectionChange(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id],
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left" cellPadding={0}>
          <thead>
            <tr className="border-b border-white/8">
              {selectable ? (
                <th className="w-10 px-4 py-3">
                  <CheckCell
                    checked={!!allSelected}
                    indeterminate={
                      !!selectable &&
                      selectableRowIds.some((id) => selected.includes(id)) &&
                      !allSelected
                    }
                    onChange={toggleAll}
                    disabled={selectableRowIds.length === 0}
                  />
                </th>
              ) : null}
              {columns.map((c) => {
                const key = String(c.key);
                const active = sort?.key === key;
                const dir = active ? sort?.dir : null;
                return (
                  <th
                    key={key}
                    style={{ width: c.width }}
                    className={cn(
                      "group px-4 py-3 font-medium text-[11px] uppercase tracking-wider text-white/45 select-none transition-colors",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.sortable && "cursor-pointer hover:text-white/85",
                      active && "text-white",
                    )}
                    onClick={() => {
                      if (!c.sortable) return;
                      setSort((s) =>
                        s?.key === key
                          ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
                          : { key, dir: "asc" },
                      );
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {c.label}
                      {c.sortable ? (
                        <SortIndicator direction={dir} />
                      ) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          {!loading ? (
            <tbody>
              <AnimatePresence initial={false}>
                {sorted.map((row) => {
                  const id = rowKey(row);
                  const isSelected = selected.includes(id);
                  const rowSelectable =
                    !selectable ||
                    (isRowSelectable ? isRowSelectable(row) : true);
                  return (
                    <motion.tr
                      layout
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        "border-b border-white/5 transition-colors",
                        "hover:bg-white/[0.03]",
                        isSelected && "bg-fuchsia-500/5",
                        onRowClick && "cursor-pointer",
                      )}
                    >
                      {selectable ? (
                        <td
                          className="w-10 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rowSelectable ? (
                            <CheckCell
                              checked={isSelected}
                              onChange={() => toggleOne(id)}
                            />
                          ) : null}
                        </td>
                      ) : null}
                      {columns.map((c) => (
                        <td
                          key={String(c.key)}
                          className={cn(
                            "px-4 text-white/85",
                            dense ? "py-2" : "py-3",
                            c.align === "right" && "text-right",
                            c.align === "center" && "text-center",
                          )}
                        >
                          {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          ) : null}
        </table>
      </div>
      {loading ? (
        <LoadingOverlay label={loadingLabel} fill />
      ) : rows.length === 0 && emptyState ? (
        <div className="p-10 grid place-items-center">{emptyState}</div>
      ) : null}
    </div>
  );
}

function SortIndicator({
  direction,
}: {
  direction: "asc" | "desc" | null | undefined;
}) {
  if (direction === "asc") {
    return (
      <motion.span
        key="asc"
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="inline-block text-fuchsia-300"
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
      >
        ↓
      </motion.span>
    );
  }
  // Inactive but sortable — dual-arrow hint, clearly visible and brightens
  // on column hover so users understand the column is clickable.
  return (
    <span className="inline-block text-white/40 group-hover:text-white/70 transition-colors leading-none">
      ↕
    </span>
  );
}

function CheckCell({
  checked,
  indeterminate,
  onChange,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
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
      <AnimatePresence mode="wait">
        {indeterminate ? (
          <motion.span
            key="in"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="block w-2 h-0.5 bg-white rounded"
          />
        ) : checked ? (
          <motion.svg
            key="c"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 12 L10 17 L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </motion.svg>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
