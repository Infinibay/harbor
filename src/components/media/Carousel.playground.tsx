import { Carousel } from "./Carousel";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const slides = [
  {
    id: "1",
    content: (
      <img src="/picture.png" alt="Slide 1" className="w-full h-full object-cover" />
    ),
  },
  {
    id: "2",
    content: (
      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-fuchsia-500/30 to-sky-500/30 text-white text-2xl font-semibold">
        Any ReactNode goes here
      </div>
    ),
  },
  {
    id: "3",
    content: (
      <img src="/picture.png" alt="Slide 3" className="w-full h-full object-cover" />
    ),
  },
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
