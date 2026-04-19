/**
 * Human-friendly formatters used across Harbor's infra components.
 *
 * Design goals:
 *  - Pure functions (no React, no stateful globals) — safe to call anywhere.
 *  - Locale-aware where it matters (Intl for numbers / dates).
 *  - Consistent rounding rules so `formatBytes(1024)` → `"1.0 KiB"` not
 *    `"1024 B"`.
 *  - Graceful with weird inputs: `NaN`, `Infinity`, negative, undefined → never throw.
 */

// =====================================================================
// Bytes & rate
// =====================================================================

export interface FormatBytesOptions {
  /** Fractional digits. Default 1. */
  decimals?: number;
  /** `true` uses 1024-base + IEC suffixes (KiB/MiB/GiB). Default `false`
   *  (1000-base + SI suffixes: kB/MB/GB). */
  binary?: boolean;
  /** Override the unit: useful for rates ("bit"), different domains. */
  unit?: string;
}

const SI_PREFIXES = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
const IEC_PREFIXES = ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"];

/** Format a byte count as a human-readable string.
 *  `formatBytes(1024)` → `"1.0 kB"` (SI) or `"1.0 KiB"` (binary). */
export function formatBytes(
  bytes: number | null | undefined,
  options: FormatBytesOptions = {},
): string {
  if (bytes == null || !isFinite(bytes)) return "—";
  const { decimals = 1, binary = false, unit = "B" } = options;
  if (bytes === 0) return `0 ${unit}`;
  const base = binary ? 1024 : 1000;
  const prefixes = binary ? IEC_PREFIXES : SI_PREFIXES;
  const sign = bytes < 0 ? "-" : "";
  const abs = Math.abs(bytes);
  const i = Math.min(prefixes.length - 1, Math.floor(Math.log(abs) / Math.log(base)));
  const scaled = abs / Math.pow(base, i);
  const digits = i === 0 ? 0 : decimals;
  return `${sign}${scaled.toFixed(digits)} ${prefixes[i]}${unit}`;
}

/** Format a bytes-per-second rate. */
export function formatRate(
  bytesPerSec: number | null | undefined,
  options: FormatBytesOptions = {},
): string {
  const s = formatBytes(bytesPerSec, options);
  return s === "—" ? s : `${s}/s`;
}

// =====================================================================
// Generic number
// =====================================================================

export interface FormatNumberOptions {
  /** `true` → "12.4k", "1.2M". Default `false` → locale-grouped ("12,431"). */
  compact?: boolean;
  decimals?: number;
  /** Locale override (defaults to browser). */
  locale?: string;
}

export function formatNumber(
  n: number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  if (n == null || !isFinite(n)) return "—";
  const { compact = false, decimals, locale } = options;
  const fmt = new Intl.NumberFormat(locale, {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: decimals ?? (compact ? 1 : 3),
    minimumFractionDigits: decimals,
  });
  return fmt.format(n);
}

