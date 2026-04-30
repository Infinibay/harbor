import { useState } from "react";
import { Callout } from "./Callout";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CalloutDemo(props: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative min-h-[260px] flex items-center justify-center">
      <button
        id="callout-playground-target"
        className="px-4 py-2 rounded-md bg-fuchsia-500/80 text-white text-sm font-medium"
        onClick={() => setOpen(true)}
      >
        New VM
      </button>
      <Callout
        {...props}
        target="#callout-playground-target"
        open={open}
        onClose={() => setOpen(false)}
        onNext={
          props.total
            ? () => {
                if ((props.step ?? 1) >= (props.total ?? 1)) setOpen(false);
              }
            : undefined
        }
        title={props.title ?? "Spin up your first VM"}
      >
        {props.children ?? "Click here to start. We'll walk through templates next."}
      </Callout>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CalloutDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    placement: {
      type: "select",
      options: ["top", "bottom", "left", "right"],
      default: "bottom",
    },
    title: { type: "text", default: "Spin up your first VM" },
    step: { type: "number", default: 1 },
    total: { type: "number", default: 3 },
  },
  variants: [
    { label: "Bottom", props: { placement: "bottom" } },
    { label: "Top", props: { placement: "top" } },
    { label: "Right", props: { placement: "right" } },
    {
      label: "Tour step",
      props: { placement: "bottom", step: 2, total: 3 },
      description: "Step indicator + Next/Back buttons.",
    },
  ],
  events: [
    { name: "onClose", signature: "() => void", description: "Backdrop click or Escape." },
    { name: "onNext", signature: "() => void" },
    { name: "onPrev", signature: "() => void" },
  ],
  notes:
    "The spotlight cuts a hole around `target`. Click outside the highlighted button to dismiss.",
};
