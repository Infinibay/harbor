import { Aside } from "./Aside";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AsideDemo(props: any) {
  return (
    <Aside {...props} title={props.title ?? "Note"}>
      {props.children ?? "Asides break the page rhythm to call attention. Use sparingly — every aside competes with the main flow."}
    </Aside>
  );
}

export const playground: PlaygroundManifest = {
  component: AsideDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    tone: { type: "select", options: ["note", "info", "warning", "danger", "tip"], default: "note" },
    title: { type: "text", default: "Note" },
  },
  variants: [
    { label: "Note", props: { tone: "note" } },
    { label: "Info", props: { tone: "info", title: "Heads up" } },
    { label: "Warning", props: { tone: "warning", title: "Read carefully" } },
    { label: "Tip", props: { tone: "tip", title: "Pro tip" } },
  ],
};
