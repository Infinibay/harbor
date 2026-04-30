# ImageGallery

OS image picker — search + sort controls (recent / most-used / name /
size) over a responsive grid of cards. Click a card → `onSelect`. For
generic file/photo grids use a `<FluidGrid>` of your own cards.

## Import

```tsx
import { ImageGallery, type OSImage } from "@infinibay/harbor/display";
```

## Example

```tsx
<ImageGallery
  images={[
    {
      id: "ubuntu-24",
      name: "Ubuntu Server 24.04",
      os: "ubuntu",
      version: "24.04 LTS",
      size: 1_400_000_000,
      lastUsed: Date.now() - 24 * 3600_000,
      usageCount: 42,
    },
    // …
  ]}
  selectedId={picked}
  onSelect={(img) => setPicked(img.id)}
/>
```

## OSImage

```ts
{
  id: string;
  name: string;
  os: string;            // "ubuntu" | "alpine" | "nixos" | "debian" | …
  version?: string;
  size: number;          // bytes
  lastUsed?: Date | string | number;
  usageCount?: number;
  color?: string;        // gradient class override
  icon?: string;         // emoji or single-char fallback
  description?: string;
}
```

## Props

- **images** — `readonly OSImage[]`. Required.
- **onSelect** — `(img: OSImage) => void`.
- **selectedId** — `string`. Highlights the matching card with a
  fuchsia ring.
- **minCardWidth** — `number`. Grid `auto-fill` minimum (px). Default `220`.
- **className** — extra classes on the wrapper.

## Notes

- The component bundles its own search input and sort chips — they're
  local state. To control filtering externally, pre-filter the
  `images` array.
- Built-in OS palettes cover ubuntu / debian / alpine / nixos / arch /
  fedora / centos / windows. Other slugs fall back to neutral + the
  first letter of `os` as the icon.
