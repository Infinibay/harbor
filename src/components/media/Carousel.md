# Carousel

Slide-style content rotator with drag, arrows, and dot pagination.
Each slide accepts arbitrary `ReactNode` content — images, copy,
embeds. For an immersive image viewer with zoom + arrow keys see
`<Lightbox>`.

## Import

```tsx
import { Carousel, type CarouselSlide } from "@infinibay/harbor/media";
```

## Example

```tsx
<Carousel
  aspect="video"
  slides={[
    { id: "1", content: <img src="/cover-1.jpg" className="w-full h-full object-cover" /> },
    { id: "2", content: <div className="grid place-items-center">Welcome aboard.</div> },
    { id: "3", content: <video src="/promo.mp4" autoPlay muted loop /> },
  ]}
/>
```

## CarouselSlide

```ts
{ id: string; content: ReactNode }
```

## Props

- **slides** — `CarouselSlide[]`. Required.
- **initial** — `number`. Index of the first visible slide. Default `0`.
- **showArrows** — `boolean`. Default `true`. Left/right round buttons.
- **showDots** — `boolean`. Default `true`. Pagination dots at the bottom.
- **aspect** — `"video" | "square" | "wide"`. Default `"video"`. Sets
  the container aspect-ratio (16/9, 1/1, 21/9).
- **className** — extra classes on the wrapper.

## Notes

- Drag the slide horizontally to advance: a 60px throw triggers
  next/prev. The animation uses framer-motion's `popLayout` mode.
- Slides loop — clicking past the last slide wraps to the first.
- `<Carousel>` doesn't lazy-load; if you have heavy media, render
  placeholders inside `content` and swap them in on demand.
