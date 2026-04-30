# ParallaxGroup

Container that exposes cursor proximity to its `ParallaxLayer`
children. Stack a few layers absolutely with different `depth`
values and they translate (and optionally tilt) at different
rates as the cursor approaches — the classic poster / hero
effect. Coordinated through the global cursor provider, so one
mousemove listener powers any number of groups.

## Import

```tsx
import { ParallaxGroup, ParallaxLayer } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ParallaxGroup strength={24} radius={420}>
  <ParallaxLayer depth={0.2}>
    <img src="/picture.png" alt="" />
  </ParallaxLayer>
  <ParallaxLayer depth={0.6} tilt={0.4}>
    <h1>Foreground</h1>
  </ParallaxLayer>
</ParallaxGroup>
```

## Props (`<ParallaxGroup>`)

- **strength** — `number`. Max pixel offset for a layer at
  `depth=1` at the rim of the proximity radius. Default `24`.
- **radius** — `number`. Cursor-proximity radius in pixels.
  Default `420`.
- **perspective** — `number`. CSS `perspective` for 3D tilt;
  set to `0` to disable. Default `800`.
- **className** — extra classes on the wrapper.

## Props (`<ParallaxLayer>`)

- **depth** — `number`. `0` = static, `1` = full `strength`,
  negative = moves opposite the cursor (foreground feel).
  Default `0.5`.
- **tilt** — `number` (`0..1`). Rotates the layer toward the
  cursor in 3D. Default `0`.
- **stiffness** — `number`. Spring stiffness. Default `150`.
- **damping** — `number`. Spring damping. Default `20`.
- **className** — extra classes on the layer wrapper.

## Notes

- Stack layers with `position: absolute` and let the group
  define width / height — `<ParallaxGroup>` is `relative` by
  default.
- A layer outside any `ParallaxGroup` is inert (its motion
  values fall back to zero), so it's safe to use the same
  component conditionally.
