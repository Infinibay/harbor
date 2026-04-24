import { useContext } from "react";
import { HarborI18nContext, type HarborI18nContextValue } from "./context";
import { en } from "./locales/en";
import { formatMessage } from "./parse";
import {
  formatDate as fmtDate,
  formatList as fmtList,
  formatNumber as fmtNumber,
  formatRelative as fmtRelative,
} from "./format";
import type { FormatVars } from "./types";

/** Read the active i18n context. Returns the full context value
 *  (translate + formatters + direction + locale). Outside a provider it
 *  returns a minimal fallback that echoes the key, so components using
 *  `useT()` work unchanged in tests or consumer apps that haven't wired
 *  i18n yet. */
export function useT(): HarborI18nContextValue {
  const ctx = useContext(HarborI18nContext);
  if (ctx) return ctx;
  return FALLBACK;
}

/** Read just the active locale + direction, for components that want to
 *  react to locale changes without pulling in the translator. */
export function useHarborLocale(): {
  code: string;
  direction: "ltr" | "rtl";
  setLocale: (code: string) => void;
} {
  const { code, direction, setLocale } = useT();
  return { code, direction, setLocale };
}

/** Default context used when a component is rendered outside a
 *  `HarborI18nProvider`. Uses the bundled English catalog so every
 *  built-in string ("(optional)", "Back", "Step N of M", …) still
 *  renders correctly — i18n is opt-in for consumers; the components
 *  themselves never break. */
const FALLBACK: HarborI18nContextValue = {
  locale: en,
  code: en.code,
  direction: "ltr",
  locales: [en],
  t: (key: string, vars?: FormatVars) => {
    const template = en.messages[key] ?? key;
    return formatMessage(template, vars ?? {}, en.code);
  },
  setLocale: () => {},
  formatDate: (v, o) => fmtDate(v, en.code, o),
  formatNumber: (v, o) => fmtNumber(v, en.code, o),
  formatRelative: (s, u, o) => fmtRelative(s, en.code, u, o),
  formatList: (items, o) => fmtList(items, en.code, o),
};
