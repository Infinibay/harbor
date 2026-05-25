import { useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { formatAbsolute } from "../../lib/format";
import { Select } from "./Select";

export interface CronBuilderProps {
  value: string;
  onChange: (next: string) => void;
  /** Hide the preset chips row. */
  hidePresets?: boolean;
  className?: string;
}

type Mode = "every" | "list" | "any";
type FieldState = { mode: Mode; every?: number; list?: number[] };

interface ParsedCron {
  minute: FieldState;
  hour: FieldState;
  dom: FieldState;
  month: FieldState;
  dow: FieldState;
}

const PRESETS: { label: string; expr: string }[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily @ 3 AM", expr: "0 3 * * *" },
  { label: "Weekly (Mon 9 AM)", expr: "0 9 * * 1" },
  { label: "Monthly (1st 0:00)", expr: "0 0 1 * *" },
];

function parseField(s: string): FieldState {
  if (s === "*") return { mode: "any" };
  if (/^\*\/\d+$/.test(s)) return { mode: "every", every: Number(s.slice(2)) };
  if (/^\d+(,\d+)*$/.test(s)) return { mode: "list", list: s.split(",").map(Number) };
  return { mode: "any" };
}
function fieldToString(f: FieldState): string {
  if (f.mode === "any") return "*";
  if (f.mode === "every") return `*/${f.every ?? 1}`;
  if (f.mode === "list") return (f.list ?? []).join(",") || "*";
  return "*";
}

function parse(cron: string): ParsedCron {
  const parts = cron.trim().split(/\s+/);
  const safe = parts.length === 5 ? parts : ["*", "*", "*", "*", "*"];
  return {
    minute: parseField(safe[0]),
    hour: parseField(safe[1]),
    dom: parseField(safe[2]),
    month: parseField(safe[3]),
    dow: parseField(safe[4]),
  };
}
function toCron(p: ParsedCron): string {
  return [p.minute, p.hour, p.dom, p.month, p.dow].map(fieldToString).join(" ");
}

// Approximate "next run" calc — brute-force minute iteration up to 7 days.
function nextRun(cron: string, from: Date = new Date()): Date | null {
  const p = parse(cron);
  const start = new Date(from.getTime());
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);
  for (let i = 0; i < 60 * 24 * 7; i++) {
    const d = new Date(start.getTime() + i * 60_000);
    if (matches(d, p)) return d;
  }
  return null;
}

function matches(d: Date, p: ParsedCron): boolean {
  return (
    matchField(d.getMinutes(), p.minute, 60) &&
    matchField(d.getHours(), p.hour, 24) &&
    matchField(d.getDate(), p.dom, 31, 1) &&
    matchField(d.getMonth() + 1, p.month, 12, 1) &&
    matchField(d.getDay(), p.dow, 7)
  );
}
function matchField(v: number, f: FieldState, _modulo: number, base = 0): boolean {
  if (f.mode === "any") return true;
  if (f.mode === "every") return f.every && f.every > 0 ? ((v - base) % f.every) === 0 : false;
  if (f.mode === "list") return (f.list ?? []).includes(v);
  return true;
}

/** Visual cron expression builder (5-field POSIX).
 *  Emits the cron string via `onChange`; shows the computed next-run
 *  preview below. For quartz (6-field) callers should author their own
 *  variant — plan notes a future `variant` prop. */
