# DiffViewer

Inline LCS-based text diff with unified or split (side-by-side) layout.
Use for comparing strings (configs, prose, code); for structured object
diffs use `<JsonViewer>` on each side or feed pretty-printed JSON in.

## Import

```tsx
import { DiffViewer } from "@infinibay/harbor/data";
```

## Example

```tsx
<DiffViewer
  oldText={"line 1\nline 2\nline 3"}
  newText={"line 1\nline 2 changed\nline 3\nline 4"}
  mode="split"
  oldLabel="v1"
  newLabel="v2"
/>
```

## Props

- **oldText** — `string`. Required. Newline-split into rows.
- **newText** — `string`. Required.
- **mode** — `"unified" | "split"`. Default `"unified"`.
- **oldLabel** — header label for the old side. Default `"old"`.
- **newLabel** — header label for the new side. Default `"new"`.
- **className** — extra classes on the root.

## Notes

- Diff is line-level only — no in-line word/char highlighting.
- Implementation is a simple LCS (`O(m·n)` time + memory). Fine for
  configs/snippets; not intended for multi-MB blobs.
- Header shows total `+adds / −dels` next to the labels.
