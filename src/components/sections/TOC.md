# TOC

Sticky table of contents with scroll-spy. Renders a vertical list of
links and highlights the heading currently in view via
`IntersectionObserver`. Drop next to long-form content (`<Prose>`,
`<Section>`s with anchor `id`s).

## Import

```tsx
import { TOC } from "@infinibay/harbor/sections";
```

## Example

```tsx
<TOC
  title="On this page"
  items={[
    { id: "intro", label: "Introduction", level: 2 },
    { id: "install", label: "Install", level: 2 },
    { id: "props", label: "Props", level: 2 },
    { id: "props-variant", label: "variant", level: 3 },
    { id: "examples", label: "Examples", level: 2 },
  ]}
/>
```

## Props

- **items** — `TOCItem[]`. Required. Each item is
  `{ id: string; label: string; level?: 1 | 2 | 3 }`. The `id` must
  match an element on the page (anchor target).
- **title** — `string`. Default `"On this page"`. Small heading above
  the list.
- **className** — extra classes on the `<nav>`.

## Notes

- The component is `sticky top-6 self-start` — place it inside a flex
  or grid track so the sticky positioning has room to work.
- `level` controls indentation only (`2` indents one step, `3` indents
  two). Level `1` is flush left.
- Scroll-spy uses `rootMargin: "-80px 0px -60% 0px"` — adjust offsets
  in your own page padding rather than overriding the observer.
