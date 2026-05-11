# Aurora

`Aurora` renders animated, blurred SVG ribbons that move like soft light bands. Use it as a decorative background for heroes, empty states, onboarding panels, feature callouts, and immersive documentation examples where motion should feel calm and atmospheric.

It is a background layer. It renders `aria-hidden`, has `pointer-events: none`, and expects foreground content to live above it.

## Import

```tsx
import { Aurora } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
import { Aurora } from "@infinibay/harbor/backgrounds";

export function HeroBackdrop() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <Aurora bands={3} amplitude={0.18} intensity={0.45} />
      <div className="relative p-8">Build interfaces with Harbor.</div>
    </div>
  );
}
```

## Props

- **bands** - `number`. Number of color ribbons. Default `3`.
- **amplitude** - `number`. Wave amplitude as a fraction of height. Default `0.22`.
- **resolution** - `number`. Horizontal path resolution. Default `64`.
- **bandPhase** - `number`. Radian offset between bands. Default `0.9`.
- **speed** - `number`. Animation speed multiplier.
- **intensity** - `number`. Opacity/loudness control.
- **palette** - `readonly string[]`. Colors used across bands.
- **paused** - `boolean`. Externally pauses animation.
- **respectReducedMotion** - `boolean`. Renders still frames for reduced-motion users. Default `true`.
- **pauseWhenHidden** and **pauseWhenOutOfView** - performance pause controls.
- **className**, **style** - wrapper customization.

## Behavior

Each band is an SVG path. On every animation frame, Harbor updates the path `d` attribute using sine waves. The SVG is blurred and stretched to fill the wrapper. Colors are assigned from `palette`, cycling when `bands` exceeds palette length.

`useAnimationFrame` handles reduced motion, hidden tab pausing, and off-screen pausing.

## Accessibility

The layer is decorative and `aria-hidden`. Keep contrast high enough for any text above it, and never rely on the animation to communicate state.

## Gotchas

- The wrapper is absolutely positioned with `inset-0`; the parent should be `relative`.
- Higher `bands` and `resolution` increase per-frame path work.
- Blurred bright colors can reduce text contrast.
- Use `paused` for static screenshots or deterministic visual tests.

## Related

- `MacScape` for large layered wallpaper shapes.
- `Waves` for more direct wave motion.
- `MeshGradient` for static or slower gradient fields.
