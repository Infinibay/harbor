# ChatInput

Auto-growing message composer with Enter-to-send, Shift+Enter for newline,
and an animated send button that appears only when there is text.

## Import

```tsx
import { ChatInput } from "@infinibay/harbor/chat";
```

## Example

```tsx
<ChatInput
  placeholder="Message #general"
  onSend={(text) => sendMessage(text)}
/>
```

With leading actions (e.g. an emoji picker trigger):

```tsx
<ChatInput
  onSend={handleSend}
  actions={
    <button onClick={openEmoji} aria-label="Emoji">😊</button>
  }
/>
```

## Props

- **onSend** — `(text: string) => void`. Fires on Enter (no Shift) or send-button click. Receives the trimmed text; empty input is ignored.
- **placeholder** — `string`. Default: `"Type a message…"`.
- **actions** — `ReactNode`. Slot rendered to the left of the textarea (attach buttons, emoji trigger, file upload, etc.).
- **className** — extra classes on the outer container.

## Notes

- Input is internally controlled and clears itself after a successful `onSend`.
- The textarea auto-grows from one row up to `max-h-40` (160px), then scrolls.
- `Enter` sends; `Shift+Enter` inserts a newline.
- The send button mounts/unmounts with a spring and only appears when the trimmed text is non-empty; it carries `aria-label="Send"`.
- Pair the emitted text with `<ChatBubble from="me">` to render the new message.
