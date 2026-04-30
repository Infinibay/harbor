# CompareSlider

Before / after image comparison with a draggable divider. Drag
anywhere on the surface — not just the handle — to scrub.

## Import

```tsx
import { CompareSlider } from "@infinibay/harbor/media";
```

## Example

```tsx
<CompareSlider
  before="/before.jpg"
  after="/after.jpg"
  beforeLabel="Original"
  afterLabel="Edited"
  defaultValue={50}
/>
```

## Props

- **before** — `string`. Required. Image URL shown on the left side
  (and behind the after image at 100%).
- **after** — `string`. Required. Image URL shown on the right side.
- **beforeLabel** — `string`. Default `"Before"`.
- **afterLabel** — `string`. Default `"After"`.
- **defaultValue** — `number`. Initial divider position (0–100).
  Default `50`.
- **className** — extra classes on the wrapper.

## Notes

- The component is uncontrolled — there's no `value` / `onChange`. Wrap
  it yourself if you need to read the divider position from the parent.
- Both images should share the same intrinsic aspect; the wrapper is
  `aspect-video` and stretches both via `object-cover`.
- Pointer capture means dragging works even when the cursor leaves the
  surface.
