# PlasmaField

Classic demoscene plasma — a continuous color field from summed sines. Renders into a low-resolution canvas and is upscaled with CSS + blur, so the per-pixel loop only touches thousands of pixels per frame instead of millions.

## Import

```tsx
import { PlasmaField } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96">
  <PlasmaField scale={6} frequency={0.025} blur={22} />
</div>
```

## Props

- **scale** — `number`. Render-size divisor; canvas is sized `width/scale × height/scale`. Higher = cheaper, blurrier. Default: `8`.
- **frequency** — `number`. Turbulence frequency. Default: `0.02`.
- **blur** — `number`. CSS `blur(...)` applied to the upscaled canvas, in px. Default: `18`.
- **speed** — `number`. Default: `1`.
- **intensity** — `number`. 0..1, drives alpha (full at 1.0). Default: `0.5`.
- **palette** — `readonly string[]`. Plasma cycles through and interpolates between adjacent entries. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- Canvas is intentionally **not** DPR-scaled — `putImageData` ignores canvas transforms, so a DPR-scaled buffer would only fill the top-left quadrant. CSS upscaling handles HiDPI fine because the result is blurred anyway.
- Cost scales with `(width × height) / scale²`. At `scale=4` the cost is 4× higher than `scale=8`.
- Palette is parsed from hex once; non-hex CSS colors won't work — pass `#rgb` or `#rrggbb`.
