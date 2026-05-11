# DiffViewer

`DiffViewer` compares two text values and renders line-level additions, deletions, unchanged rows, line numbers, labels, and change counts. Use it for configuration previews, generated code review, YAML or JSON changes, policy edits, release notes, environment drift, and "before versus after" panels in admin tools.

The component includes a minimal LCS-based line diff. It is designed for small and medium text blocks inside product UI, not for repository-scale source diffing.

## Import

```tsx
import { DiffViewer } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
<DiffViewer
  oldLabel="current"
  newLabel="proposed"
  oldText={currentConfig}
  newText={draftConfig}
/>
```

Use split mode when users need to compare both versions side by side:

```tsx
<DiffViewer
  mode="split"
  oldLabel="v1.4.2"
  newLabel="v1.5.0"
  oldText={previousManifest}
  newText={nextManifest}
/>
```

## Props

- **oldText** - required string. The previous text.
- **newText** - required string. The next text.
- **mode** - optional `"unified"` or `"split"`. Defaults to `"unified"`.
- **oldLabel** - optional string. Defaults to `"old"`.
- **newLabel** - optional string. Defaults to `"new"`.
- **className** - optional string merged onto the root container.

## Diff Model

Harbor splits both strings by newline and computes a longest common subsequence. Rows are classified as `same`, `add`, or `del`. The header summarizes total additions and deletions, then rows render with line numbers and a `+`, minus, or blank glyph.

In unified mode, all lines appear in one stream. In split mode, deleted lines render on the left and added lines render on the right, while unchanged lines appear in both columns.

## Content Guidance

Use labels that match the workflow: `"current"` and `"draft"`, `"production"` and `"staging"`, `"before"` and `"after"`, or version numbers. Avoid internal labels like `"oldText"` and `"newText"`.

For structured data, format it before passing it to `DiffViewer`. Pretty-printed JSON or YAML is much easier to review than one-line serialized text.

## Accessibility

The diff is visual and color-coded. Provide a heading or surrounding copy that explains what is being compared, and do not rely on green and rose alone. The row glyphs and counts help, but critical approval flows should also summarize the impact in plain language.

## Gotchas

- This is a simple line diff, not a full Git diff engine.
- Very large files can be expensive because the LCS matrix grows with both input lengths.
- Whitespace differences are compared literally.
- Split mode is useful on wide screens but can become cramped in narrow containers.

## Related

- `CodeBlock` for static source snippets.
- `JsonViewer` for inspecting structured data.
- `YAMLConfigEditor` for editable config.
- `Dialog` or `Drawer` for review-before-apply flows.
