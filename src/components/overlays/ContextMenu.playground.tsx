import { ContextMenu } from "./ContextMenu";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContextMenuDemo(props: any) {
  return (
    <ContextMenu
      {...props}
      menu={
        <div className="py-1 text-sm w-44">
          {["Cut", "Copy", "Paste", "Delete"].map((l) => (
            <button
              key={l}
              type="button"
              className="block w-full text-left px-3 py-1.5 text-white/80 hover:bg-white/5 hover:text-white"
            >
              {l}
            </button>
          ))}
        </div>
      }
    >
      <div className="rounded-xl border border-dashed border-white/15 px-10 py-12 text-center text-sm text-white/60">
        Right-click anywhere inside this box.
      </div>
    </ContextMenu>
  );
}

export const playground: PlaygroundManifest = {
  component: ContextMenuDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {},
  notes: "Wraps any region. The `menu` prop is whatever you'd put inside a regular dropdown.",
};
