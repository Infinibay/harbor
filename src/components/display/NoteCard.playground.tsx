import { NoteCard } from "./NoteCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: NoteCard as never,
  importPath: "@infinibay/harbor/display",
  defaultChildren: "Don't ship before testing the email flow on Safari.",
  controls: {
    title: { type: "text", default: "Reminder" },
    color: { type: "select", options: ["yellow", "pink", "sky", "green", "purple"], default: "yellow" },
    author: { type: "text", default: "Ana" },
    date: { type: "text", default: "Apr 28" },
    tilt: { type: "number", default: -2, min: -8, max: 8, step: 0.5, description: "Degrees of rotation." },
  },
  variants: [
    { label: "Yellow", props: { color: "yellow" } },
    { label: "Pink", props: { color: "pink" } },
    { label: "Straight", props: { tilt: 0 } },
  ],
};