export function CronBuilder({
  value,
  onChange,
  hidePresets,
  className,
}: CronBuilderProps) {
  const parsed = useMemo(() => parse(value), [value]);
  const [humanReadable, setHumanReadable] = useState(true);

  function update(patch: Partial<ParsedCron>) {
    onChange(toCron({ ...parsed, ...patch }));
  }

  const next1 = useMemo(() => nextRun(value), [value]);
  const next2 = useMemo(() => (next1 ? nextRun(value, next1) : null), [value, next1]);
  const next3 = useMemo(() => (next2 ? nextRun(value, next2) : null), [value, next2]);

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {!hidePresets ? (
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p.label}
              onClick={() => onChange(p.expr)}
              className={cn(
                "text-xs px-2 py-1 rounded-md border transition-colors",
                value.trim() === p.expr
                  ? "bg-[var(--harbor-state-selected)] border-[color:var(--harbor-border-focus)] text-[color:var(--harbor-state-selected-fg)]"
                  : "bg-[var(--harbor-field-bg)] border-[color:var(--harbor-field-border)] text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-state-hover)] hover:text-[color:var(--harbor-field-fg)]",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-5 gap-2">
        <Field label="Minute (0-59)" state={parsed.minute} onChange={(f) => update({ minute: f })} max={59} />
        <Field label="Hour (0-23)" state={parsed.hour} onChange={(f) => update({ hour: f })} max={23} />
        <Field label="Day of month (1-31)" state={parsed.dom} onChange={(f) => update({ dom: f })} max={31} min={1} />
        <Field label="Month (1-12)" state={parsed.month} onChange={(f) => update({ month: f })} max={12} min={1} />
        <Field label="Day of week (0=Sun)" state={parsed.dow} onChange={(f) => update({ dow: f })} max={6} />
      </div>

      <div className="flex items-center justify-between">
        <code className="text-sm font-mono text-[color:var(--harbor-state-selected-fg)] tabular-nums px-2 py-1 rounded bg-[var(--harbor-state-selected)] border border-[color:var(--harbor-border-focus)]">
          {value.trim() || "* * * * *"}
        </code>
        <button
          type="button"
          onClick={() => setHumanReadable((v) => !v)}
          className="text-xs text-[color:var(--harbor-text-tertiary)] hover:text-[color:var(--harbor-field-fg)]"
        >
          {humanReadable ? "hide next runs" : "show next runs"}
        </button>
      </div>

      {humanReadable ? (
        <div className="text-xs text-[color:var(--harbor-field-muted-fg)] flex flex-col gap-0.5 bg-[var(--harbor-surface-panel)] border border-[color:var(--harbor-border-subtle)] rounded-md p-3">
          <span className="text-[10px] uppercase tracking-widest text-[color:var(--harbor-text-tertiary)]">
            Next runs
          </span>
          {[next1, next2, next3].map((d, i) =>
            d ? (
              <span key={i} className="tabular-nums font-mono text-[color:var(--harbor-field-fg)]">
                {formatAbsolute(d, { preset: "datetime" })}
              </span>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  state,
  onChange,
  max,
  min = 0,
}: {
  label: string;
  state: FieldState;
  onChange: (f: FieldState) => void;
  max: number;
  min?: number;
}) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-1">
      <div
        id={labelId}
        className="text-[10px] uppercase tracking-widest text-[color:var(--harbor-field-muted-fg)]"
      >
        {label}
      </div>
      <Select
        size="sm"
        value={state.mode}
        onChange={(mode) => onChange({ ...state, mode: mode as Mode })}
        options={[
          { value: "any", label: "Any" },
          { value: "every", label: "Every N" },
          { value: "list", label: "List" },
        ]}
        className="w-full"
      />
      {state.mode === "every" ? (
        <input
          aria-labelledby={labelId}
          type="number"
          min={1}
          max={max}
          value={state.every ?? 1}
          onChange={(e) => onChange({ ...state, every: Number(e.target.value) })}
          className="min-h-[calc(var(--harbor-target-input-height)-8px)] rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-[var(--harbor-target-menu-item-padding-x)] py-[var(--harbor-target-menu-item-padding-y)] font-mono text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] tabular-nums outline-none focus:border-[color:var(--harbor-field-border-focus)]"
        />
      ) : null}
      {state.mode === "list" ? (
        <input
          aria-labelledby={labelId}
          type="text"
          value={(state.list ?? []).join(",")}
          onChange={(e) =>
            onChange({
              ...state,
              list: e.target.value
                .split(",")
                .map((s) => Number(s.trim()))
                .filter((n) => !isNaN(n) && n >= min && n <= max),
            })
          }
          placeholder={`${min},${min + 1},${max}`}
          className="min-h-[calc(var(--harbor-target-input-height)-8px)] rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-field-bg)] px-[var(--harbor-target-menu-item-padding-x)] py-[var(--harbor-target-menu-item-padding-y)] font-mono text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] tabular-nums outline-none placeholder:text-[color:var(--harbor-field-placeholder)] focus:border-[color:var(--harbor-field-border-focus)]"
        />
      ) : null}
    </div>
  );
}
