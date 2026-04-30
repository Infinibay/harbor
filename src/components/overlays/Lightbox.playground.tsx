import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const images = [
  { src: "https://images.unsplash.com/photo-1503264116251-35a269479413?w=800", alt: "Mountain" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", alt: "Beach" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", alt: "Forest" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LightboxDemo(props: any) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open lightbox</Button>
      <Lightbox
        {...props}
        images={images}
        index={idx}
        onIndexChange={(i: number) => {
          setIdx(i);
          props.onIndexChange?.(i);
        }}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
      />
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: LightboxDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {},
  events: [
    { name: "onIndexChange", signature: "(i: number) => void" },
    { name: "onClose", signature: "() => void" },
  ],
};
