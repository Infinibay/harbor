# TypingIndicator

The three-dot "is typing…" pill, styled to match an incoming `<ChatBubble>`.
Mount it at the bottom of a thread while a remote participant is composing.

## Import

```tsx
import { TypingIndicator } from "@infinibay/harbor/chat";
```

## Example

```tsx
{peerTyping ? <TypingIndicator name="Ana" /> : null}
```

## Props

- **name** — `string`. Optional label rendered before the dots (e.g. `"Ana"`). Omit for an anonymous indicator.
- **className** — extra classes on the pill.

## Notes

- Visual shape matches a `them`-side `<ChatBubble>` (same surface, border, and bottom-left tail) so it slots naturally into a thread.
- Dots animate forever via `framer-motion` with staggered delays.
- The component does not set `aria-live`; if you need screen readers to announce typing, wrap it in your own `aria-live="polite"` region and toggle the message there.
- Mount/unmount it conditionally — `framer-motion` `layout` plus `initial`/`exit` give it a smooth enter and exit when wrapped in `<AnimatePresence>`.
