import { formatMessage } from "../i18n/parse";
import { en } from "../i18n/locales/en";

/** Resolve a default validation message from the bundled English
 *  catalog. Schemas use this when no per-rule override is provided, so
 *  error text stays translatable in a consumer app that wraps its tree
 *  in `HarborI18nProvider`, but still reads as sensible English when
 *  rendered raw (e.g. in a unit test that only calls `schema.validate`
 *  with no Provider above it).
 *
 *  Schemas are plain runtime modules — they don't have a React context
 *  to pull the active locale from. At validate-time we therefore emit
 *  English; the form layer then re-formats using the active Provider
 *  so the *rendered* message is locale-aware. Keeping the message
 *  bundled with the code means `safeParse()` from a Node script also
 *  produces readable errors. */
export function defaultMessage(
  code: ValidationCode,
  vars?: Record<string, string | number>,
): string {
  const key = KEY_BY_CODE[code];
  if (!key) return code;
  const template = en.messages[key] ?? code;
  return formatMessage(template, vars ?? {}, en.code);
}

/** The i18n catalog key for a given validation code. Exposed so the
 *  form layer can re-resolve the same message against the active
 *  locale at render time. */
export function keyForCode(code: ValidationCode): string | undefined {
  return KEY_BY_CODE[code];
}

export type ValidationCode =
  | "required"
  | "type"
  | "minLength"
  | "maxLength"
  | "min"
  | "max"
  | "email"
  | "url"
  | "regex"
  | "oneOf"
  | "custom"
  | "refine";

const KEY_BY_CODE: Partial<Record<ValidationCode, string>> = {
  required: "harbor.validation.required",
  email: "harbor.validation.email",
  min: "harbor.validation.min",
  max: "harbor.validation.max",
  minLength: "harbor.validation.minLength",
  maxLength: "harbor.validation.maxLength",
};
