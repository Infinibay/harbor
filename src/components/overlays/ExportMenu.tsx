import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";
import { Checkbox } from "../inputs/Checkbox";

export type ExportFormat = "csv" | "json" | "xlsx" | "ndjson";

export interface ExportOptions {
  format: ExportFormat;
  includeHeaders: boolean;
  currentFilterOnly: boolean;
  allColumns: boolean;
}

export interface ExportMenuProps {
  /** Called when the user clicks "Export". Caller serializes. */
  onExport: (opts: ExportOptions) => void;
  /** Formats to offer. Default: all four. */
  formats?: readonly ExportFormat[];
  /** Trigger label. */
  label?: ReactNode;
  /** Disable certain options (e.g. if you don't have a filter). */
  disable?: Partial<{ currentFilterOnly: boolean; allColumns: boolean; includeHeaders: boolean }>;
  className?: string;
}

const FMT_LABEL: Record<ExportFormat, string> = {
  csv: "CSV",
  json: "JSON",
  xlsx: "XLSX",
  ndjson: "NDJSON",
};
const FMT_DESC: Record<ExportFormat, string> = {
  csv: "Comma-separated · spreadsheet-friendly",
  json: "Pretty-printed array",
  xlsx: "Excel workbook",
  ndjson: "One JSON object per line",
};

/** Dropdown for exporting data in multiple formats with per-format
 *  options. Emits a structured `ExportOptions` object via `onExport`. */
export function ExportMenu({
  onExport,
  formats = ["csv", "json", "xlsx", "ndjson"],
  label = "Export",
  disable,
  className,
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>(formats[0]);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [currentFilterOnly, setCurrentFilterOnly] = useState(true);
  const [allColumns, setAllColumns] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const popoverZ = useZIndex(Z.POPOVER);

  function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    const r = anchorRef.current?.getBoundingClientRect();
    if (r) setPos({ x: r.right - 280, y: r.bottom + 6 });
    setOpen(true);
  }

  function submit() {
    onExport({ format, includeHeaders, currentFilterOnly, allColumns });
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] px-3 py-1.5 text-sm text-[rgb(var(--harbor-text-muted))] outline-none hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))] focus-visible:shadow-[var(--harbor-focus-shadow)]",
          className,
        )}
      >
        ⤓ {label}
      </button>
      <Portal>
        <AnimatePresence>
          {open ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0"
                style={{ zIndex: popoverZ - 1 }}
              />
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 520, damping: 32 }}
                style={{
                  position: "fixed",
                  left: pos.x,
                  top: pos.y,
                  zIndex: popoverZ,
                }}
                className="w-[280px] rounded-xl border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-3 shadow-[var(--harbor-menu-surface-shadow)] flex flex-col gap-2"
              >
                <div className="text-[10px] uppercase tracking-widest text-[rgb(var(--harbor-text-subtle))]">
                  Format
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {formats.map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "p-2 rounded-md border text-left",
                        format === f
                          ? "border-[color:var(--harbor-focus-ring)] bg-[var(--harbor-state-selected)]"
                          : "border-[color:var(--harbor-border-default)] hover:bg-[var(--harbor-state-hover)]",
                      )}
                    >
                      <div className="text-xs text-[rgb(var(--harbor-text))] font-semibold">
                        {FMT_LABEL[f]}
                      </div>
                      <div className="text-[10px] text-[rgb(var(--harbor-text-muted))] mt-0.5 leading-tight">
                        {FMT_DESC[f]}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 pt-1 border-t border-[color:var(--harbor-border-subtle)]">
                  <Checkbox
                    checked={includeHeaders}
                    disabled={disable?.includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                    label="Include headers"
                  />
                  <Checkbox
                    checked={currentFilterOnly}
                    disabled={disable?.currentFilterOnly}
                    onChange={(e) => setCurrentFilterOnly(e.target.checked)}
                    label="Current filter only"
                  />
                  <Checkbox
                    checked={allColumns}
                    disabled={disable?.allColumns}
                    onChange={(e) => setAllColumns(e.target.checked)}
                    label="All columns (not just visible)"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))] px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="text-xs font-medium px-3 py-1 rounded-md bg-[rgb(var(--harbor-brand))] text-[rgb(var(--harbor-brand-fg))] hover:bg-[rgb(var(--harbor-accent-2))]"
                  >
                    Export
                  </button>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
