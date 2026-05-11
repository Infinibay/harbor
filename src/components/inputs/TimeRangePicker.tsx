import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { formatAbsolute } from "../../lib/format";

export type TimeRangePreset = "15m" | "1h" | "6h" | "24h" | "7d" | "30d";

export interface AbsoluteRange {
  from: Date;
  to: Date;
}

export type TimeRangeValue = AbsoluteRange | { preset: TimeRangePreset };

export interface TimeRangePickerProps {
  value: TimeRangeValue;
  onChange: (v: TimeRangeValue, compare?: AbsoluteRange) => void;
  /** Preset chips shown inline. Default all presets. */
  presets?: TimeRangePreset[];
  /** Custom label formatter for the trigger button. */
  formatLabel?: (v: TimeRangeValue) => ReactNode;
  className?: string;
}

const PRESET_MS: Record<TimeRangePreset, number> = {
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "24h": 24 * 60 * 60_000,
  "7d": 7 * 24 * 60 * 60_000,
  "30d": 30 * 24 * 60 * 60_000,
};

const PRESET_LABEL: Record<TimeRangePreset, string> = {
  "15m": "15m",
  "1h": "1h",
  "6h": "6h",
  "24h": "24h",
  "7d": "7d",
  "30d": "30d",
};

/** Resolve a `TimeRangeValue` to concrete Dates (used by consumers that
 *  need absolute times — e.g. fetching metrics for the range). */
export function resolveTimeRange(v: TimeRangeValue, now = new Date()): AbsoluteRange {
  if ("preset" in v) {
    const ms = PRESET_MS[v.preset];
    return { from: new Date(now.getTime() - ms), to: now };
  }
  return v;
}

function toInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Time range control with preset chips + custom range popover.
 *
 *  Shift-click a preset to emit a compare-to-previous-period range via
 *  the `onChange` second argument — the caller fetches both and can
 *  render a compared chart. */
export function TimeRangePicker({
  value,
  onChange,
  presets = ["15m", "1h", "6h", "24h", "7d", "30d"],
  formatLabel,
  className,
}: TimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const resolved = resolveTimeRange(value);
  const isPreset = "preset" in value;

  function pickPreset(p: TimeRangePreset, shift: boolean) {
    if (shift) {
      const ms = PRESET_MS[p];
      const nowMs = Date.now();
      onChange(
        { preset: p },
        {
          from: new Date(nowMs - 2 * ms),
          to: new Date(nowMs - ms),
        },
      );
      return;
    }
    onChange({ preset: p });
  }

  function openCustom() {
    const r = anchorRef.current?.getBoundingClientRect();
    if (r) setPos({ x: r.right - 320, y: r.bottom + 6 });
    setOpen(true);
  }

  return (
    <div
      ref={anchorRef}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] p-0.5",
        className,
      )}
    >
      {presets.map((p) => {
        const active = isPreset && value.preset === p;
        return (
          <button
            type="button"
            key={p}
            onClick={(e) => pickPreset(p, e.shiftKey)}
            title={`Last ${PRESET_LABEL[p]} (shift-click to compare)`}
            aria-pressed={active}
            className={cn(
              "h-[calc(var(--harbor-target-control-height)-10px)] rounded-[var(--harbor-target-radius)] px-[var(--harbor-target-menu-item-padding-x)] text-[length:var(--harbor-target-font-size)] font-medium transition-colors",
              active
                ? "bg-fuchsia-500/20 text-fuchsia-100"
                : "text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]",
            )}
          >
            {PRESET_LABEL[p]}
          </button>
        );
      })}
      <span className="mx-1 h-4 w-px bg-[color:var(--harbor-field-border)]" />
      <button
        type="button"
        onClick={openCustom}
        aria-expanded={open}
        className={cn(
          "h-[calc(var(--harbor-target-control-height)-10px)] rounded-[var(--harbor-target-radius)] px-[var(--harbor-target-menu-item-padding-x)] text-[length:var(--harbor-target-font-size)] font-medium transition-colors",
          !isPreset
            ? "bg-fuchsia-500/20 text-fuchsia-100"
            : "text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]",
        )}
      >
        {formatLabel
          ? formatLabel(value)
          : !isPreset
            ? `${formatAbsolute(resolved.from, { preset: "date" })} → ${formatAbsolute(resolved.to, { preset: "date" })}`
            : "Custom…"}
      </button>

      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: Z.POPOVER,
              }}
              className="w-[320px] rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-target-panel-padding)] shadow-[var(--harbor-menu-surface-shadow)]"
            >
              <CustomRangeEditor
                initial={resolved}
                onApply={(r) => {
                  onChange(r);
                  setOpen(false);
                }}
                onCancel={() => setOpen(false)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}

function CustomRangeEditor({
  initial,
  onApply,
  onCancel,
}: {
  initial: AbsoluteRange;
  onApply: (r: AbsoluteRange) => void;
  onCancel: () => void;
}) {
  const [from, setFrom] = useState(toInputValue(initial.from));
  const [to, setTo] = useState(toInputValue(initial.to));
  return (
    <div className="flex flex-col gap-[var(--harbor-target-gap)]">
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--harbor-field-muted-fg)]">
        Custom range
      </div>
      <label className="flex flex-col gap-1 text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-muted-fg)]">
        From
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="min-h-[var(--harbor-target-input-height)] rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none focus:border-[color:var(--harbor-field-border-focus)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-muted-fg)]">
        To
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="min-h-[var(--harbor-target-input-height)] rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)] py-[var(--harbor-target-control-padding-y)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] outline-none focus:border-[color:var(--harbor-field-border-focus)]"
        />
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="h-[calc(var(--harbor-target-control-height)-8px)] rounded-[var(--harbor-target-radius)] px-[var(--harbor-target-menu-item-padding-x)] text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            const f = new Date(from);
            const t = new Date(to);
            if (isNaN(f.getTime()) || isNaN(t.getTime()) || f >= t) return;
            onApply({ from: f, to: t });
          }}
          className="h-[calc(var(--harbor-target-control-height)-8px)] rounded-[var(--harbor-target-radius)] bg-fuchsia-500/20 px-[var(--harbor-target-menu-item-padding-x)] text-[length:var(--harbor-target-font-size)] font-medium text-fuchsia-100 hover:bg-fuchsia-500/30"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
