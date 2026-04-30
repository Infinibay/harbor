# Aurora

Flowing aurora-like ribbons made of animated, blurred SVG paths. Cheap GPU-composited look — good as a hero backdrop or a quiet ambient layer.

## Import

```tsx
import { Aurora } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96">
  <Aurora bands={4} amplitude={0.25} intensity={0.6} />
</div>
```

## Props

- **bands** — `number`. Number of color ribbons. Default: `3`.
- **amplitude** — `number`. Wave amplitude as fraction of height (0..1). Default: `0.22`.
- **resolution** — `number`. Points per wave path. Default: `64`.
- **bandPhase** — `number`. Horizontal offset between bands, in radians. Default: `0.9`.
- **speed** — `number`. Animation speed multiplier. Default: `1`.
- **intensity** — `number`. 0..1, drives band opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Hex colors; bands cycle through it. Default: Harbor accents.
- **paused** — `boolean`. Freeze the animation.
- **respectReducedMotion** — `boolean`. Default: `true`.
- **pauseWhenHidden** / **pauseWhenOutOfView** — `boolean`. Default: `true`.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- Path is updated imperatively — no React re-renders per frame.
- The 32px Gaussian blur is applied via inline SVG filter; cheap on GPU but counts as a stacking context, so don't expect children to blend through it.
- For sharper layered hills, prefer `<MacScape>`; for thin parallax sine waves, prefer `<Waves>`.
