# ParallaxGroup

`ParallaxGroup` coordinates cursor-proximity motion for layered visual compositions. Child `ParallaxLayer` elements translate, and optionally tilt, at different depths as the pointer approaches the group.

Use it for product visuals, hero media, cover art, showcase cards, or interactive previews. Avoid it for dense work surfaces where motion distracts from repeated tasks.

## Import

```tsx
import { ParallaxGroup, ParallaxLayer } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { ParallaxGroup, ParallaxLayer } from "@infinibay/harbor/layout";

export function ProductPreview() {
  return (
    <ParallaxGroup className="h-[360px] overflow-hidden rounded-xl" strength={24}>
      <ParallaxLayer depth={0.15} className="absolute inset-0">
        <img src="/preview/background.png" alt="" />
      </ParallaxLayer>
      <ParallaxLayer depth={0.55} tilt={0.35} className="absolute inset-10">
        <img src="/preview/app-window.png" alt="Harbor app preview" />
      </ParallaxLayer>
    </ParallaxGroup>
  );
}
```

## Depth Model

`depth` controls how far a layer moves relative to `strength`.

- `0` means static.
- `1` moves by the full `strength`.
- Negative values move opposite the cursor and can feel like foreground.
- `tilt` adds 3D rotation toward the cursor.

## Props

### ParallaxGroup

- **children**: `ReactNode`.
- **strength**: `number`. Max pixel offset for `depth={1}`. Defaults to `24`.
- **radius**: `number`. Cursor-proximity radius in pixels. Defaults to `420`.
- **perspective**: `number`. CSS perspective for 3D tilt. Defaults to `800`; set `0` to disable.
- **className**: custom class on the relative wrapper.

### ParallaxLayer

- **children**: `ReactNode`.
- **depth**: `number`. Defaults to `0.5`.
- **tilt**: `number`. Rotation intensity from `0` to `1`. Defaults to `0`.
- **stiffness**: `number`. Spring stiffness. Defaults to `150`.
- **damping**: `number`. Spring damping. Defaults to `20`.
- **className**: custom class on the layer.

## Accessibility

Parallax should be decorative. Keep meaningful images labelled and decorative layers `alt=""`. If the motion surrounds critical content, provide a reduced-motion experience in the consuming page.

## Gotchas

- The group is `position: relative`; you still need to size it.
- Layers often need `position: absolute` classes so they stack.
- A `ParallaxLayer` outside a group is inert because its motion values fall back to zero.
- High `strength` plus high `tilt` can make UI text hard to read.

## Related

- [`ContentSwap`](./ContentSwap.md) for animated content changes.
- [`BackgroundScene`](../backgrounds/AnimatedBackground.md) for full visual scenes.
- [`HeroSection`](../sections/HeroSection.md) for structured hero content.
