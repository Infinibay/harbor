import { useState } from "react";
import { Drawer } from "./Drawer";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DrawerDemo(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
        title={props.title ?? "Filters"}
      >
        <div className="space-y-3 text-sm text-white/70">
          <p>Drawer body. Use it for non-modal contextual UIs like settings, filters, or details.</p>
          <p>Press Escape or click the backdrop to close.</p>
        </div>
      </Drawer>
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: DrawerDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    side: { type: "select", options: ["left", "right", "top", "bottom"], default: "right" },
    title: { type: "text", default: "Filters" },
    size: { type: "number", default: 360, min: 240, max: 720, step: 20 },
  },
  variants: [
    { label: "Right", props: { side: "right" } },
    { label: "Left", props: { side: "left" } },
    { label: "Top", props: { side: "top", size: 240 } },
    { label: "Bottom", props: { side: "bottom", size: 240 } },
  ],
  events: [{ name: "onClose", signature: "() => void" }],
};
