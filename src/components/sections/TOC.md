# TOC

`TOC` renders a sticky table of contents with scroll-spy highlighting. It is built for documentation pages, long articles, legal pages, changelogs, guides, and reference entries where readers need orientation while moving through sections.

The component does not discover headings automatically. You provide the item list and make sure each `id` exists on the page.

## Import

```tsx
import { TOC, type TOCItem } from "@infinibay/harbor/sections";
```

## Basic Usage

```tsx
import { TOC, type TOCItem } from "@infinibay/harbor/sections";

const items: TOCItem[] = [
  { id: "overview", label: "Overview", level: 1 },
  { id: "install", label: "Install", level: 2 },
  { id: "props", label: "Props", level: 2 },
  { id: "accessibility", label: "Accessibility", level: 2 },
];

export function ArticleAside() {
  return <TOC title="On this page" items={items} />;
}
```

## Props

- **items** - `TOCItem[]`. Required links to page headings.
- **title** - `string`. Small heading above the list. Default `"On this page"`.
- **className** - extra classes on the root `<nav>`.

## Item Model

```ts
type TOCItem = {
  id: string;
  label: string;
  level?: 1 | 2 | 3;
};
```

`id` must match an element id in the document. `level` controls indentation only; it does not create nested markup.

## Behavior

On mount and whenever `items` changes, the component looks up matching DOM elements and observes them with `IntersectionObserver`. The most visible observed heading becomes active. Links use normal hash navigation through `href="#id"`.

The root is sticky with `top-6`, so it stays visible inside layouts that allow sticky positioning.

## Accessibility

The component renders a `<nav aria-label="Table of contents">` with anchor links. Keep labels descriptive and unique enough to scan. If your page has another navigation landmark nearby, set surrounding headings or labels to avoid ambiguity.

## Gotchas

- Missing ids are silently ignored by the observer, though the link still renders.
- Active detection depends on viewport geometry and `rootMargin`.
- `level` only changes padding.
- Sticky positioning can fail inside parents with incompatible overflow.

## Related

- `Prose` for readable article content.
- `Section` for titled content blocks.
- `CodeBlock` for documentation examples.
