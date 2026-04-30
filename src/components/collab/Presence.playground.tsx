import { Presence } from "./Presence";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const users = [
  { id: "1", name: "Ana", color: "#a855f7" },
  { id: "2", name: "Bruno", color: "#38bdf8" },
  { id: "3", name: "Cinto", color: "#34d399" },
  { id: "4", name: "Diego", color: "#f472b6" },
  { id: "5", name: "Elena", color: "#fbbf24" },
  { id: "6", name: "Felix", color: "#fb7185" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PresenceDemo(props: any) {
  return <Presence {...props} users={users.slice(0, props.userCount ?? users.length)} />;
}

export const playground: PlaygroundManifest = {
  component: PresenceDemo as never,
  importPath: "@infinibay/harbor/collab",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "sm" },
    max: { type: "number", default: 4, min: 1, max: 10 },
    userCount: { type: "number", default: 6, min: 0, max: 6, description: "How many sample users to render." },
  },
  variants: [
    { label: "3 of 3", props: { userCount: 3, max: 4 } },
    { label: "6 of 4", props: { userCount: 6, max: 4 } },
    { label: "Large · 6 of 5", props: { userCount: 6, max: 5, size: "lg" } },
  ],
};
