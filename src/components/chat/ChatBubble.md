# ChatBubble

A single message in a chat thread, with author, timestamp, delivery status,
and reactions. Mirrors itself for outgoing (`from="me"`) vs incoming
(`from="them"`) messages.

## Import

```tsx
import { ChatBubble } from "@infinibay/harbor/chat";
```

## Example

```tsx
<ChatBubble
  from="them"
  author="Ana"
  time="10:42 AM"
  reactions={[{ emoji: "🔥", count: 2 }]}
>
  Hey, did you see the new launch announcement?
</ChatBubble>

<ChatBubble from="me" time="10:43 AM" status="read">
  On it now.
</ChatBubble>
```

## Props

- **from** — `"me" | "them"`. Required. Drives side, color, and tail corner.
- **children** — `ReactNode`. Required. Message body.
- **author** — `string`. Name shown above the bubble.
- **avatar** — `ReactNode`. Rendered next to the bubble (flipped to the other side when `from="me"`).
- **time** — `string`. Timestamp label under the bubble.
- **status** — `"sending" | "sent" | "delivered" | "read"`. Renders a spinner or check glyphs after the time. `"read"` checks render in blue.
- **reactions** — `{ emoji: string; count: number }[]`. Pill row anchored to the bottom corner of the bubble.
- **className** — extra classes on the outer wrapper.

## Notes

- Animates in via `framer-motion` `layout` + spring; place inside an animated list for smooth insertion.
- `me` bubbles use a fuchsia→indigo gradient; `them` bubbles use a translucent surface.
- Width is capped at `max-w-[80%]`; the bubble auto-aligns left/right from `from`.
- Pair with `<TypingIndicator>` for the "is typing…" state and `<ChatInput>` to author new messages.
