# ExportMenu

`ExportMenu` is a small export configuration popover. It lets users choose a format, toggle
common export options, then emits a structured `ExportOptions` object to your app.

Use it next to tables, audit logs, billing reports, search results, and admin lists where the
UI should collect export intent but the application owns serialization and download.

## Import

```tsx
import { ExportMenu } from "@infinibay/harbor/overlays";
import type { ExportOptions } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
<ExportMenu
  formats={["csv", "xlsx", "json"]}
  disable={{ currentFilterOnly: !hasActiveFilter }}
  onExport={(options) => {
    exportUsers(options);
  }}
/>
```

## Export Model

The component stores its own open state and option state. Clicking `Export` calls `onExport`
with `{ format, includeHeaders, currentFilterOnly, allColumns }` and closes the popover.

Harbor does not serialize data, create files, or trigger downloads. That keeps the component
usable across server exports, client downloads, queued reports, and permission-controlled
admin flows.

## Props

- **onExport** - `(options: ExportOptions) => void`.
- **formats** - formats to offer. Default `["csv", "json", "xlsx", "ndjson"]`.
- **label** - trigger label. Default `"Export"`.
- **disable** - disable individual toggles.
- **className** - extra classes on the trigger.

### ExportOptions

- **format** - `"csv" | "json" | "xlsx" | "ndjson"`.
- **includeHeaders** - include column headers.
- **currentFilterOnly** - export only current filtered rows.
- **allColumns** - include columns that are currently hidden.

## Accessibility

The trigger announces that it opens a dialog-like popover and exposes expanded state. Format
choices and action buttons are real buttons; the option toggles are native checkboxes.

The popover does not implement roving menu focus or focus trapping. For keyboard-heavy export
workflows, consider a `Dialog` with explicit form controls.

## Gotchas

- The initial selected format is `formats[0]`; pass at least one format.
- The popover position is calculated when opened and does not currently track scroll after
  opening.
- Disabled toggles remain visible; use surrounding copy when users need to know why.
- `onExport` should handle permissions, async state, file creation, and errors.

## Related

- `DataTable` for exportable records.
- `Menu` for general command menus.
- `Dialog` for richer export configuration.
- `CopyCommand` for command-line export snippets.
