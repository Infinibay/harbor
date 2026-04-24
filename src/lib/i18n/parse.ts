import type { FormatVars } from "./types";

/** Format an ICU-lite template against `vars`. Grammar covered:
 *
 *    text           := (LITERAL | PLACEHOLDER)*
 *    PLACEHOLDER    := `{` NAME (`,` TYPE (`,` OPTIONS)?)? `}`
 *    TYPE           := `plural` | `select`
 *    OPTIONS        := (KEY `{` text `}`)+           // one, other, male, …
 *    LITERAL        := any char except `{`, `}`. To emit a literal brace,
 *                      pair it: `'{'` is not supported — use the `{brace}`
 *                      helper var instead.
 *
 *  Examples (en-US locale):
 *    format("Hi, {name}!", { name: "Ada" })                     // Hi, Ada!
 *    format("{count, plural, one {# item} other {# items}}",
 *           { count: 3 })                                        // 3 items
 *    format("{gender, select, male {him} female {her} other {them}}",
 *           { gender: "female" })                                // her */
export function formatMessage(
  template: string,
  vars: FormatVars,
  locale: string,
): string {
  let i = 0;

  function readText(stopBraces: boolean): string {
    let out = "";
    while (i < template.length) {
      const c = template[i];
      if (c === "{") {
        if (stopBraces) return out;
        out += renderPlaceholder();
      } else if (c === "}") {
        if (stopBraces) return out;
        out += c;
        i++;
      } else if (c === "#") {
        // `#` outside a plural branch just becomes `#`.
        out += c;
        i++;
      } else {
        out += c;
        i++;
      }
    }
    return out;
  }

  function renderPlaceholder(): string {
    // At `{`.
    i++; // consume `{`
    skipWs();
    const name = readIdent();
    skipWs();
    if (template[i] === "}") {
      i++; // consume `}`
      const v = vars[name];
      return v == null ? "" : String(v);
    }
    if (template[i] !== ",") {
      throw new Error(`i18n: expected "," or "}" in placeholder, got ${template[i]}`);
    }
    i++; // consume `,`
    skipWs();
    const type = readIdent();
    skipWs();
    if (template[i] === "}") {
      i++;
      return String(vars[name] ?? "");
    }
    if (template[i] !== ",") {
      throw new Error(`i18n: expected "," after type, got ${template[i]}`);
    }
    i++; // consume `,`
    skipWs();
    // Read branches: KEY `{` body `}` ...
    const branches = new Map<string, string>();
    while (template[i] !== "}") {
      skipWs();
      const key = readBranchKey();
      skipWs();
      if (template[i] !== "{") {
        throw new Error(`i18n: expected "{" after branch key, got ${template[i]}`);
      }
      i++; // consume `{`
      const body = readText(true);
      if (template[i] !== "}") {
        throw new Error("i18n: unterminated branch");
      }
      i++; // consume `}`
      branches.set(key, body);
      skipWs();
    }
    i++; // consume final `}`
    return resolve(type, name, branches, vars, locale);
  }

  function skipWs() {
    while (i < template.length && /\s/.test(template[i])) i++;
  }

  function readIdent(): string {
    let out = "";
    while (i < template.length && /[A-Za-z0-9_-]/.test(template[i])) {
      out += template[i];
      i++;
    }
    return out;
  }

  /** A plural/select branch key. Normal identifiers, plus the `=N`
   *  exact-match form used by plurals (`=0`, `=1`). */
  function readBranchKey(): string {
    let out = "";
    if (template[i] === "=") {
      out += template[i];
      i++;
    }
    while (i < template.length && /[A-Za-z0-9_-]/.test(template[i])) {
      out += template[i];
      i++;
    }
    return out;
  }

  return readText(false);
}

function resolve(
  type: string,
  name: string,
  branches: Map<string, string>,
  vars: FormatVars,
  locale: string,
): string {
  if (type === "plural") {
    const n = Number(vars[name] ?? 0);
    // Exact-match branches (`=0`, `=1`, …) take precedence.
    const exactKey = `=${n}`;
    if (branches.has(exactKey)) {
      return expand(branches.get(exactKey)!, vars, locale, n);
    }
    const rule = new Intl.PluralRules(locale).select(n);
    const branch = branches.get(rule) ?? branches.get("other") ?? "";
    return expand(branch, vars, locale, n);
  }
  if (type === "select") {
    const v = String(vars[name] ?? "");
    const branch = branches.get(v) ?? branches.get("other") ?? "";
    return expand(branch, vars, locale);
  }
  // Unknown type — emit raw variable.
  return String(vars[name] ?? "");
}

/** Expand a plural/select branch body: interpolation + `#` (= count). */
function expand(
  body: string,
  vars: FormatVars,
  locale: string,
  count?: number,
): string {
  // Swap `#` first so an embedded `{#}` isn't interpreted as a placeholder.
  const withHash =
    count === undefined
      ? body
      : body.replace(/#/g, new Intl.NumberFormat(locale).format(count));
  return formatMessage(withHash, vars, locale);
}
