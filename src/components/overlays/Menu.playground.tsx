import { Menu } from "./Menu";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MenuDemo(props: any) {
  return (
    <Menu
      {...props}
      trigger={<Button variant="secondary">Open menu ▾</Button>}
    >
      <div className="py-1 text-sm w-44">
        {["Open", "Rename", "Duplicate", "Move to…", "Delete"].map((label) => (
          <button
            key={label}
            type="button"
            className="block w-full text-left px-3 py-1.5 text-white/80 hover:bg-white/5 hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </Menu>
  );
}

export const playground: PlaygroundManifest = {
  component: MenuDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    side: { type: "select", options: ["bottom", "right"], default: "bottom" },
    align: { type: "select", options: ["start", "end"], default: "start" },
  },
  variants: [
    { label: "Bottom · start", props: { side: "bottom", align: "start" } },
    { label: "Bottom · end", props: { side: "bottom", align: "end" } },
    { label: "Right · start", props: { side: "right", align: "start" } },
  ],
};
