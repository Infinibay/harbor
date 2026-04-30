import { Presence, PresenceUser } from "./Presence";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PresenceDemo(props: any) {
  return (
    <Presence {...props}>
      <PresenceUser name="Ana" status="editing" />
      <PresenceUser name="Bruno" status="viewing" />
      <PresenceUser name="Cinto" status="idle" />
      <PresenceUser name="Diego" />
      <PresenceUser name="Elena" />
      <PresenceUser name="Felix" />
    </Presence>
  );
}

export const playground: PlaygroundManifest = {
  component: PresenceDemo as never,
  importPath: "@infinibay/harbor/collab",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "sm" },
    max: { type: "number", default: 4, min: 1, max: 10 },
  },
  variants: [
    { label: "Default · max 4", props: { max: 4 } },
    { label: "Show all", props: { max: 10 } },
    { label: "Large · max 5", props: { max: 5, size: "lg" } },
  ],
};
