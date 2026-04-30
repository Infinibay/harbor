import { ArticleCard } from "./ArticleCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ArticleCard as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "How we shipped a 120-component library in two months" },
    excerpt: { type: "text", default: "A retrospective on velocity, design tokens, and saying no to features." },
    cover: { type: "text", default: "/picture.png" },
    href: { type: "text", default: "#" },
    date: { type: "text", default: "Apr 28, 2026" },
    readTime: { type: "text", default: "6 min read" },
    layout: { type: "select", options: ["stacked", "horizontal"], default: "stacked" },
  },
  variants: [
    { label: "Stacked", props: { layout: "stacked" } },
    { label: "Horizontal", props: { layout: "horizontal" } },
  ],
  events: [{ name: "onClick", signature: "() => void" }],
};
