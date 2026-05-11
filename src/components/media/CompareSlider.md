# CompareSlider

`CompareSlider` lets users drag a divider to compare two same-aspect images. Use it for before-and-after visuals, theme changes, image edits, UI redesigns, generated previews, performance visualizations, and product demos where the difference is easier to understand interactively.

The component owns the slider percentage after mount. Your app provides the image URLs and labels.

## Import

```tsx
import { CompareSlider } from "@infinibay/harbor/media";
```

## Basic Usage

```tsx
<CompareSlider
  before="/screenshots/dashboard-before.png"
  after="/screenshots/dashboard-after.png"
  beforeLabel="Before Harbor"
  afterLabel="After Harbor"
  defaultValue={45}
/>
```

Use it inside a constrained media section:

```tsx
<Container size="lg">
  <CompareSlider before={oldPreview} after={newPreview} />
</Container>
```

## Props

- **before** - required image URL for the base image.
- **after** - required image URL revealed from the left as the divider moves.
- **beforeLabel** - optional string. Defaults to `"Before"`.
- **afterLabel** - optional string. Defaults to `"After"`.
- **defaultValue** - optional number from `0` to `100`. Defaults to `50`.
- **className** - optional string merged onto the root.

## Interaction Model

The root listens to pointer down, move, up, and cancel events. On pointer down it captures the pointer, measures the component bounds, and maps the pointer's x position to a percentage. Dragging updates the reveal width.

The component uses `aspect-video`, so both images should work at a 16:9 ratio unless you override the class.

## Content Guidance

Use images with the same dimensions and composition. If the before and after screenshots are framed differently, users will compare camera movement instead of product change.

Labels should name the states, not just repeat `"Before"` and `"After"` when the states are specific: `"CSS only"` and `"Harbor components"`, `"Old dashboard"` and `"New dashboard"`, or `"Raw"` and `"Enhanced"`.

## Accessibility

`CompareSlider` is pointer-first and the images are currently decorative (`alt=""`). If the comparison carries essential information, describe the difference in nearby text or provide separate accessible images/content. Do not rely on dragging as the only way to understand a critical change.

## Gotchas

- It is uncontrolled after `defaultValue`; changing `defaultValue` later does not reset the slider.
- The component does not include keyboard controls today.
- Mismatched image aspect ratios can make the reveal feel wrong.
- Remote images should be optimized and reliable; broken images leave an empty comparison.

## Related

- `ImageGallery` for browsing multiple images.
- `Carousel` for sequential media.
- `Lightbox` for larger inspection.
- `Container` for constraining the comparison width.
