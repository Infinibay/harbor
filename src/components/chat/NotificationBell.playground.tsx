import { NotificationBell } from "./NotificationBell";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const samples = [
  { id: "1", title: "Ana commented on PR #421", at: new Date(Date.now() - 1000 * 60 * 5), read: false },
  { id: "2", title: "Build #884 succeeded", at: new Date(Date.now() - 1000 * 60 * 60), read: false },
  { id: "3", title: "Daily digest available", at: new Date(Date.now() - 1000 * 60 * 60 * 5), read: true },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NotificationBellDemo(props: any) {
  return <NotificationBell {...props} notifications={samples} />;
}

export const playground: PlaygroundManifest = {
  component: NotificationBellDemo as never,
  importPath: "@infinibay/harbor/chat",
  controls: {},
  events: [
    { name: "onRead", signature: "(id: string) => void" },
    { name: "onReadAll", signature: "() => void" },
  ],
};
