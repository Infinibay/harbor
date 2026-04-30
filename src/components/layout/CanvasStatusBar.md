# CanvasStatusBar

Thin info bar pinned to the bottom of a `<Canvas>` showing live x/y
pan offsets and the current zoom percentage. Hosts custom slots on
the left and right for selection counts, tool hints, network status —
whatever your app needs at a glance. Subscribes to the Canvas context.

## Import

```tsx
import { CanvasStatusBar } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={
    <CanvasStatusBar
      left={<span>3 selected</span>}
      right={<span>v1 · saved</span>}
    />
  }
>
  ...
</Canvas>
```

## Props

- **left** — `ReactNode`. Custom content rendered before built-ins.
- **right** — `ReactNode`. Custom content rendered after built-ins.
- **showCoords** — `boolean`. Default `true`.
- **showZoom** — `boolean`. Default `true`.
- **floating** — `boolean`. Default `true`. Pins to the bottom of the
  Canvas; set `false` to render inline.
- **className** — extra classes.

## Notes

- Lives inside a `<Canvas>` (typically the `overlay` slot). It reads
  the live transform from `useCanvas()`.
- The `x` / `y` shown are the screen-space pan offsets, not the
  cursor's world coords. To track cursor position, render a small
  component that subscribes to `useCanvas()` and `pointermove` events.