/** `formatPercent(0.424)` → `"42.4%"`. Input is a fraction (0..1). */
export function formatPercent(
  fraction: number | null | undefined,
  decimals = 1,
  options: { locale?: string } = {},
): string {
  if (fraction == null || !isFinite(fraction)) return "—";
  const fmt = new Intl.NumberFormat(options.locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return fmt.format(fraction);
}

// =====================================================================
// Duration
// =====================================================================

export interface FormatDurationOptions {
  /** `true` → "2 hours 34 minutes". Default short: "2h 34m". */
  long?: boolean;
  /** Max number of units in the output. Default 2 (e.g. "2h 34m", not
   *  "2h 34m 12s 900ms"). */
  parts?: number;
  /** Include milliseconds when duration is sub-second. Default true. */
  includeMs?: boolean;
}

const DURATION_UNITS: { ms: number; short: string; long: string }[] = [
  { ms: 365 * 24 * 60 * 60 * 1000, short: "y", long: "year" },
  { ms: 30 * 24 * 60 * 60 * 1000, short: "mo", long: "month" },
  { ms: 7 * 24 * 60 * 60 * 1000, short: "w", long: "week" },
  { ms: 24 * 60 * 60 * 1000, short: "d", long: "day" },
  { ms: 60 * 60 * 1000, short: "h", long: "hour" },
  { ms: 60 * 1000, short: "m", long: "minute" },
  { ms: 1000, short: "s", long: "second" },
];

/** Format a millisecond duration as a human-readable string.
 *  `formatDuration(9_274_000)` → `"2h 34m"`. */
export function formatDuration(
  ms: number | null | undefined,
  options: FormatDurationOptions = {},
): string {
  if (ms == null || !isFinite(ms)) return "—";
  const { long = false, parts = 2, includeMs = true } = options;
  const sign = ms < 0 ? "-" : "";
  let remaining = Math.abs(Math.round(ms));
  if (remaining < 1000) {
    if (!includeMs) return "0s";
    return `${sign}${remaining}ms`;
  }
  const out: string[] = [];
  for (const u of DURATION_UNITS) {
    if (out.length >= parts) break;
    if (remaining >= u.ms) {
      const n = Math.floor(remaining / u.ms);
      remaining -= n * u.ms;
      out.push(long ? `${n} ${u.long}${n === 1 ? "" : "s"}` : `${n}${u.short}`);
    } else if (out.length > 0) {
      // Once we've started, keep going — don't leave gaps like "2h 0m".
      // Actually, do leave gaps: "2h 5s" is clearer than "2h 0m 5s". So
      // we DON'T push a zero-unit, but we don't break either.
    }
  }
  if (out.length === 0) return long ? "0 seconds" : "0s";
  return sign + out.join(long ? " " : " ");
}

// =====================================================================
// Dates
// =====================================================================

function toDate(v: Date | string | number): Date {
  return v instanceof Date ? v : new Date(v);
}

export interface FormatRelativeOptions {
  /** Anchor for the relative calculation. Default: `new Date()`. */
  now?: Date | string | number;
  /** `"short"` → "2m ago" (default). `"long"` → "2 minutes ago". */
  style?: "short" | "long";
  /** Threshold (ms) below which we say "just now" instead of "0s ago". Default 5000. */
  justNowThreshold?: number;
}

/** Relative date — `"2m ago"`, `"in 3h"`, `"just now"`. */
export function formatRelative(
  date: Date | string | number | null | undefined,
  options: FormatRelativeOptions = {},
): string {
  if (date == null) return "—";
  const d = toDate(date);
  if (isNaN(d.getTime())) return "—";
  const now = options.now ? toDate(options.now) : new Date();
  const diff = d.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const threshold = options.justNowThreshold ?? 5000;
  if (abs < threshold) return "just now";
  const style = options.style ?? "short";
  const duration = formatDuration(abs, { long: style === "long", parts: 1 });
  if (duration === "—") return "—";
  return diff < 0
    ? style === "long"
      ? `${duration} ago`
      : `${duration} ago`
    : style === "long"
      ? `in ${duration}`
      : `in ${duration}`;
}

export interface FormatAbsoluteOptions {
  locale?: string;
  /** Preset: "datetime" (default), "date", "time". */
  preset?: "datetime" | "date" | "time";
  /** Full `Intl.DateTimeFormatOptions` override. Takes precedence over `preset`. */
  options?: Intl.DateTimeFormatOptions;
}

/** Absolute date — localized. Default: `"2026-04-18 14:32:01"` feel. */
export function formatAbsolute(
  date: Date | string | number | null | undefined,
  opts: FormatAbsoluteOptions = {},
): string {
  if (date == null) return "—";
  const d = toDate(date);
  if (isNaN(d.getTime())) return "—";
  const { preset = "datetime" } = opts;
  const dfOptions: Intl.DateTimeFormatOptions = opts.options ?? {
    datetime: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    } as Intl.DateTimeFormatOptions,
    date: {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as Intl.DateTimeFormatOptions,
    time: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    } as Intl.DateTimeFormatOptions,
  }[preset];
  return new Intl.DateTimeFormat(opts.locale, dfOptions).format(d);
}
