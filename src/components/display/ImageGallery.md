# ImageGallery

`ImageGallery` is a purpose-built picker for operating-system images: Ubuntu, Alpine, Debian, Windows, NixOS, and similar boot images. It combines search, sort chips, responsive cards, image metadata, and a selected state into one deploy-console primitive.

Use it in provisioning flows, VM creation wizards, template libraries, and admin panels where the user needs to choose a base image before selecting region, size, or credentials.

## Import

```tsx
import { ImageGallery, type OSImage } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { useState } from "react";
import { ImageGallery, type OSImage } from "@infinibay/harbor/display";

const images: OSImage[] = [
  {
    id: "ubuntu-2404",
    name: "Ubuntu Server",
    os: "ubuntu",
    version: "24.04 LTS",
    size: 1_400_000_000,
    lastUsed: "2026-05-10T12:00:00Z",
    usageCount: 42,
    description: "General-purpose LTS image for production workloads.",
  },
  {
    id: "alpine-319",
    name: "Alpine Linux",
    os: "alpine",
    version: "3.19",
    size: 182_000_000,
    usageCount: 18,
  },
];

export function ImagePicker() {
  const [selectedId, setSelectedId] = useState("ubuntu-2404");

  return (
    <ImageGallery
      images={images}
      selectedId={selectedId}
      onSelect={(image) => setSelectedId(image.id)}
    />
  );
}
```

## Data Model

```ts
type OSImage = {
  id: string;
  name: string;
  os: string;
  version?: string;
  size: number;
  lastUsed?: Date | string | number;
  usageCount?: number;
  color?: string;
  icon?: string;
  description?: string;
};
```

`size` is bytes. `lastUsed` can be a `Date`, timestamp, or date string. `color` overrides the built-in OS tone class, and `icon` overrides the default first-letter fallback.

## Props

- **images**: `readonly OSImage[]`. Required list rendered as cards.
- **onSelect**: `(img: OSImage) => void`. Called when a card is clicked.
- **selectedId**: `string`. Adds the selected ring to the matching image.
- **minCardWidth**: `number`. Minimum card width for the auto-fill grid. Defaults to `220`.
- **className**: custom class on the outer wrapper.

## Accessibility

Each image card is a button and exposes selected state with `aria-pressed`. The sort chips are also buttons with pressed state. Keep the selected image mirrored in the surrounding form summary so screen-reader users can confirm the larger provisioning choice.

## Gotchas

- Search and sort are internal state. If you need server-side filtering, pass a pre-filtered `images` array and let the component handle only local refinement.
- Built-in OS tones cover common slugs. Unknown `os` values fall back to a neutral style and the first letter.
- The component is intentionally image-template specific. For generic media or files, compose cards inside `FluidGrid` or `MasonryGrid`.
- Very long descriptions are clamped to keep card heights balanced.

## Related

- [`FluidGrid`](../layout/FluidGrid.md) for generic responsive card grids.
- [`ResourceMeter`](./ResourceMeter.md) for VM resource summaries.
- [`Wizard`](../inputs/Wizard.md) for multi-step provisioning flows.
