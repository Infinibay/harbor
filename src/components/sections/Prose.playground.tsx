import { Prose } from "./Prose";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProseDemo(props: any) {
  return (
    <Prose {...props}>
      <h2>The point of Prose</h2>
      <p>
        Prose constrains line-length so prose-heavy regions feel calm. Use it
        for blog posts, changelogs, and any page where the user is reading
        rather than scanning.
      </p>
      <p>
        It does <em>not</em> reset typography for child components — only for
        the natural HTML elements. Mix and match freely.
      </p>
      <ul>
        <li>One bullet</li>
        <li>Another bullet</li>
        <li>Final bullet</li>
      </ul>
    </Prose>
  );
}

export const playground: PlaygroundManifest = {
  component: ProseDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
  },
  variants: [
    { label: "Small", props: { size: "sm" } },
    { label: "Medium", props: { size: "md" } },
    { label: "Large", props: { size: "lg" } },
  ],
};
