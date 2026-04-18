import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

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
  selected?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  dense?: boolean;
  className?: string;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  selectable,
  selected = [],
  onSelectionChange,
  onRowClick,
  dense,
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

  const allSelected =
    selectable && rows.length > 0 && selected.length === rows.length;

  function toggleAll() {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : rows.map(rowKey));
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
                      selected.length > 0 &&
                      selected.length < rows.length
                    }
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((c) => {
                const key = String(c.key);
                const active = sort?.key === key;
                return (
                  <th
                    key={key}
                    style={{ width: c.width }}
                    className={cn(
                      "px-4 py-3 font-medium text-[11px] uppercase tracking-wider text-white/40 select-none",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.sortable && "cursor-pointer hover:text-white/70",
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
                        <motion.span
                          animate={{
                            opacity: active ? 1 : 0.25,
                            rotate: active && sort?.dir === "desc" ? 180 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="inline-block text-white/70"
                        >
                          ↑
                        </motion.span>
                      ) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sorted.map((row) => {
                const id = rowKey(row);
                const isSelected = selected.includes(id);
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
                        <CheckCell
                          checked={isSelected}
                          onChange={() => toggleOne(id)}
                        />
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
        </table>
      </div>
      {rows.length === 0 && emptyState ? (
        <div className="p-10 grid place-items-center">{emptyState}</div>
      ) : null}
    </div>
  );
}

function CheckCell({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      whileTap={{ scale: 0.85 }}
      animate={{
        background:
          checked || indeterminate
            ? "linear-gradient(135deg,#a855f7,#38bdf8)"
            : "rgba(255,255,255,0.03)",
        borderColor:
          checked || indeterminate
            ? "transparent"
            : "rgba(255,255,255,0.18)",
      }}
      className="w-4 h-4 rounded border grid place-items-center"
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
