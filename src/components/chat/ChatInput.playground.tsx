import { ChatInput } from "./ChatInput";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ChatInput as never,
  importPath: "@infinibay/harbor/chat",
  controls: {
    placeholder: { type: "text", default: "Type a message…" },
  },
  events: [
    { name: "onSend", signature: "(text: string) => void", description: "Fires on Enter (without Shift)." },
  ],
};
