import { TypingIndicator } from "./TypingIndicator";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: TypingIndicator as never,
  importPath: "@infinibay/harbor/chat",
  controls: {
    name: { type: "text", default: "Ana" },
  },
  variants: [
    { label: "Anonymous", props: { name: "" } },
    { label: "With name", props: { name: "Ana" } },
  ],
};
