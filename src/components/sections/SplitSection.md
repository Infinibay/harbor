# SplitSection

Alternating media + text section — the workhorse of feature pages.
Renders a two-column grid (text on one side, media on the other) and
flips sides with `reverse`. Stack multiple `<SplitSection>`s with
alternating `reverse` to build a zigzag layout.

## Import

```tsx
import { SplitSection } from "@infinibay/harbor/sections";
```

## Example

```tsx
<SplitSection
  kicker="Theming"
  title="Re-skin everything by overriding one variable."
  description="Every Harbor component reads its colors through CSS custom properties."
  media={<img src="/picture.png" alt="" />}
>
  <div className="flex gap-2">
    <Button variant="primary">Try the playground</Button>
    <Button variant="ghost">Read the docs</Button>
  </div>
</SplitSection>
```

## Props

- **title** — `ReactNode`. Required. Column heading (rendered as `<h2>`).
- **kicker** — `ReactNode`. Tiny uppercase label above the title.
- **description** — `ReactNode`. Muted paragraph below the title.
- **children** — `ReactNode`. Extra content under the description —
  buttons, lists, callouts, etc.
- **media** — `ReactNode`. Required. Image, illustration, or component
  shown in the opposite column.
- **reverse** — `boolean`. When true, swaps the columns at `md+`
  breakpoints (media on the left).
- **className** — extra classes on the `<section>`.

## Notes

- On viewports below `md` the grid collapses to a single column and
  text renders above media regardless of `reverse`.
- `media` is wrapped in a `relative`-positioned div, making it easy to
  layer overlays or absolutely-positioned decorations.
