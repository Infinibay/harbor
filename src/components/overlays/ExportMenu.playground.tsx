import { ExportMenu } from "./ExportMenu";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ExportMenu as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    label: { type: "text", default: "Export" },
  },
  variants: [
    { label: "All formats", props: { label: "Export" } },
  ],
  events: [
    { name: "onExport", signature: "(opts: ExportOptions) => void", description: "Fires when the user confirms; you do the actual serialization." },
  ],
};
