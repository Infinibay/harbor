# ScrollArea

`ScrollArea` wraps overflowing content with a Harbor-styled custom thumb while
keeping native scrolling behavior inside the viewport. It is useful for compact
panels, drawers, sidebars, logs, command results, notification lists, and
inspector sections where the content can grow but the surrounding layout should
stay stable.

Use it when the scroll container is part of a product surface. For full-page
scrolling, let the browser handle the page normally.

## Import

```tsx
import { ScrollArea } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<ScrollArea maxHeight={320}>
  <ActivityFeed items={events} />
</ScrollArea>
```

In a side panel:

```tsx
<Aside title="Deploy logs">
  <ScrollArea maxHeight="calc(100vh - 12rem)" thumbTone="white">
    <LogViewer lines={lines} />
  </ScrollArea>
</Aside>
```

## Props

- **maxHeight** - `number | string`. Maximum height of the wrapper. Numbers are
  interpreted as pixels by React style rules. Default `280`.
- **thumbTone** - `"purple" | "white"`. Visual style for the custom thumb.
  Default `"purple"`.
- **className** - extra classes on the wrapper.
- **...rest** - standard `HTMLAttributes<HTMLDivElement>` on the outer wrapper.

## Behavior

The inner viewport uses native scrolling with the browser scrollbar visually
hidden. Harbor measures the content with `ResizeObserver`, computes a custom
thumb size, and updates the thumb position on scroll.

The thumb appears on hover or while the user scrolls, then fades out after the
interaction settles. It is decorative and pointer-events are disabled, so users
scroll with the wheel, trackpad, keyboard, or touch as usual.

## Accessibility

Because the inner element is still a native scroll container, keyboard and
assistive-technology behavior remains close to the platform default. Make sure
scroll areas have enough visible height and do not trap important content inside
tiny panels.

When the scroll area contains a region that users need to discover, give the
surrounding section a heading such as `Logs`, `Notifications`, or `Results`.

## Gotchas

- The custom thumb is not draggable. It mirrors scroll position only.
- The component hides native scrollbars visually. Avoid using it where users
  need a permanent scrollbar as a strong affordance.
- `maxHeight` constrains the outer wrapper. If a parent has no height, string
  values like `100%` may not produce the result you expect.
- Content changes are measured by `ResizeObserver`, but virtualized lists should
  still own their own scroll strategy.

## Related

- `Aside` and `Drawer` for constrained side panels.
- `LogViewer` and `ActivityFeed` for common scrollable content.
- `VirtualList` or table virtualization for very large datasets.
- `Panel` and `Card` for framed content around the scroll area.
