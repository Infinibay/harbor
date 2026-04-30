# MeshGradient

Animated mesh gradient — soft color blobs that drift and **bounce off the container edges** so nothing escapes the frame. Heavy blur lets neighbors melt together. Single rAF loop, no React re-renders per frame.

## Import

```tsx
import { MeshGradient } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96">
  <MeshGradient blobs={5} blur={100} speed={0.8} />
</div>
```

## Props

- **blobs** — `number`. Number of blobs. Default: `4`.
- **blobSize** — `number`. Blob diameter as a fraction of `min(width, height)`. Default: `0.7`.
- **blur** — `number`. Wrapper blur in px. Default: `80`.
- **drift** — `number`. Base drift speed in container fractions/sec. Default: `0.08`.
- **speed** — `number`. Multiplier on `drift`. Default: `1`.
- **intensity** — `number`. 0..1, drives blob opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- The wrapper has `filter: blur(...)` — it's the cheap path on GPU but creates a stacking context. Children of the parent below it won't blend through.
- Blobs are deterministic per `(blobs, blobSize, drift, palette)` (sin-hash seeded), so the same config always produces the same starting layout.
- For metaball merging behavior with crisp outlines use `<Bubbles>`; for clearly separated glowing dots use `<Orbs>`.
