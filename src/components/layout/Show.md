# Show

Conditionally renders children based on viewport size, device
class, orientation, or touch capability — with an optional
fade / slide / scale animation when the condition flips. Children
mount only when visible, so it's a good fit for heavy components
you don't want on mobile. Pair with the exported `Hide` for the
inverse predicate.

## Import

```tsx
import { Show, Hide } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Show above="md">
  <DesktopOnlyChart />
</Show>

<Hide below="lg" animate="slide">
  <SidebarPanel />
</Hide>
```

## Props

- **above** — `"sm" | "md" | "lg" | "xl" | "2xl"`. Show at and
  above this breakpoint.
- **below** — same set. Show strictly below this breakpoint.
- **between** — `[Breakpoint, Breakpoint]`. Show inside the
  half-open range `[min, max)`.
- **device** — `"phone" | "tablet" | "desktop"` or an array of
  those. Restrict by device class.
- **orientation** — `"portrait" | "landscape"`.
- **touch** — `boolean`. `true` shows only on touch devices;
  `false` shows only on non-touch.
- **animate** — `"fade" | "slide" | "scale" | false`. Default
  `"fade"`.
- **children** — `ReactNode`.

## Notes

- All conditions are AND-ed; omit a condition to ignore it.
- Children unmount when hidden — keep that in mind for
  components that own state you'd like to preserve across
  breakpoints (use CSS-based hiding instead).
- For mounted-on-both-sides cross-fades between two distinct
  layouts, prefer `ResponsiveSwap`.
