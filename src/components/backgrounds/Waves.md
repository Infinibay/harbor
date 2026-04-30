# Waves

Parallax sine waves layered with transparency. SVG paths are rewritten imperatively per frame — one `d` attribute per wave, no React churn. Good for a calm bottom-of-page footer or hero band.

## Import

```tsx
import { Waves } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-80">
  <Waves count={5} amplitude={0.12} frequency={2.6} />
</div>
```

## Props

- **count** — `number`. Stacked wave layers. Default: `4`.
- **amplitude** — `number`. Relative amplitude as fraction of viewport height (0..1). Default: `0.1`.
- **frequency** — `number`. Horizontal frequency — more = tighter peaks. Default: `2.2`.
- **resolution** — `number`. Points per wave path. Default: `80`.
- **speed** — `number`. Default: `1`.
- **intensity** — `number`. 0..1, drives wave opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- Each subsequent wave fades and shifts down slightly for a parallax look.
- For thicker, slower hills (Big Sur wallpaper feel) use `<MacScape>`; for blurred ribbon glow use `<Aurora>`.
