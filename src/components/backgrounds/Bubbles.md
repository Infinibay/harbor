# Bubbles

`Bubbles` renders animated SVG metaballs that drift, merge, and separate inside a full-bleed background layer. It is a decorative background for playful product areas, media surfaces, signup screens, showcase cards, and branded empty states.

Use it when the background should feel alive but not represent data. For quieter operational screens, prefer static surfaces or subtle gradients.

## Import

```tsx
import { Bubbles } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
import { BackgroundScene, Bubbles } from "@infinibay/harbor/backgrounds";

export function WelcomePanel() {
  return (
    <BackgroundScene
      className="min-h-[420px] overflow-hidden rounded-xl"
      bgProps={{
        variant: "bubbles",
        count: 12,
        sizeRange: [36, 120],
        gradient: true,
        backdrop: "#080910",
      }}
      overlay="linear-gradient(180deg, rgba(8,9,16,0.15), rgba(8,9,16,0.72))"
    >
      <div className="relative p-8">Foreground content</div>
    </BackgroundScene>
  );
}
```

## Motion Model

Each bubble has deterministic seeded position, velocity, radius, and color. Animation updates SVG circle positions with `useAnimationFrame`, bouncing bubbles off container edges. The gooey merge effect comes from an SVG blur plus color matrix filter.

## Props

- **count**: `number`. Bubble count. Defaults to `10`.
- **sizeRange**: `[number, number]`. Min/max radius in pixels. Defaults to `[30, 110]`.
- **drift**: `number`. Base drift speed in pixels per second. Defaults to `36`.
- **gooeyness**: `number`. Alpha-stretch strength for merges. Defaults to `18`.
- **mergeRadius**: `number`. Filter blur radius. Defaults to `14`.
- **gradient**: `boolean`. Uses radial gradients inside bubbles.
- **backdrop**: `string`. Background color behind the bubbles.
- **speed**, **intensity**, **palette**, **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView**, **className**, **style**: shared background props.

## Accessibility

`Bubbles` is decorative and renders with `aria-hidden`. Keep meaningful content in foreground layers and preserve contrast with an overlay when placing text above it.

Respect reduced motion for product pages where motion could distract from form completion or repeated work.

## Gotchas

- The component is absolutely positioned. Use it inside a positioned, sized wrapper or through `BackgroundScene`.
- Large `count`, `sizeRange`, or `mergeRadius` values increase SVG filter cost.
- Palette changes recreate seeded bubble state.
- `backdrop` is visible only where bubbles do not cover the background.

## Related

- [`AnimatedBackground`](./AnimatedBackground.md) for variant dispatch.
- [`MeshGradient`](./MeshGradient.md) for a calmer animated background.
- [`BackgroundDistortion`](./BackgroundDistortion.md) for grain and CRT overlays.
