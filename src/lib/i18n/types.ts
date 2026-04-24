export type Direction = "ltr" | "rtl";

/** A message catalog is a flat map from dot-namespaced keys to ICU-lite
 *  template strings. Supported syntax:
 *  - `{name}` — interpolation. `{name}` is replaced with `vars.name`.
 *  - `{count, plural, one {...} other {...}}` — plural branches picked
 *    via `Intl.PluralRules`. `#` inside a branch expands to `vars.count`.
 *  - `{gender, select, male {...} female {...} other {...}}` — exact
 *    string match on `vars[gender]`, `other` is the fallback.
 *  Branches may nest — interpolation + plurals can coexist. */
export type MessageCatalog = Record<string, string>;

export interface HarborLocale {
  /** BCP-47 code (`en`, `en-US`, `es-ES`, `ar`, `he`, …). */
  code: string;
  /** Human-readable label for locale pickers ("English", "العربية"). */
  label: string;
  /** Text direction. When omitted, derived from `code` (ar/he/fa/ur/ps
   *  are rtl, everything else is ltr). */
  direction?: Direction;
  /** The catalog itself. */
  messages: MessageCatalog;
}

export type FormatValue = string | number | Date | boolean | null | undefined;
export type FormatVars = Record<string, FormatValue>;
