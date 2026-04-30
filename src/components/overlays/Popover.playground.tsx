import { Popover } from "./Popover";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PopoverDemo(props: any) {
  return (
    <Popover
      {...props}
      content={
        <div className="p-3 text-sm">
          <div className="font-medium mb-1">Quick actions</div>
          <div className="text-white/60">Click anywhere outside to dismiss.</div>
        </div>
      }
    >
      <Button variant="secondary">Open popover</Button>
    </Popover>
  );
}

export const playground: PlaygroundManifest = {
  component: PopoverDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    side: { type: "select", options: ["top", "bottom", "left", "right"], default: "bottom" },
    align: { type: "select", options: ["start", "center", "end"], default: "center" },
  },
  variants: [
    { label: "Bottom · center", props: { side: "bottom", align: "center" } },
    { label: "Top · start", props: { side: "top", align: "start" } },
    { label: "Right · end", props: { side: "right", align: "end" } },
  ],
};
