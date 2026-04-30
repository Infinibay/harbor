import { CommentThread, Comment } from "./CommentThread";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const ana = { name: "Ana" };
const bruno = { name: "Bruno" };
const cinto = { name: "Cinto" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommentThreadDemo(props: any) {
  return (
    <CommentThread {...props} currentUser={{ name: "You" }}>
      <Comment
        id="1"
        author={ana}
        time="2h ago"
        reactions={[{ emoji: "👍", count: 4 }]}
      >
        Should we move the CTA above the fold?
        <Comment id="1a" author={bruno} time="1h ago">
          Yes — A/B test showed +14% click-through.
        </Comment>
      </Comment>
      <Comment
        id="2"
        author={cinto}
        time="30m ago"
        reactions={[{ emoji: "🎉", count: 2, mine: true }]}
      >
        Quick nit: the eyebrow could be larger.
      </Comment>
    </CommentThread>
  );
}

export const playground: PlaygroundManifest = {
  component: CommentThreadDemo as never,
  importPath: "@infinibay/harbor/collab",
  controls: {
    canComment: { type: "boolean", default: true },
    canReply: { type: "boolean", default: true },
  },
  variants: [
    { label: "Full (comment + reply)", props: { canComment: true, canReply: true } },
    { label: "Read-only", props: { canComment: false, canReply: false } },
    { label: "Reply only", props: { canComment: false, canReply: true } },
    { label: "Flat (top-level only)", props: { canComment: true, canReply: false } },
  ],
  events: [
    { name: "onReply", signature: "(parentId: string | null, text: string) => void" },
    { name: "onReact", signature: "(commentId: string, emoji: string) => void" },
  ],
};
