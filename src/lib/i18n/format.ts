/** Thin typed wrappers over `Intl.*` keyed by locale. Each function
 *  memo-caches the underlying formatter for the (locale, options) pair
 *  since they're surprisingly expensive to construct. */

type CacheKey = string;

const dateCache = new Map<CacheKey, Intl.DateTimeFormat>();
const numberCache = new Map<CacheKey, Intl.NumberFormat>();
const relativeCache = new Map<CacheKey, Intl.RelativeTimeFormat>();
const listCache = new Map<CacheKey, Intl.ListFormat>();

function key(locale: string, opts?: unknown): CacheKey {
  return `${locale}::${opts ? JSON.stringify(opts) : ""}`;
}

export function formatDate(
  value: Date | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const k = key(locale, options);
  let fmt = dateCache.get(k);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, options);
    dateCache.set(k, fmt);
  }
  return fmt.format(value);
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  const k = key(locale, options);
  let fmt = numberCache.get(k);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, options);
    numberCache.set(k, fmt);
  }
  return fmt.format(value);
}

/** Relative time like "3 days ago" / "in 5 minutes". Pick units based on
 *  the magnitude of the delta unless `unit` is forced. */
export function formatRelative(
  valueSeconds: number,
  locale: string,
  unit?: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const opts: Intl.RelativeTimeFormatOptions = {
    numeric: "auto",
    ...options,
  };
  const k = key(locale, opts);
  let fmt = relativeCache.get(k);
  if (!fmt) {
    fmt = new Intl.RelativeTimeFormat(locale, opts);
    relativeCache.set(k, fmt);
  }
  if (unit) return fmt.format(Math.round(valueSeconds), unit);
  return fmt.format(...pickRelativeUnit(valueSeconds));
}

const RELATIVE_STEPS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

function pickRelativeUnit(
  seconds: number,
): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(seconds);
  for (const [unit, size] of RELATIVE_STEPS) {
    if (abs >= size || unit === "second") {
      return [Math.round(seconds / size), unit];
    }
  }
  return [Math.round(seconds), "second"];
}

/** Format a list as "a, b, and c" (conjunction) or "a, b, or c"
 *  (disjunction) per the target locale's conventions. */
export function formatList(
  items: readonly string[],
  locale: string,
  options?: Intl.ListFormatOptions,
): string {
  const k = key(locale, options);
  let fmt = listCache.get(k);
  if (!fmt) {
    fmt = new Intl.ListFormat(locale, options);
    listCache.set(k, fmt);
  }
  return fmt.format(items as string[]);
}

/** Clear every cache. Useful when an app hot-swaps locales during a test. */
export function clearFormatCaches(): void {
  dateCache.clear();
  numberCache.clear();
  relativeCache.clear();
  listCache.clear();
}
