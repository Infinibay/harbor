# Lightbox

`Lightbox` renders a full-screen image viewer in a portal. It shows one active image, optional
caption, previous and next controls, close control, and a thumbnail strip.

Use it for galleries, screenshots, media libraries, product-image inspection, design reviews,
and documentation image previews. It is controlled by the parent so routing, selected index,
and gallery state stay in your application.

## Import

```tsx
import { Lightbox } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);

<Lightbox
  images={[
    { id: "front", src: "/shots/front.png", alt: "Front view", caption: "Front" },
    { id: "side", src: "/shots/side.png", alt: "Side view", caption: "Side" },
  ]}
  index={index}
  onIndexChange={setIndex}
  open={open}
  onClose={() => setOpen(false)}
/>;
```

## Control Model

`open` decides whether the overlay is mounted. `index` selects the current image. The
lightbox never mutates image state internally; it calls `onIndexChange` when the user clicks
thumbnails, navigation buttons, or presses Arrow Left / Arrow Right.

Clicking the backdrop closes the lightbox. Clicking the image, thumbnails, or navigation
controls stops propagation so those interactions do not close it.

## Props

- **images** - `{ id, src, alt?, caption? }[]`.
- **index** - current image index.
- **onIndexChange** - `(index: number) => void`.
- **open** - whether the lightbox is visible.
- **onClose** - close callback.

## Accessibility

Images use `alt` when provided and an empty alt string otherwise. Provide real alt text for
content images and captions for context. Navigation buttons have accessible labels:
"Previous", "Next", and "Close".

The component listens for Escape and arrow keys, but it does not currently trap focus or
restore focus to the opener. For critical production galleries, manage focus in the parent or
wrap it in a higher-level dialog pattern.

## Gotchas

- `index` must point to an existing image. If it does not, the overlay renders nothing.
- Arrow navigation clamps at the first and last image.
- The lightbox does not lock body scroll. Add page-level scroll locking if background scroll
  is a problem in your app.
- Large unoptimized images can still be expensive. Serve responsive image assets when possible.

## Related

- `Carousel` for inline image browsing.
- `ImageGallery` for grid-style galleries.
- `Dialog` for focus-managed modal workflows.
- `CompareSlider` for before/after media.
