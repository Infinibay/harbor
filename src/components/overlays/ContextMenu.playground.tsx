import { ContextMenu } from "./ContextMenu";
import { MenuItem } from "./Menu";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContextMenuDemo(props: any) {
  return (
    <ContextMenu
      {...props}
      menu={
        <div className="py-1 text-sm w-44">
          {["Cut", "Copy", "Paste", "Delete"].map((l) => (
            <MenuItem key={l} danger={l === "Delete"}>
              {l}
            </MenuItem>
          ))}
        </div>
      }
    >
      <div className="rounded-xl border border-dashed border-[color:var(--harbor-overlay-border)] bg-[var(--harbor-state-hover)] px-10 py-12 text-center text-sm text-[rgb(var(--harbor-text-muted))]">
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
