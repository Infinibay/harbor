import { EmojiPicker } from "./EmojiPicker";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: EmojiPicker as never,
  importPath: "@infinibay/harbor/chat",
  controls: {},
  events: [
    { name: "onPick", signature: "(emoji: string) => void", description: "Fires when the user picks an emoji." },
  ],
};
