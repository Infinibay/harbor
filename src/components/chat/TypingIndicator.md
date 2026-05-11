# TypingIndicator

`TypingIndicator` shows that a person, assistant, or agent is composing a message. Use it in chat, support inboxes, collaboration comments, AI assistants, and activity streams where realtime feedback prevents the conversation from feeling stalled.

The component renders a compact chat bubble with optional name and three animated dots. It is visual state; your app decides when someone is typing and when to remove the indicator.

## Import

```tsx
import { TypingIndicator } from "@infinibay/harbor/chat";
```

## Basic Usage

```tsx
<AnimatePresence>
  {isTyping ? (
    <TypingIndicator name="Ana" />
  ) : null}
</AnimatePresence>
```

Use it without a name when the surrounding thread already identifies the participant:

```tsx
<TypingIndicator />
```

## Props

- **name** - optional string rendered before the animated dots.
- **className** - optional string merged onto the root element.

## State Model

`TypingIndicator` does not subscribe to presence, debounce keystrokes, or time itself out. The parent should derive `isTyping` from websocket events, local draft state, or assistant generation state. For human typing events, clear the indicator after a short idle timeout so it does not remain visible forever.

For assistant responses, show the indicator while the request is pending or while streamed tokens have not started yet. Once content begins streaming, replace it with the actual message.

## Accessibility

Avoid announcing every typing pulse. If the indicator appears in a chat log, the surrounding message list should already have an appropriate live region strategy. The visible name helps sighted users understand who is typing; screen reader users may need a higher-level announcement such as `"Ana is typing"` when the state first appears.

## Gotchas

- Do not leave the indicator mounted after a send failure. Show an error or retry action instead.
- Avoid showing many typing indicators at once; combine names if multiple people are typing.
- The dots animate indefinitely, so only render the component while the state is true.
- The component does not reserve message space. Wrap it in the same list layout as chat bubbles.

## Related

- `ChatBubble` for rendered messages.
- `ChatInput` for composing messages.
- `Presence` for user online state.
- `ActivityFeed` for non-chat realtime updates.
