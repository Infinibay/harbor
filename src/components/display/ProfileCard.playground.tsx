import { ProfileCard } from "./ProfileCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ProfileCard as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    name: { type: "text", default: "Ana Pérez" },
    handle: { type: "text", default: "ana" },
    role: { type: "text", default: "Engineer · Infrastructure" },
    bio: { type: "text", default: "Builds the things that build the things." },
    status: { type: "select", options: ["online", "away", "busy", "offline"], default: "online" },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Busy", props: { status: "busy" } },
    { label: "No bio", props: { bio: "" } },
  ],
};
