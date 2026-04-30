import { LinkPreviewCard } from "./LinkPreviewCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LinkPreviewCardDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 540 }}>
      <LinkPreviewCard {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: LinkPreviewCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    url: { type: "text", default: "https://infinibay.com/blog/harbor-shipping" },
    title: { type: "text", default: "How we shipped a 120-component library in two months" },
    description: { type: "text", default: "A retrospective on velocity, design tokens, and saying no to features." },
    image: { type: "text", default: "/picture.png" },
    favicon: { type: "text", default: "" },
    siteName: { type: "text", default: "Infinibay Blog" },
  },
  variants: [
    { label: "With image", props: {} },
    { label: "No image", props: { image: "" } },
  ],
};
