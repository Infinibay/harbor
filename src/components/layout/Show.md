# Show

`Show` conditionally mounts children when responsive predicates match. `Hide` exports the
inverse of the same predicate, so you can swap mobile and desktop layouts without writing
media-query hooks in every component.

Use these components when rendering itself should change by viewport: desktop sidebars,
mobile drawers, expensive charts, touch-only controls, orientation-specific canvases, and
responsive product demos. If both versions must stay mounted to preserve state, use CSS
visibility or `ResponsiveSwap` instead.

## Import

```tsx
import { Show, Hide } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Show above="md">
  <DesktopOnlyChart />
</Show>

<Hide below="lg" animate="slide">
  <SidebarPanel />
</Hide>
```

## Predicate Model

All provided conditions are AND-ed. For example, `device="tablet" orientation="portrait"`
renders only on portrait tablets. Missing conditions are ignored.

Breakpoints follow Harbor's responsive tokens: `sm` 640px, `md` 768px, `lg` 1024px, `xl`
1280px, and `2xl` 1536px. `above` means greater than or equal to the breakpoint. `below`
means strictly below it. `between={[min, max]}` means `[min, max)`.

## Props

- **above** - `"sm" | "md" | "lg" | "xl" | "2xl"`. Show at and
  above this breakpoint.
- **below** - same set. Show strictly below this breakpoint.
- **between** - `[Breakpoint, Breakpoint]`. Show inside the
  half-open range `[min, max)`.
- **device** - `"phone" | "tablet" | "desktop"` or an array of
  those. Restrict by device class.
- **orientation** - `"portrait" | "landscape"`.
- **touch** - `boolean`. `true` shows only on touch devices;
  `false` shows only on non-touch.
- **animate** - `"fade" | "slide" | "scale" | false`. Default
  `"fade"`.
- **children** - `ReactNode`.

## Accessibility

Children are mounted only when visible. Hidden content is not available to screen readers,
keyboard users, or search within the page. That is usually correct for alternate layouts, but
do not hide critical instructions or form controls without providing an equivalent path.

Animations are short and visual. If the content change represents important state, announce
it through the component you render, not through `Show` itself.

## Gotchas

- Because hidden children unmount, local component state resets when the predicate flips.
- Server rendering starts from `false` media-query values until the client evaluates real
  viewport state. Avoid using `Show` for content that must be identical during SSR hydration.
- `device` is width-based, not user-agent based: phone is below `md`, tablet is `md` to below
  `lg`, and desktop is `lg` and above.
- `Hide` is the inverse of the same predicate set, not a separate media-query system.

## Related

- `ResponsiveSwap` for swapping mounted responsive layouts.
- `ResponsiveGrid` and `ResponsiveStack` for layout changes without unmounting content.
- `Drawer` for mobile navigation that replaces a desktop sidebar.
- `useResponsiveValue` for responsive values inside custom components.
