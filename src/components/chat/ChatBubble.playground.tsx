import { ChatBubble } from "./ChatBubble";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ChatBubble as never,
  importPath: "@infinibay/harbor/chat",
  defaultChildren: "Hey, did you see the new launch announcement?",
  controls: {
    from: { type: "select", options: ["me", "them"], default: "them" },
    author: { type: "text", default: "Ana" },
    time: { type: "text", default: "10:42 AM" },
    status: { type: "select", options: ["sending", "sent", "delivered", "read"], default: "delivered" },
  },
  variants: [
    { label: "Them", props: { from: "them", author: "Ana" } },
    { label: "Me · sent", props: { from: "me", author: "", status: "sent" } },
    { label: "Me · read", props: { from: "me", author: "", status: "read" } },
  ],
};
