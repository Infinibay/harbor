import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

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
        ref={anchorRef}
        onClick={toggleOpen}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.04] text-sm text-white/80 hover:bg-white/[0.08] hover:text-white",
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
                style={{ zIndex: Z.POPOVER - 1 }}
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
                  zIndex: Z.POPOVER,
                }}
                className="w-[280px] rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-3 flex flex-col gap-2"
              >
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  Format
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "p-2 rounded-md border text-left",
                        format === f
                          ? "border-fuchsia-400/50 bg-fuchsia-500/10"
                          : "border-white/10 hover:bg-white/[0.03]",
                      )}
                    >
                      <div className="text-xs text-white font-semibold">
                        {FMT_LABEL[f]}
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5 leading-tight">
                        {FMT_DESC[f]}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 pt-1 border-t border-white/8">
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={includeHeaders}
                      disabled={disable?.includeHeaders}
                      onChange={(e) => setIncludeHeaders(e.target.checked)}
                    />
                    Include headers
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={currentFilterOnly}
                      disabled={disable?.currentFilterOnly}
                      onChange={(e) => setCurrentFilterOnly(e.target.checked)}
                    />
                    Current filter only
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={allColumns}
                      disabled={disable?.allColumns}
                      onChange={(e) => setAllColumns(e.target.checked)}
                    />
                    All columns (not just visible)
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-xs text-white/60 hover:text-white px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    className="text-xs font-medium px-3 py-1 rounded-md bg-fuchsia-500/20 text-fuchsia-100 hover:bg-fuchsia-500/30"
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
