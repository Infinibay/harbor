# ExportMenu

Specialized dropdown for "Export…" buttons on tables and reports. Lets
the user pick a format (CSV / JSON / XLSX / NDJSON) and a few standard
options, then emits a structured `ExportOptions` object. Your code
does the actual serialization. For a generic button-anchored menu of
arbitrary actions, use `<Menu>`.

## Import

```tsx
import { ExportMenu } from "@infinibay/harbor/overlays";
```

## Example

```tsx
<ExportMenu
  onExport={(opts) => {
    if (opts.format === "csv") downloadCsv(rows, opts);
    else if (opts.format === "json") downloadJson(rows, opts);
  }}
  formats={["csv", "json"]}
  disable={{ currentFilterOnly: true }}
/>
```

## Props

- **onExport** — `(opts: ExportOptions) => void`. Required. Fires when
  the user confirms. The component closes itself; the caller
  serializes and triggers the download.
- **formats** — `readonly ExportFormat[]`. Subset of
  `"csv" | "json" | "xlsx" | "ndjson"`. Default: all four.
- **label** — `ReactNode`. Trigger label. Default `"Export"`.
- **disable** — `Partial<{ includeHeaders, currentFilterOnly,
  allColumns }>`. Greys out individual checkboxes when the option
  doesn't apply (e.g. no active filter).
- **className** — extra classes on the trigger button.

### `ExportOptions`

- **format** — `"csv" | "json" | "xlsx" | "ndjson"`.
- **includeHeaders** — `boolean`.
- **currentFilterOnly** — `boolean`.
- **allColumns** — `boolean`. `true` = include hidden columns too.

## Notes

- Portals at `Z.POPOVER`. Closes on backdrop click.
- The menu is purely a configurator — it never reads your data. Pass
  `disable` for options that aren't meaningful in your context rather
  than hiding them, so the UI stays consistent.
