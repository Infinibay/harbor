import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const images = [
  { id: "1", src: "/picture.png", alt: "Picture 1", caption: "First picture" },
  { id: "2", src: "/picture.png", alt: "Picture 2", caption: "Second picture" },
  { id: "3", src: "/picture.png", alt: "Picture 3", caption: "Third picture" },
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
