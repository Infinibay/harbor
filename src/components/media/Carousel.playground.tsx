import { Carousel } from "./Carousel";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const slides = [
  { id: "1", src: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200", alt: "Mountain" },
  { id: "2", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200", alt: "Forest" },
  { id: "3", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", alt: "Beach" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CarouselDemo(props: any) {
  return <Carousel {...props} slides={slides} />;
}

export const playground: PlaygroundManifest = {
  component: CarouselDemo as never,
  importPath: "@infinibay/harbor/media",
  controls: {
    aspect: { type: "select", options: ["video", "square", "wide"], default: "video" },
    showDots: { type: "boolean", default: true },
    showArrows: { type: "boolean", default: true },
    initial: { type: "number", default: 0, min: 0, max: 2 },
  },
  variants: [
    { label: "Video aspect", props: { aspect: "video" } },
    { label: "Square", props: { aspect: "square" } },
    { label: "Wide", props: { aspect: "wide" } },
    { label: "Minimal", props: { showDots: false, showArrows: false } },
  ],
};
