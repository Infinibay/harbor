# BackgroundDistortion

Pure CSS overlay that layers a screen-style distortion (scanlines, CRT, grain, VHS, dither, etc.) on top of any background or content. Doesn't touch the layer below — just draws on top.

## Import

```tsx
import { BackgroundDistortion, Distorted } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-80">
  <MeshGradient />
  <BackgroundDistortion preset="crt" intensity={0.6} />
</div>

<Distorted preset="vhs" intensity={0.7}>
  <Aurora />
</Distorted>
```

## Props

- **preset** — `"scanlines" | "crt" | "grain" | "vhs" | "pixel-grid" | "dither" | "vignette" | "bloom" | "interlace"`. Required.
- **intensity** — `number`. 0..1, scales the effect's strength. Default: `0.5`.
- **animated** — `boolean`. Toggle motion sub-effects (scanline roll, CRT flicker, VHS tracking band, grain shudder). Auto-disabled by `prefers-reduced-motion`. Default: `true`.
- **tint** — `string`. CSS color override for mono presets (`scanlines`, `pixel-grid`, `dither`, `interlace`). Default depends on preset.
- **blend** — `CSSProperties["mixBlendMode"]`. Override the default per-preset blend.
- **opacity** — `number`. Overall overlay opacity. Default: `1`.
- **className**, **style** — applied to the overlay element.

### `<Distorted>` extras

`<Distorted>` accepts the same props plus **children** — wraps content in a `position: absolute inset-0` div with the distortion layered on top.

## Notes

- Renders `position: absolute inset-0`. Parent must be `position: relative`.
- `bloom` uses `backdrop-filter` to sample the layers below. Other presets are pure overlays and don't need a backdrop.
- Animations rely on Harbor's keyframes (`harbor-scanline-roll`, `harbor-crt-flicker`, `harbor-vhs-jitter`, `harbor-vhs-track`); they ship with the package CSS.
- Each preset has a sensible default `mixBlendMode` (multiply for darkening, screen for VHS, overlay for grain). Override with `blend` when stacking on a very light or very dark base.
