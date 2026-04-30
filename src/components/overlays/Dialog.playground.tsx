import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DialogDemo(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
        title={props.title ?? "Delete project?"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        {props.children ?? "This action cannot be undone. Are you sure you want to continue?"}
      </Dialog>
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: DialogDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    title: { type: "text", default: "Delete project?" },
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    footerAlign: { type: "select", options: ["start", "center", "end", "between"], default: "end" },
  },
  variants: [
    { label: "Small", props: { size: "sm" } },
    { label: "Medium", props: { size: "md" } },
    { label: "Large", props: { size: "lg" } },
  ],
  events: [
    { name: "onClose", signature: "() => void", description: "Backdrop click or Esc." },
  ],
};
