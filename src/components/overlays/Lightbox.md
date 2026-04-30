# Lightbox

Full-screen image viewer with prev/next arrows, a thumbnail strip, an
optional caption, and keyboard navigation. Pair with `<ImageGallery>`
or any grid of thumbnails: keep the active index in the parent and
open the lightbox when a thumbnail is clicked.

## Import

```tsx
import { Lightbox } from "@infinibay/harbor/overlays";
```

## Example

```tsx
const [open, setOpen] = useState(false);
const [idx, setIdx] = useState(0);

const images = [
  { id: "a", src: "/picture.png", alt: "Render A", caption: "Front" },
  { id: "b", src: "/picture.png", alt: "Render B", caption: "Side" },
];

<Lightbox
  images={images}
  index={idx}
  onIndexChange={setIdx}
  open={open}
  onClose={() => setOpen(false)}
/>;
```

## Props

- **images** — `LightboxImage[]`. Required.
- **index** — `number`. Controlled active image.
- **onIndexChange** — `(i: number) => void`. Fires from arrows, arrow
  keys, and thumbnail clicks.
- **open** — `boolean`. Controlled visibility.
- **onClose** — `() => void`. Fires from Esc, the close button, and
  backdrop click.

### `LightboxImage`

- **id** — `string`. Stable key for crossfade animation.
- **src** — `string`.
- **alt** — `string`. Optional but strongly recommended.
- **caption** — `ReactNode`. Optional, shown under the image.

## Notes

- Keys: `←` / `→` paginate, `Esc` closes.
- Portals at `Z.DIALOG` with a heavy backdrop blur.
- The component is fully controlled — you own `index` and `open`, so
  deep-linking to a specific image (e.g. from the URL hash) is just a
  matter of seeding state.
