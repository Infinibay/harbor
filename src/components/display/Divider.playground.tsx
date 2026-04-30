import { Divider } from "./Divider";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DividerDemo(props: any) {
  return (
    <div className="w-80 space-y-4">
      <p className="text-sm text-white/60">Above the divider.</p>
      <Divider>{props.label || undefined}</Divider>
      <p className="text-sm text-white/60">Below the divider.</p>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: DividerDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    label: { type: "text", default: "", description: "Optional label rendered between two gradient bars. Empty = plain rule." },
  },
  variants: [
    { label: "Plain", props: { label: "" } },
    { label: "Labelled", props: { label: "OR" } },
  ],
};
