# Carousel

`Carousel` displays one slide at a time with animated transitions, optional arrows, optional dots, and horizontal drag gestures. Use it for product screenshots, media previews, onboarding panels, testimonial visuals, and small content sequences.

It accepts any React node as slide content, so slides can be images, video placeholders, cards, diagrams, or custom composed UI.

## Import

```tsx
import { Carousel } from "@infinibay/harbor/media";
```

## Basic Usage

```tsx
import { Carousel } from "@infinibay/harbor/media";

const slides = [
  { id: "dashboard", content: <img src="/picture.png" alt="Dashboard" /> },
  { id: "editor", content: <div>Editor preview</div> },
  { id: "settings", content: <img src="/picture.png" alt="Settings" /> },
];

export function ProductTour() {
  return <Carousel slides={slides} aspect="video" />;
}
```

## Props

- **slides** - `CarouselSlide[]`. Required ordered slide list.
- **initial** - `number`. Initial slide index. Default `0`.
- **className** - extra classes on the wrapper.
- **showDots** - `boolean`. Default `true`.
- **showArrows** - `boolean`. Default `true`.
- **aspect** - `"video" | "square" | "wide"`. Default `"video"`.

## Slide Model

```ts
type CarouselSlide = {
  id: string;
  content: ReactNode;
};
```

Use stable ids so slide transitions stay predictable. The component does not lazy-load slide content, so handle heavy media outside the carousel when needed.

## Behavior

Arrows loop around the slide list. Dots jump to a specific slide and animate the active indicator width. Dragging left advances to the next slide; dragging right returns to the previous slide when the drag offset crosses roughly 60 pixels.

`initial` is used only for the first render. After mount, the carousel owns its active index.

## Accessibility

Arrow and dot buttons currently do not include `aria-label` values. If this carousel is customer-facing or central to navigation, wrap it with accessible labels or improve the component before release. Slide content should provide its own alt text or accessible copy.

## Gotchas

- Empty `slides` will break because the component reads `slides[idx]`.
- `initial` is not clamped.
- The active index is uncontrolled after mount.
- The carousel does not auto-play.

## Related

- `Lightbox` for focused image viewing.
- `ImageGallery` for multi-image browsing.
- `CompareSlider` for before/after media.
