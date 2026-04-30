# Marquee

Infinite-scrolling ribbon. Measures one copy of its children, duplicates
enough copies to cover the wrapper, then translates with a CSS keyframe.
Use for logo walls, ticker strips, or auto-rotating testimonials. For
finite scroll with snap, use `<ScrollArea>`.

## Import

```tsx
import { Marquee } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Marquee speed={60} pauseOnHover gap={48}>
  <img src="/picture.png" alt="" className="h-8" />
  <img src="/picture.png" alt="" className="h-8" />
  <img src="/picture.png" alt="" className="h-8" />
</Marquee>
```

## Props

- **children** — `ReactNode`. Required.
- **speed** — `number`. Pixels per second. Default `40`.
- **direction** — `"left" | "right" | "up" | "down"`. Default `"left"`.
  Vertical directions switch the wrapper to a column layout.
- **pauseOnHover** — `boolean`. Default `true`.
- **gap** — `number`. Pixel gap between repeated copies. Default `32`.
- **fade** — `boolean`. Edge fade-out mask. Default `true`.
- **className** — extra classes on the outer wrapper.
- **itemClassName** — extra classes on each child wrapper (e.g.
  `shrink-0` overrides).

## Notes

- Pause-on-hover is a single CSS state change — cheap.
- A `ResizeObserver` re-measures when the wrapper or one copy changes
  size, so dynamic children work.
- The animation reads a `--harbor-marquee-distance` custom property —
  the keyframe must be registered in your global stylesheet.
