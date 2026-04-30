import { useState } from "react";
import { ImageGallery, type OSImage } from "./ImageGallery";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const HOUR = 3600_000;

const images: OSImage[] = [
  { id: "ubuntu-24", name: "Ubuntu Server", os: "ubuntu", version: "24.04 LTS", size: 1_400_000_000, lastUsed: Date.now() - 24 * HOUR, usageCount: 42, description: "Long-term support, batteries included." },
  { id: "ubuntu-22", name: "Ubuntu Server", os: "ubuntu", version: "22.04 LTS", size: 1_300_000_000, lastUsed: Date.now() - 5 * 24 * HOUR, usageCount: 18 },
  { id: "alpine", name: "Alpine Linux", os: "alpine", version: "3.20", size: 180_000_000, lastUsed: Date.now() - 12 * HOUR, usageCount: 9, description: "Minimal, security-oriented." },
  { id: "debian", name: "Debian", os: "debian", version: "12 Bookworm", size: 1_100_000_000, lastUsed: Date.now() - 7 * 24 * HOUR, usageCount: 14 },
  { id: "fedora", name: "Fedora", os: "fedora", version: "40", size: 2_100_000_000, lastUsed: Date.now() - 10 * 24 * HOUR, usageCount: 5 },
  { id: "windows", name: "Windows Server", os: "windows", version: "2022", size: 5_400_000_000, lastUsed: Date.now() - 30 * 24 * HOUR, usageCount: 3 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageGalleryDemo(props: any) {
  const [picked, setPicked] = useState<string | undefined>("ubuntu-24");
  return (
    <ImageGallery
      images={images}
      selectedId={picked}
      onSelect={(img) => {
        setPicked(img.id);
        props.onSelect?.(img.id);
      }}
      minCardWidth={props.minCardWidth ?? 220}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ImageGalleryDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    minCardWidth: { type: "number", default: 220, min: 160, max: 360, step: 10 },
  },
  events: [
    { name: "onSelect", signature: "(image: OSImage) => void", description: "Demo passes the image id." },
  ],
};
