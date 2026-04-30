import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./Toolbar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function TBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-7 px-2 rounded-md text-xs text-white/75 hover:bg-white/10 hover:text-white">
      {children}
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolbarDemo(props: any) {
  return (
    <div className="w-full grid place-items-center p-6">
      <Toolbar {...props}>
        <ToolbarGroup>
          <TBtn>Bold</TBtn>
          <TBtn>Italic</TBtn>
          <TBtn>Underline</TBtn>
        </ToolbarGroup>
        <ToolbarSeparator
          orientation={props.orientation === "vertical" ? "horizontal" : "vertical"}
        />
        <ToolbarGroup>
          <TBtn>Link</TBtn>
          <TBtn>Image</TBtn>
        </ToolbarGroup>
        <ToolbarSeparator
          orientation={props.orientation === "vertical" ? "horizontal" : "vertical"}
        />
        <ToolbarGroup>
          <TBtn>Undo</TBtn>
          <TBtn>Redo</TBtn>
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ToolbarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    variant: {
      type: "select",
      options: ["flat", "floating"],
      default: "floating",
    },
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "horizontal",
    },
  },
  variants: [
    { label: "Floating · horizontal", props: { variant: "floating", orientation: "horizontal" } },
    { label: "Flat · horizontal", props: { variant: "flat", orientation: "horizontal" } },
    { label: "Floating · vertical", props: { variant: "floating", orientation: "vertical" } },
  ],
  events: [],
};
