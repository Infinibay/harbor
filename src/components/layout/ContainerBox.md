# ContainerBox

Declares a CSS container-query context (`container-type` /
`container-name`) on a wrapper so descendants can respond to the
wrapper's size with `@container` queries — robust for components
dropped into sidebars, modals, or split panes where the viewport is
the wrong thing to measure. Distinct from `<Container>`, which only
caps width and pads horizontally.

## Import

```tsx
import { ContainerBox } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ContainerBox name="card" type="inline-size">
  <div className="card-body">
    {/* CSS:  @container card (min-width: 400px) { ... } */}
    Reflows based on this wrapper, not the viewport.
  </div>
</ContainerBox>
```

## Props

- **children** — `ReactNode`. Required.
- **name** — `string`. Optional `container-name` so `@container <name>`
  queries can target this context specifically.
- **type** — `"inline-size" | "size" | "normal"`. Default
  `"inline-size"` (horizontal-only, the cheaper default). Use
  `"size"` to query both axes.
- **className** / **style** — passed through to the wrapper.

## Notes

- Forwards a ref to the underlying `div`. Pair with the
  `useContainerSize` / `useContainerAbove` hooks if you'd rather
  branch in JS than in CSS.
- Sets `width: 100%` by default so the container fills its parent
  before establishing the query context.
