# Marquee

`Marquee` creates an infinite scrolling ribbon by measuring its children, duplicating enough copies to fill the viewport, and translating them with a CSS keyframe. Use it for logo walls, customer strips, technology badges, status tickers, press mentions, and lightweight testimonial loops.

It is decorative movement. If users need to read, select, filter, or control the content, use `ScrollArea`, `Carousel`, or a normal list instead.

## Import

```tsx
import { Marquee } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Marquee } from "@infinibay/harbor/layout";

export function LogoStrip() {
  return (
    <Marquee speed={56} gap={48} pauseOnHover>
      {["React", "TypeScript", "Vite", "Vitest", "Tauri"].map((item) => (
        <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs">
          {item}
        </span>
      ))}
    </Marquee>
  );
}
```

## Props

- **children** - `ReactNode`. Required item sequence to repeat.
- **speed** - `number`. Pixels per second. Default `40`.
- **direction** - `"left" | "right" | "up" | "down"`. Default `"left"`.
- **pauseOnHover** - `boolean`. Default `true`.
- **gap** - `number`. Pixel gap between repeated copies. Default `32`.
- **fade** - `boolean`. Adds an edge fade mask. Default `true`.
- **className** - extra classes on the outer wrapper.
- **itemClassName** - extra classes on each child wrapper.

## Behavior

The component measures the first rendered group with `ResizeObserver`, calculates enough copies to cover the visible area, and sets `--harbor-marquee-distance` for the animation. Horizontal directions use row layout. Vertical directions use column layout.

Duplicate copies after the first are marked `aria-hidden`, so screen readers do not read the repeated content over and over.

## Accessibility

Keep marquee content nonessential or duplicated elsewhere on the page. `pauseOnHover` helps pointer users inspect content, but there is no built-in pause button. For important information, provide a static list, carousel controls, or another accessible representation.

## Gotchas

- The CSS keyframes `harbor-marquee-x` and `harbor-marquee-y` must exist in the global stylesheet.
- Very slow speeds make duplicated content more noticeable.
- Vertical marquees need a constrained height from the surrounding layout.
- Dynamic children are remeasured, but expensive child trees can still cost layout work.

## Related

- `ScrollArea` for user-controlled scrolling.
- `Carousel` for controlled slide navigation.
- `TickerTape` for text-heavy ticker content.
