import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { Presence } from "../../components";
import { CommentThread, type Comment } from "../../components";
import { ReactionsBar, type Reaction } from "../../components";
import { MentionInput, type MentionUser } from "../../components";

const people = [
  { id: "a", name: "Ana Fernández", status: "editing" as const },
  { id: "b", name: "Leo Park", status: "viewing" as const },
  { id: "c", name: "Maya Singh", status: "viewing" as const },
  { id: "d", name: "Ivan Kim", status: "idle" as const },
  { id: "e", name: "Sofia Cruz", status: "viewing" as const },
  { id: "f", name: "Theo Grant" },
];

const initialComments: Comment[] = [
  {
    id: "c1",
    author: { name: "Ana Fernández" },
    body: "Starting the migration tomorrow morning. Anyone wants to pair on the rollback path?",
    time: "10:04",
    reactions: [
      { emoji: "👀", count: 3, mine: true },
      { emoji: "🎉", count: 1 },
    ],
    replies: [
      {
        id: "c1-r1",
        author: { name: "Leo Park" },
        body: "I'm in. Let's do 9am EU time.",
        time: "10:12",
        reactions: [{ emoji: "👍", count: 2 }],
      },
    ],
  },
  {
    id: "c2",
    author: { name: "Maya Singh" },
    body: "Just landed the new index; read latency dropped 40%. 🚀",
    time: "11:22",
    reactions: [{ emoji: "🔥", count: 4 }, { emoji: "🚀", count: 2 }],
  },
];

const mentionUsers: MentionUser[] = [
  { id: "a", name: "Ana Fernández", handle: "ana" },
  { id: "b", name: "Leo Park", handle: "leo" },
  { id: "c", name: "Maya Singh", handle: "maya" },
  { id: "d", name: "Ivan Kim", handle: "ivan" },
];

export function CollabPage() {
  const [comments, setComments] = useState(initialComments);
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "👍", count: 12, mine: true },
    { emoji: "❤️", count: 8 },
    { emoji: "🔥", count: 5 },
  ]);
  const [mentionText, setMentionText] = useState("Hey @ana — can you review this?");

  function handleReact(commentId: string, emoji: string) {
    setComments((all) => toggleReact(all, commentId, emoji));
  }

  function handleReply(parentId: string | null, text: string) {
    const newC: Comment = {
      id: `c-${Date.now()}`,
      author: { name: "Andrés" },
      body: text,
      time: "now",
    };
    if (!parentId) {
      setComments((cs) => [...cs, newC]);
    } else {
      setComments((cs) => addReplyTo(cs, parentId, newC));
    }
  }

  function toggleBarReaction(emoji: string) {
    setReactions((rs) => {
      const existing = rs.find((r) => r.emoji === emoji);
      if (!existing) return [...rs, { emoji, count: 1, mine: true }];
      if (existing.mine) {
        const next = existing.count - 1;
        if (next <= 0) return rs.filter((r) => r.emoji !== emoji);
        return rs.map((r) => (r.emoji === emoji ? { ...r, count: next, mine: false } : r));
      }
      return rs.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r));
    });
  }

  return (
    <Group id="collab" title="Collab · social" desc="Presence, comments, reactions, mentions — para docs, code review, issues.">
      <Demo title="Presence" hint="Quién está viendo / editando." wide intensity="soft">
        <Col>
          <Presence users={people} />
          <div className="text-xs text-white/40">
            El punto rosa sobre el avatar indica que alguien está editando.
          </div>
        </Col>
      </Demo>

      <Demo title="Reactions bar" wide intensity="soft">
        <ReactionsBar reactions={reactions} onToggle={toggleBarReaction} />
      </Demo>

      <Demo title="Comment thread con replies anidados" wide intensity="soft">
        <CommentThread
          comments={comments}
          currentUser={{ name: "Andrés" }}
          onReply={handleReply}
          onReact={handleReact}
        />
      </Demo>

      <Demo title="Mention input" hint="Tipeá @ para sugerencias." wide intensity="soft">
        <Col>
          <MentionInput
            users={mentionUsers}
            value={mentionText}
            onChange={setMentionText}
            placeholder="Write a comment (try @ for mentions)"
          />
          <div className="text-xs text-white/50">
            Preview:{" "}
            <span className="font-mono text-white/75">{mentionText || "…"}</span>
          </div>
        </Col>
      </Demo>
    </Group>
  );
}

function toggleReact(list: Comment[], id: string, emoji: string): Comment[] {
  return list.map((c) => {
    if (c.id === id) {
      const existing = c.reactions?.find((r) => r.emoji === emoji);
      let reactions = c.reactions ? [...c.reactions] : [];
      if (!existing) {
        reactions.push({ emoji, count: 1, mine: true });
      } else if (existing.mine) {
        const count = existing.count - 1;
        reactions = count <= 0
          ? reactions.filter((r) => r.emoji !== emoji)
          : reactions.map((r) => (r.emoji === emoji ? { ...r, count, mine: false } : r));
      } else {
        reactions = reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
        );
      }
      return { ...c, reactions };
    }
    if (c.replies?.length) {
      return { ...c, replies: toggleReact(c.replies, id, emoji) };
    }
    return c;
  });
}

function addReplyTo(list: Comment[], parentId: string, reply: Comment): Comment[] {
  return list.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), reply] };
    }
    if (c.replies?.length) {
      return { ...c, replies: addReplyTo(c.replies, parentId, reply) };
    }
    return c;
  });
}
