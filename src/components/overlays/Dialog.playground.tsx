import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
} from "./Dialog";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DialogDemo(props: any) {
  const [open, setOpen] = useState(false);
  const align = props.align ?? "end";
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        size={props.size}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
      >
        <DialogTitle>{props.title ?? "Delete project?"}</DialogTitle>
        <DialogDescription>
          {props.description ?? "This action cannot be undone."}
        </DialogDescription>
        <DialogBody>
          {props.children ?? "All members will lose access immediately."}
        </DialogBody>
        <DialogButtons align={align}>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: DialogDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    title: { type: "text", default: "Delete project?" },
    description: { type: "text", default: "This action cannot be undone." },
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    align: { type: "select", options: ["start", "center", "end", "between"], default: "end" },
  },
  variants: [
    { label: "Small", props: { size: "sm" } },
    { label: "Medium", props: { size: "md" } },
    { label: "Large", props: { size: "lg" } },
    { label: "Between (destructive left)", props: { align: "between" } },
  ],
  events: [
    { name: "onClose", signature: "() => void", description: "Backdrop click or Esc." },
  ],
};
