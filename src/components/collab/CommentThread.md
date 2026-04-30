# CommentThread

A nested discussion list with inline reply composer and per-comment
reactions. Use it for review threads, design feedback, or any document
annotation where replies and emoji counts matter. For a flat reaction
strip without comments, use `<ReactionsBar>`.

## Import

```tsx
import {
  CommentThread,
  Comment,
  CommentComposer,
} from "@infinibay/harbor/collab";
```

## Example (recommended composable API)

```tsx
<CommentThread
  currentUser={{ name: "You" }}
  onReply={(parentId, text) => postReply(parentId, text)}
  onReact={(commentId, emoji) => toggleReaction(commentId, emoji)}
>
  <Comment
    id="1"
    author={{ name: "Ana" }}
    time="2h ago"
    reactions={[{ emoji: "👍", count: 3 }]}
  >
    Should we move the CTA above the fold?
    <Comment id="1a" author={{ name: "Bruno" }} time="1h ago">
      Yes — A/B test showed +14% click-through.
    </Comment>
  </Comment>
  <Comment id="2" author={{ name: "Cinto" }} time="30m ago">
    Quick nit: the eyebrow could be larger.
  </Comment>
  <CommentComposer />
</CommentThread>
```

Replies are just nested `<Comment>` children — no `replies` arrays. A
comment's body is everything inside it that isn't another `<Comment>`.

## Subcomponents

- **`<Comment>`** — one node in the thread. Body content is its
  children; nested `<Comment>` children become replies.
- **`<CommentComposer>`** — textarea + submit/cancel. Auto-rendered at
  the bottom when `currentUser` is set and no explicit composer child
  is present. Use it explicitly to control placement, or to add a
  reply composer outside the inline Reply flow.

## Props

### `<CommentThread>`

- **currentUser** — `{ name: string }`. When present, the auto composer
  and per-comment Reply buttons render. Omit to render read-only.
- **onReply** — `(parentId: string | null, text: string) => void`.
  Fires from the root composer with `parentId = null`, and from a
  reply composer with the parent comment's `id`. Trimmed text only;
  empty submissions are blocked.
- **onReact** — `(commentId: string, emoji: string) => void`. Fires
  for both existing reaction chips and the inline `+ React` button
  (which sends `"👍"`).
- **canComment** — `boolean`. Controls the auto-rendered top-level
  "Write a comment…" composer. Defaults to `true` when `currentUser`
  is set. Pass `false` for read-only threads. Note: this only affects
  the auto composer — explicit `<CommentComposer>` children always
  render regardless.
- **canReply** — `boolean`. Show inline "Reply" buttons on each
  `<Comment>`. Default `true`. Pass `false` for flat threads where
  users can react but not reply.
- **className** — extra classes on the root container.

### `<Comment>`

- **id** — `string`. Required. Used for `onReply`/`onReact` callbacks.
- **author** — `{ name: string; avatar?: string }`. Required.
- **time** — `string`. Pre-formatted timestamp shown next to the name.
- **reactions** — `{ emoji, count, mine? }[]`. Optional chip row.
- **children** — body content + optional nested `<Comment>` replies.

### `<CommentComposer>`

- **parentId** — `string | null`. Reply target for `onReply`. Default `null`.
- **placeholder** — `string`. Default `"Write a comment…"`.
- **compact** — `boolean`. Smaller textarea (2 rows vs 3).
- **onCancel** — `() => void`. Renders a Cancel button when provided.
- **onSubmitted** — `() => void`. Fires after a successful submit.

## Notes

- Replies are rendered recursively; the component does not flatten or
  limit depth — cap nesting server-side if you need a maximum.
- The composer keeps text in local state only — wire `onReply` to your
  backend and re-render with the new entry. There is no optimistic insert.
- The inline Reply button on each `<Comment>` is hidden when either
  `onReply` or `currentUser` is missing; reactions remain interactive
  regardless of `currentUser`.
- Submit is disabled until `text.trim()` is non-empty.
