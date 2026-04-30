import { Expandable } from "./Expandable";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExpandableDemo(props: any) {
  return (
    <Expandable
      collapsed={
        <button className="px-3 h-9 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
          + Add note
        </button>
      }
      expanded={
        <textarea
          autoFocus
          placeholder="Type and press Esc to close..."
          className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none resize-none"
        />
      }
      {...props}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: ExpandableDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    expandOn: { type: "select", options: ["click", "focus"], default: "click" },
    closeOnEscape: { type: "boolean", default: true },
    closeOnBlur: { type: "boolean", default: true, description: "Close on outside click." },
    defaultOpen: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Open by default", props: { defaultOpen: true } },
    { label: "Persistent (no blur close)", props: { closeOnBlur: false, closeOnEscape: false } },
  ],
  events: [{ name: "onOpenChange", signature: "(v: boolean) => void" }],
  notes: "Click the trigger to morph into the expanded surface. Esc or click outside collapses.",
};
