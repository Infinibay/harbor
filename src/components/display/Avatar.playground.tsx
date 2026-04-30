import { Avatar } from "./Avatar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: Avatar as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    name: { type: "text", default: "Ana Pérez" },
    src: { type: "text", default: "" },
    size: { type: "select", options: ["sm", "md", "lg", "xl"], default: "md" },
    status: { type: "select", options: ["online", "away", "busy", "offline"], default: "online" },
    interactive: { type: "boolean", default: true, description: "Enable cursor-reactive lean." },
  },
  variants: [
    { label: "Initials", props: { src: "", name: "Ana Pérez" } },
    { label: "With image", props: { src: "https://i.pravatar.cc/150?img=12" } },
    { label: "Busy", props: { status: "busy" } },
    { label: "Offline", props: { status: "offline" } },
    { label: "Large", props: { size: "xl" } },
  ],
};
