# AnimatedBackground

Single dispatcher that renders any of Harbor's animated background variants by name. Use it when the variant is configurable (e.g. theme picker); otherwise import a specific variant for tighter typing and smaller bundles. Ships with `<BackgroundScene>` for the common "background + overlay + content" composition.

## Import

```tsx
import { AnimatedBackground, BackgroundScene } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<AnimatedBackground variant="mesh" blobs={5} speed={0.8} />

<BackgroundScene
  bgProps={{ variant: "bubbles", count: 12, gooeyness: 20 }}
  overlay="rgba(10,10,15,0.4)"
  distortion="crt"
  className="h-screen"
>
  <YourPage />
</BackgroundScene>
```

## Props (AnimatedBackground)

- **variant** — `"mesh" | "aurora" | "waves" | "constellations" | "orbs" | "plasma" | "bubbles" | "macscape"`. Required.
- All remaining props are forwarded to the chosen variant. The union is discriminated by `variant`, so TS only allows the right per-variant props.

## Props (BackgroundScene)

- **bgProps** — `AnimatedBackgroundProps`. The variant + variant-specific config.
- **overlay** — optional CSS color/gradient pane drawn above the background, below content.
- **distortion** — `BackgroundDistortionProps | DistortionPreset`. Layer a CRT/grain/VHS/etc. overlay. String shorthand expands to `{ preset: ... }`.
- **className** — extra classes on the outer wrapper. Wrapper is `position: relative` and sized by its parent (or `className`).
- **children** — content rendered above background, overlay, and distortion.

## Notes

- All variants render `position: absolute inset-0` and require a positioned parent. `<BackgroundScene>` provides one.
- Importing a single variant (`MeshGradient`, `Bubbles`, ...) avoids pulling all variants into the bundle.
- For full-screen backgrounds wrap with `<BackgroundScene className="fixed inset-0 -z-10">` or similar; the components themselves don't take z-index.
