# CanvasRuler

Pixel ruler that scrolls with pan and rescales with zoom. Shows major
labeled ticks at "nice" world-unit intervals (1, 2 or 5 × 10ⁿ) plus
finer minor ticks in between. Render two — one horizontal, one
vertical — inside a Canvas `overlay` to get the classic top + left
rulers from design tools.

## Import

```tsx
import { CanvasRuler } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={
    <>
      <CanvasRuler orientation="horizontal" />
      <CanvasRuler orientation="vertical" />
    </>
  }
>
  ...
</Canvas>
```

## Props

- **orientation** — `"horizontal" | "vertical"`.
- **thickness** — `number`. Px height (horizontal) / width (vertical).
  Default `22`.
- **targetTickSpacing** — `number`. Approx px between labeled ticks.
  Default `100`.
- **className** — extra classes on the ruler shell.

## Notes

- Reads pan/zoom from `useCanvas()`. Outside a Canvas it renders an
  empty placeholder bar.
- Tick interval is recalculated on every transform — at very high
  zoom you'll see tens of world units between labels, at low zoom
  you'll see thousands.
- Pair with `CanvasStatusBar` to show the cursor's world coords in
  the same units as the ruler labels.
