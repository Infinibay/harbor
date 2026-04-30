# MacScape

"macOS wallpaper" background — a small number of large, slow color hills that morph into each other. Closer to Big Sur / Monterey dynamic wallpapers than to `<Waves>` or `<Aurora>`.

## Import

```tsx
import { MacScape } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-screen">
  <MacScape layers={5} blur={10} intensity={0.6} />
</div>
```

## Props

- **layers** — `number`. Number of color hills. Default: `4`.
- **baseY** — `readonly number[]`. Per-layer base vertical position (0=top, 1=bottom). Default: derived (`0.28 + i * 0.24`).
- **blur** — `number`. Ambient blur on the SVG, in px. `0` for sharp layered look. Default: `6`.
- **resolution** — `number`. Points per layer's path. Default: `48`.
- **speed** — `number`. Default: `1`.
- **intensity** — `number`. 0..1, drives layer opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- A vertical gradient backdrop is set on the wrapper using the first three palette colors with low alpha — visible above/below the hills. Override via `style.background`.
- Sine-summed paths are recomputed in JS each frame but are cheap (default 48 segments × 4 layers).
- Prefer `<Waves>` for thinner parallax bands; `<Aurora>` for diffuse blurred ribbons.
