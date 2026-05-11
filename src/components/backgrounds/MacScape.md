# MacScape

`MacScape` renders large animated color hills inspired by desktop wallpaper. It is slower, broader, and more scenic than `Waves`, making it useful for first-run screens, product showcases, hero backdrops, presentation slides, and polished empty states.

Like the other Harbor backgrounds, it is decorative and should sit behind real UI.

## Import

```tsx
import { MacScape } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
import { MacScape } from "@infinibay/harbor/backgrounds";

export function WelcomePanel() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <MacScape layers={5} blur={10} intensity={0.55} />
      <div className="relative p-8">Welcome to Harbor Studio</div>
    </div>
  );
}
```

## Props

- **layers** - `number`. Number of color hill layers. Default `4`.
- **baseY** - `readonly number[]`. Base vertical positions as fractions of height.
- **blur** - `number`. SVG blur in pixels. Default `6`.
- **resolution** - `number`. Path resolution per layer. Default `48`.
- **speed** - `number`. Animation speed multiplier.
- **intensity** - `number`. Layer opacity control.
- **palette** - `readonly string[]`. Layer and background colors.
- **paused** - `boolean`. Externally pauses animation.
- **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** - animation controls from background common props.
- **className**, **style** - wrapper customization.

## Behavior

The wrapper paints a palette-based vertical gradient, then SVG paths draw layered hills over it. Each layer has its own phase, amplitude, and sine frequencies. On animation frames, Harbor recomputes each layer path and writes it to the SVG.

`baseY` lets you place layers manually. If omitted, Harbor stacks them progressively from the upper third downward.

## Accessibility

`MacScape` is `aria-hidden` and ignores pointer events. Keep important UI in a positioned foreground layer and verify text contrast against the brightest palette combinations.

## Gotchas

- The component expects a positioned, clipped parent.
- High `layers` and `resolution` values increase per-frame work.
- `respectReducedMotion` is optional here; pass it explicitly if you need strict reduced-motion behavior.
- The implementation resizes its path ref array with a deferred state bump when layer count changes.

## Related

- `Aurora` for soft light ribbons.
- `Waves` for more explicit animated waves.
- `AnimatedBackground` for a higher-level background wrapper.
