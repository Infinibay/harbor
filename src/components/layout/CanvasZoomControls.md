# CanvasZoomControls

Floating zoom widget — minus, percentage readout, plus, fit, 1:1.
Reads and mutates the parent `<Canvas>` via context, so drop it
anywhere inside (typically in the `overlay` slot). The buttons step
through the configured `presets` and clamp to the canvas's
`minZoom` / `maxZoom`.

## Import

```tsx
import { CanvasZoomControls } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={<CanvasZoomControls position="bottom-right" />}
>
  ...
</Canvas>
```

## Props

- **presets** — `number[]`. Step values for − / +. Default
  `[0.25, 0.5, 1, 1.5, 2, 4]`.
- **position** — `"bottom-right" | "bottom-left" | "top-right" | "top-left"`.
  Default `"bottom-right"`.
- **floating** — `boolean`. Default `true`. Set `false` to render
  inline (e.g. inside a custom toolbar).
- **className** — extra classes.

## Notes

- Must live inside a `<Canvas>`. Outside it, returns `null`.
- "Fit" calls `api.fit()` which frames every `[data-canvas-bounds]`
  child; "1:1" calls `api.reset()` (`x=0, y=0, zoom=1`).
- The percentage readout is a static label — there's no inline
  editing. Wire your own input through `useCanvas().api.zoomTo()` if
  you need that.
