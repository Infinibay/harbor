import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";

export interface CommentReaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

export interface Comment {
  id: string;
  author: { name: string; avatar?: string };
  body: ReactNode;
  time: string;
  reactions?: CommentReaction[];
  replies?: Comment[];
}

export interface CommentThreadProps {
  comments: Comment[];
  currentUser?: { name: string };
  onReply?: (parentId: string | null, text: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  className?: string;
}

export function CommentThread({
  comments,
  currentUser,
  onReply,
  onReact,
  className,
}: CommentThreadProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {comments.map((c) => (
        <CommentNode
          key={c.id}
          comment={c}
          depth={0}
          onReply={onReply}
          onReact={onReact}
          currentUser={currentUser}
        />
      ))}
      {currentUser ? (
        <Composer
          onSubmit={(text) => onReply?.(null, text)}
          placeholder="Write a comment…"
        />
      ) : null}
    </div>
  );
}

function CommentNode({
  comment,
  depth,
  onReply,
  onReact,
  currentUser,
}: {
  comment: Comment;
  depth: number;
  onReply?: (parentId: string | null, text: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  currentUser?: { name: string };
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className={cn("flex gap-2.5", depth > 0 && "pl-4 border-l border-white/5 ml-3")}>
      <Avatar name={comment.author.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{comment.author.name}</span>
          <span className="text-[11px] text-white/40">{comment.time}</span>
        </div>
        <div className="text-sm text-white/80 mt-0.5 whitespace-pre-wrap break-words">
          {comment.body}
        </div>

        <div className="mt-1.5 flex items-center gap-1 flex-wrap">
          {comment.reactions?.map((r) => (
            <button
              key={r.emoji}
              onClick={() => onReact?.(comment.id, r.emoji)}
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border",
                r.mine
                  ? "bg-fuchsia-500/15 border-fuchsia-400/40 text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
              )}
            >
              <span>{r.emoji}</span>
              <span className="font-mono tabular-nums">{r.count}</span>
            </button>
          ))}
          <button
            onClick={() => onReact?.(comment.id, "👍")}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs text-white/40 hover:text-white/70 hover:bg-white/5"
          >
            + React
          </button>
          {onReply && currentUser ? (
            <button
              onClick={() => setReplying((r) => !r)}
              className="text-xs text-white/45 hover:text-white/80 px-1.5 py-0.5 rounded hover:bg-white/5"
            >
              Reply
            </button>
          ) : null}
        </div>

        {replying ? (
          <Composer
            onSubmit={(text) => {
              onReply?.(comment.id, text);
              setReplying(false);
            }}
            onCancel={() => setReplying(false)}
            placeholder={`Reply to ${comment.author.name}…`}
            compact
          />
        ) : null}

        {comment.replies?.length ? (
          <div className="mt-3 flex flex-col gap-3">
            {comment.replies.map((child) => (
              <CommentNode
                key={child.id}
                comment={child}
                depth={depth + 1}
                onReply={onReply}
                onReact={onReact}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Composer({
  onSubmit,
  onCancel,
  placeholder,
  compact,
}: {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder: string;
  compact?: boolean;
}) {
  const [text, setText] = useState("");
  return (
    <div className={cn("mt-2 flex flex-col gap-2", compact && "mt-2")}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="w-full resize-none rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-fuchsia-400/60"
      />
      <div className="flex gap-2 justify-end">
        {onCancel ? (
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5"
          >
            Cancel
          </button>
        ) : null}
        <button
          onClick={() => {
            if (text.trim()) {
              onSubmit(text.trim());
              setText("");
            }
          }}
          disabled={!text.trim()}
          className="text-xs px-3 py-1.5 rounded bg-fuchsia-500/80 hover:bg-fuchsia-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  );
}
