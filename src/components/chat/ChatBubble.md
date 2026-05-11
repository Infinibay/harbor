# ChatBubble

`ChatBubble` renders one animated chat message. It supports incoming and outgoing alignment,
optional author, avatar, timestamp, delivery status, and reaction pills.

Use it in chat apps, support inboxes, collaborative comments, AI assistants, incident rooms,
and activity conversations. It is the visual message primitive; message lists, grouping,
threading, persistence, and sending state live in the parent.

## Import

```tsx
import { ChatBubble } from "@infinibay/harbor/chat";
```

## Basic Usage

```tsx
<ChatBubble
  from="them"
  author="Ana"
  time="10:42 AM"
  reactions={[{ emoji: "🔥", count: 2 }]}
>
  I pushed the preview build. Can you check the billing flow?
</ChatBubble>
```

## Layout Model

`from="me"` aligns the bubble to the right and reverses avatar placement. `from="them"`
aligns to the left. The bubble has a maximum width of `80%`, so it works inside flexible chat
columns without taking the whole row.

Delivery status renders below the bubble. `sending` shows a spinner, `sent` shows one check,
`delivered` shows two checks, and `read` shows two blue checks. Reactions are absolutely
positioned at the bottom edge of the bubble.

## Props

- **from** - `"me" | "them"`. Controls alignment and color.
- **author** - optional author label.
- **avatar** - optional avatar slot.
- **time** - timestamp text.
- **status** - `"sending" | "sent" | "delivered" | "read"`.
- **reactions** - `{ emoji, count }[]`.
- **children** - message body.
- **className** - extra classes.

## Accessibility

The component renders visual message content and status icons. Make sure the surrounding
message list exposes conversation context, ordering, and live updates when needed. If status
matters to assistive technology, include readable text in the surrounding UI because the
checkmark icons are decorative SVGs without labels.

Use real text for author and time rather than putting that information only in an avatar or
tooltip.

## Gotchas

- Reactions are positioned outside the bubble. Leave vertical space between stacked messages
  when reactions are common.
- `children` can be any React node, but long unbroken text or code should be wrapped by the
  parent to avoid overflow.
- `ChatBubble` does not group consecutive messages from the same author. Do that in the
  message-list layer.
- Timestamps are strings; formatting and locale handling belong to the app.

## Related

- `ChatInput` for message composition.
- `MentionInput` and `EmojiPicker` for richer composers.
- `TypingIndicator` for live conversation state.
- `Avatar` and `Presence` for identity.
