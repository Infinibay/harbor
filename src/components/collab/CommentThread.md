# CommentThread

`CommentThread` renders product-grade discussion UI: comments, nested replies, reactions, and composers. It is useful for review tools, dashboards with annotations, support cases, document collaboration, design feedback, and admin notes.

You can pass a `comments` array for data-driven rendering, or compose `Comment` and `CommentComposer` manually when a thread needs custom layout or interleaved content.

## Import

```tsx
import {
  CommentThread,
  Comment,
  CommentComposer,
  type CommentData,
} from "@infinibay/harbor/collab";
```

## Basic Usage

```tsx
<CommentThread
  currentUser={{ name: "Ana Ramos" }}
  onReply={(parentId, text) => saveReply({ parentId, text })}
  onReact={(commentId, emoji) => toggleReaction(commentId, emoji)}
>
  <Comment
    id="c1"
    author={{ name: "Mila Chen" }}
    time="12 min ago"
    reactions={[{ emoji: "👍", count: 3, mine: true }]}
  >
    The empty state should explain what the user can do next.
    <Comment id="c1-r1" author={{ name: "Leo Silva" }} time="8 min ago">
      Agreed. I added a shorter version in the latest build.
    </Comment>
  </Comment>
</CommentThread>
```

## Data Driven Usage

```tsx
<CommentThread
  comments={comments}
  currentUser={me}
  onReply={handleReply}
  onReact={handleReaction}
/>
```

When `currentUser` is present, the thread renders a top-level composer unless `canComment={false}` or you provide your own `CommentComposer`.

## Props

`CommentThread` accepts `comments`, `currentUser`, `onReply`, `onReact`, `canComment`, `canReply`, `className`, and `children`.

`Comment` accepts `id`, `author`, `time`, `reactions`, `children`, and `className`.

`CommentComposer` accepts `parentId`, `placeholder`, `compact`, `onCancel`, `onSubmitted`, and `className`.

## Accessibility

Reaction buttons expose pressed state when the current user has reacted. Reply buttons expose expansion state while the inline composer is open. Keep reaction emoji meaningful in your product context and avoid using comments as the only place for critical system status.

## Gotchas

Nested replies are detected by checking for child `Comment` elements. If you wrap replies in another component, use the data-driven `comments` prop instead.

## Related

Use with `Presence`, `Avatar`, `NotificationBell`, `ActivityFeed`, `Drawer`, and `Callout`.
