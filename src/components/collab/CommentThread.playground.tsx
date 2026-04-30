import { CommentThread } from "./CommentThread";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const sampleComments = [
  {
    id: "1",
    author: { name: "Ana" },
    body: "Should we move the CTA above the fold?",
    at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    replies: [
      { id: "1a", author: { name: "Bruno" }, body: "Yes — A/B test showed +14% click-through.", at: new Date(Date.now() - 1000 * 60 * 60) },
    ],
  },
  {
    id: "2",
    author: { name: "Cinto" },
    body: "Quick nit: the eyebrow could be larger.",
    at: new Date(Date.now() - 1000 * 60 * 30),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommentThreadDemo(props: any) {
  return (
    <CommentThread
      {...props}
      comments={sampleComments}
      currentUser={{ name: "You" }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: CommentThreadDemo as never,
  importPath: "@infinibay/harbor/collab",
  controls: {},
  events: [
    { name: "onReply", signature: "(parentId: string | null, text: string) => void" },
    { name: "onReact", signature: "(commentId: string, emoji: string) => void" },
  ],
};
