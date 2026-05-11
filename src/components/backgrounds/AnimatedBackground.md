# AnimatedBackground

`AnimatedBackground` is a dispatcher for Harbor's animated background variants. It is useful when a product lets the user choose a background style, when a showcase needs to swap variants, or when a page receives background configuration from content data.

For fixed product screens, import the specific background variant directly. That gives tighter props and smaller bundles.

## Import

```tsx
import {
  AnimatedBackground,
  BackgroundScene,
} from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
import { BackgroundScene } from "@infinibay/harbor/backgrounds";

export function HeroScene() {
  return (
    <BackgroundScene
      className="min-h-screen overflow-hidden"
      bgProps={{ variant: "mesh", blobs: 5, speed: 0.8 }}
      overlay="linear-gradient(180deg, rgba(8,9,16,0.2), rgba(8,9,16,0.78))"
      distortion="grain"
    >
      <main className="relative p-8">Content</main>
    </BackgroundScene>
  );
}
```

## Variants

```tsx
<AnimatedBackground variant="mesh" blobs={5} speed={0.8} />
<AnimatedBackground variant="aurora" />
<AnimatedBackground variant="waves" />
<AnimatedBackground variant="constellations" />
<AnimatedBackground variant="orbs" />
<AnimatedBackground variant="plasma" />
<AnimatedBackground variant="bubbles" />
<AnimatedBackground variant="macscape" />
```

The `variant` prop discriminates the TypeScript union, so each variant accepts only its own props.

## Props

### AnimatedBackground

- **variant**: `"mesh" | "aurora" | "waves" | "constellations" | "orbs" | "plasma" | "bubbles" | "macscape"`.
- All remaining props are forwarded to the selected variant.

### BackgroundScene

- **bgProps**: `AnimatedBackgroundProps`. Variant plus variant-specific configuration.
- **overlay**: optional CSS color or gradient drawn above the background and below content.
- **distortion**: `BackgroundDistortionProps | BackgroundDistortionProps["preset"]`. Adds CRT, grain, VHS, or other distortion layers.
- **className**: custom class on the positioned wrapper.
- **children**: content rendered above the background stack.

## Accessibility

Animated backgrounds are decorative. Keep meaningful text, controls, and images in the foreground content. Use overlays to preserve text contrast, and provide a reduced-motion strategy at the page or app level when motion could distract from the task.

## Gotchas

- The individual background variants are absolutely positioned. `BackgroundScene` provides the relative wrapper and content stacking for you.
- Importing `AnimatedBackground` can pull every variant into the bundle. Import `MeshGradient`, `Bubbles`, or another direct variant when the choice is static.
- Backgrounds do not set `z-index`; the wrapper decides where the scene sits in the page.
- Avoid placing forms or dense operational UI directly over high-motion variants without a strong overlay.

## Related

- [`MeshGradient`](./MeshGradient.md), [`Bubbles`](./Bubbles.md), and [`MacScape`](./MacScape.md) for direct variant use.
- [`BackgroundDistortion`](./BackgroundDistortion.md) for grain, CRT, and VHS layers.
- [`HeroSection`](../sections/HeroSection.md) for content composition above media.
