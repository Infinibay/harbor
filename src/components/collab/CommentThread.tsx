import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";

/* ------------------------------------------------------------------ *
 *  CommentThread — composable.
 *
 *    <CommentThread currentUser={me} onReply={...} onReact={...}>
 *      <Comment id="1" author={ana} time="2h ago" reactions={[…]}>
 *        Should we move the CTA above the fold?
 *        <Comment id="1a" author={bruno} time="1h ago">
 *          Yes — A/B test showed +14% click-through.
 *        </Comment>
 *      </Comment>
 *      <Comment id="2" author={cinto} time="30m ago">
 *        Quick nit: the eyebrow could be larger.
 *      </Comment>
 *      <CommentComposer />
 *    </CommentThread>
 *
 *  Replies are just nested <Comment> children. The body of a comment
 *  is everything inside it that isn't another <Comment>.
 * ------------------------------------------------------------------ */

export interface CommentReaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

export interface CommentThreadProps {
  currentUser?: { name: string };
  onReply?: (parentId: string | null, text: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  /** Show the top-level "Write a comment…" composer. Defaults to `true`
   *  when `currentUser` is set. Pass `false` to hide it (e.g. read-only
   *  threads, or when you render your own composer elsewhere). */
  canComment?: boolean;
  /** Show inline "Reply" buttons on each `<Comment>`. Defaults to
   *  `true`. Pass `false` for flat threads where users can react but
   *  not reply. */
  canReply?: boolean;
  className?: string;
  children?: ReactNode;
}

type Ctx = {
  currentUser?: { name: string };
  onReply?: (parentId: string | null, text: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  canReply: boolean;
};

const ThreadCtx = createContext<Ctx | null>(null);

function useThreadCtx(component: string): Ctx {
  const ctx = useContext(ThreadCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <CommentThread>.`);
  }
  return ctx;
}

export function CommentThread({
  currentUser,
  onReply,
  onReact,
  canComment,
  canReply = true,
  className,
  children,
}: CommentThreadProps) {
  const composerEnabled = canComment ?? Boolean(currentUser);
  const showAutoComposer =
    composerEnabled && currentUser && !hasComposerChild(children);

  return (
    <ThreadCtx.Provider
      value={{ currentUser, onReply, onReact, canReply }}
    >
      <div className={cn("flex flex-col gap-4", className)}>
        {children}
        {showAutoComposer ? <CommentComposer /> : null}
      </div>
    </ThreadCtx.Provider>
  );
}

export interface CommentProps {
  id: string;
  author: { name: string; avatar?: string };
  time: string;
  reactions?: CommentReaction[];
  children?: ReactNode;
  className?: string;
}

export function Comment({
  id,
  author,
  time,
  reactions,
  children,
  className,
}: CommentProps) {
  const { currentUser, onReply, onReact, canReply } = useThreadCtx("Comment");
  const [replying, setReplying] = useState(false);

  // Split children into nested replies (other <Comment>s) and body.
  const { body, replies } = splitChildren(children);

  return (
    <div className={cn("flex gap-2.5", className)}>
      <Avatar name={author.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{author.name}</span>
          <span className="text-[11px] text-white/40">{time}</span>
        </div>
        <div className="text-sm text-white/80 mt-0.5 whitespace-pre-wrap break-words">
          {body}
        </div>

        <div className="mt-1.5 flex items-center gap-1 flex-wrap">
          {reactions?.map((r) => (
            <button
              key={r.emoji}
              onClick={() => onReact?.(id, r.emoji)}
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
            onClick={() => onReact?.(id, "👍")}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs text-white/40 hover:text-white/70 hover:bg-white/5"
          >
            + React
          </button>
          {canReply && onReply && currentUser ? (
            <button
              onClick={() => setReplying((r) => !r)}
              className="text-xs text-white/45 hover:text-white/80 px-1.5 py-0.5 rounded hover:bg-white/5"
            >
              Reply
            </button>
          ) : null}
        </div>

        {replying ? (
          <CommentComposer
            placeholder={`Reply to ${author.name}…`}
            parentId={id}
            compact
            onCancel={() => setReplying(false)}
            onSubmitted={() => setReplying(false)}
          />
        ) : null}

        {replies.length ? (
          <div className="mt-3 flex flex-col gap-3 pl-4 border-l border-white/5 ml-3">
            {replies}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export interface CommentComposerProps {
  /** Reply target. `null`/undefined means top-level. */
  parentId?: string | null;
  placeholder?: string;
  compact?: boolean;
  onCancel?: () => void;
  /** Fires after a successful submit (after onReply is called). */
  onSubmitted?: () => void;
  className?: string;
}

export function CommentComposer({
  parentId = null,
  placeholder = "Write a comment…",
  compact,
  onCancel,
  onSubmitted,
  className,
}: CommentComposerProps) {
  const { onReply } = useThreadCtx("CommentComposer");
  const [text, setText] = useState("");

  return (
    <div className={cn("mt-2 flex flex-col gap-2", className)}>
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
            const t = text.trim();
            if (!t) return;
            onReply?.(parentId, t);
            setText("");
            onSubmitted?.();
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

/* ------------------------------ helpers ------------------------------ */

function splitChildren(children: ReactNode): {
  body: ReactNode[];
  replies: ReactElement[];
} {
  const body: ReactNode[] = [];
  const replies: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Comment) {
      replies.push(child);
    } else {
      body.push(child);
    }
  });
  return { body, replies };
}

function hasComposerChild(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === CommentComposer) {
      found = true;
    }
  });
  return found;
}

