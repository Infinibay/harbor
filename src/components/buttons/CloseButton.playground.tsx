import { CloseButton } from "./CloseButton";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: CloseButton as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    variant: { type: "select", options: ["ghost", "solid"], default: "ghost" },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Ghost · md", props: { variant: "ghost", size: "md" } },
    { label: "Solid · md", props: { variant: "solid", size: "md" } },
    { label: "Ghost · sm", props: { variant: "ghost", size: "sm" } },
    { label: "Solid · lg", props: { variant: "solid", size: "lg" } },
  ],
  events: [
    { name: "onClick", signature: "(e: MouseEvent) => void", description: "Press the × to fire." },
  ],
};
