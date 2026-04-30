import { TOC } from "./TOC";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const items = [
  { id: "intro", label: "Introduction", level: 2 },
  { id: "install", label: "Install", level: 2 },
  { id: "props", label: "Props", level: 2 },
  { id: "props-variant", label: "variant", level: 3 },
  { id: "props-size", label: "size", level: 3 },
  { id: "examples", label: "Examples", level: 2 },
  { id: "faq", label: "FAQ", level: 2 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TOCDemo(props: any) {
  return <TOC {...props} items={items} />;
}

export const playground: PlaygroundManifest = {
  component: TOCDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    title: { type: "text", default: "On this page" },
  },
  notes:
    "Pass `items: { id, label, level? }[]` — `id` must match an element on the page. The component uses an IntersectionObserver to highlight the active heading.",
};
