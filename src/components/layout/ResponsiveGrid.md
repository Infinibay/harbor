# ResponsiveGrid

Viewport-responsive CSS grid driven entirely by Tailwind media
queries — no runtime measurement, no animation. Use this inside
collapsing or animated containers (`Accordion`, `Drawer`,
animated `Tabs`) where `Bento` or `FluidGrid` would flicker on
first paint. For container-aware sizing or animated reflows use
`FluidGrid`; for non-uniform spans use `Bento`.

## Import

```tsx
import { ResponsiveGrid } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
  <Card />
  <Card />
  <Card />
</ResponsiveGrid>
```

## Props

- **columns** — `number | Partial<Record<"base"|"sm"|"md"|"lg"|"xl"|"2xl", number>>`.
  Column count per viewport breakpoint. Clamped to `1..12`. Default `1`.
- **gap** — `number | Partial<Record<...>>`. Tailwind gap scale
  (typically `1`–`12`). Default `4`.
- **className** — extra classes on the wrapper.

## Notes

- Uses Tailwind utilities (`grid-cols-*`, `gap-*`, `md:` etc.),
  so the breakpoints follow the project's Tailwind config.
- Driven by media queries — children do not animate when columns
  change; pair with framer-motion `layout` props on children if
  you need smooth reflow.
