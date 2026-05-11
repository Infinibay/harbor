# BackgroundDistortion

`BackgroundDistortion` adds product-grade visual texture to a positioned area:
scanlines, CRT flicker, grain, VHS drift, pixel grids, dither, vignette, bloom,
or interlace effects. It is intentionally decorative and pointer-transparent, so
it can sit over dashboards, terminal panels, hero previews, canvas surfaces, or
desktop-style windows without blocking interaction.

Use it to support the mood of a product surface, not as the content itself.

## Import

```tsx
import { BackgroundDistortion } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

Place it inside a relatively positioned container. The overlay is absolute, so
the parent controls its bounds.

```tsx
<section className="relative overflow-hidden rounded-xl bg-surface-1">
  <BackgroundDistortion preset="scanlines" intensity={0.35} opacity={0.7} />
  <Terminal entries={entries} />
</section>
```

## Presets

The `preset` prop chooses the effect:

- `scanlines`: horizontal monitor lines.
- `crt`: subtle screen curvature and flicker.
- `grain`: fine noisy texture.
- `vhs`: color drift and jitter.
- `pixel-grid`: grid overlay for technical surfaces.
- `dither`: stippled retro texture.
- `vignette`: darkened edges.
- `bloom`: soft highlight wash.
- `interlace`: alternating line treatment.

## Tuning

`intensity` changes the strength of the effect. `opacity` controls how much of
the final overlay is visible. `tint` can align the effect with a brand or
workspace color, and `blend` controls the CSS blend mode.

```tsx
<BackgroundDistortion
  preset="vhs"
  intensity={0.45}
  tint="rgb(var(--harbor-accent))"
  blend="screen"
/>
```

## Props

- `preset`: required distortion style.
- `intensity`: strength of the generated effect; defaults to `0.5`.
- `animated`: enables motion where the preset supports it.
- `tint`: optional CSS color used by tintable presets.
- `blend`: CSS `mix-blend-mode` value.
- `opacity`: final overlay opacity; defaults to `1`.
- `className`: wrapper class override.
- `style`: inline style override.

## Accessibility

The component renders with `aria-hidden` and `pointer-events: none`. It does not
carry information and should never be the only signal for state.

For motion-heavy presets, give users a calmer experience by disabling animation
in contexts where reduced motion matters:

```tsx
<BackgroundDistortion preset="crt" animated={false} />
```

## Gotchas

The parent must be positioned, usually with `relative`, and should clip overflow
when the effect is meant to stay inside a card or window.

Strong blend modes can reduce text contrast. Test the final surface with real
content, not only an empty mockup.

## Related

- `AnimatedBackground` for full-page motion.
- `MeshGradient` and `Aurora` for color fields.
- `Terminal` and `CodeBlock` for surfaces that pair well with scanline effects.
