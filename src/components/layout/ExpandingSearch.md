# ExpandingSearch

Round magnifier button that opens a sliding input pill. Use in toolbars
or headers where search is occasional and you want to reclaim space
when idle. For arbitrary collapsed↔expanded morphs use `<Expandable>`.

## Import

```tsx
import { ExpandingSearch } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ExpandingSearch
  placeholder="Search projects"
  autoCollapseOnEmpty
  onChange={(q) => setQuery(q)}
/>
```

## Props

- **placeholder** — `string`. Default `"Search"`.
- **open** — `boolean`. Controlled open state.
- **onOpenChange** — `(v: boolean) => void`.
- **value** — `string`. Controlled query.
- **onChange** — `(q: string) => void`. Fires on every keystroke.
- **iconSize** — `number`. Magnifier glyph size in px. Default `16`.
- **autoCollapseOnEmpty** — `boolean`. Collapse on blur if input is empty.
- **className** — extra classes on the wrapper.

## Notes

- The button keeps a fixed 40×40 footprint; the input pill slides in
  beside it and animates `layout` so it grows with available width.
- Esc inside the input collapses regardless of `autoCollapseOnEmpty`.
- Drop inside a `<MorphBar>` with `grow={open ? 1 : 0}` on the surrounding
  `<MorphItem>` to claim the bar when expanded.
