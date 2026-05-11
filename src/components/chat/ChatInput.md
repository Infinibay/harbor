# ChatInput

`ChatInput` is a compact message composer with auto-growing textarea, optional
leading actions, animated send button, and keyboard submit behavior. It is built
for chat surfaces, AI assistants, support inboxes, comment threads, and command
style message panels.

The component owns the draft text locally and emits completed messages through
`onSend`.

## Import

```tsx
import { ChatInput } from "@infinibay/harbor/chat";
```

## Basic Usage

```tsx
<ChatInput
  placeholder="Ask Harbor about this deployment"
  onSend={(text) => {
    sendMessage(text);
  }}
/>;
```

With leading actions:

```tsx
<ChatInput
  actions={<Button variant="ghost">Attach</Button>}
  onSend={(text) => addComment(text)}
/>;
```

## Props

- **onSend** - `(text: string) => void`. Called with trimmed text when the user
  sends.
- **placeholder** - `string`. Textarea placeholder. Default
  `"Type a message..."`.
- **actions** - `ReactNode`. Optional content before the textarea, commonly
  attachment, mention, or tool buttons.
- **className** - extra classes on the wrapper.

## Interaction

The textarea grows with content up to 160 pixels tall. Pressing `Enter` sends the
message. Pressing `Shift+Enter` inserts a newline. Empty or whitespace-only
messages are ignored.

The send button appears only when the trimmed draft has content. After sending,
the draft is cleared.

## State Model

`ChatInput` is intentionally uncontrolled. It is for standard message
composition, not for externally controlled drafts. If your product needs saved
drafts, collaborative editing, or server-synced input state, wrap it or build a
controlled composer from `Textarea` and `Button`.

## Accessibility

The send button has `aria-label="Send"`. Provide a specific placeholder so users
know what kind of message they are composing. If you pass icon-only `actions`,
those controls need their own accessible labels.

Keyboard behavior follows chat conventions, but long-form comment editors may
prefer `Ctrl+Enter` submit instead. Choose the component that matches the
workflow.

## Gotchas

- `onSend` fires synchronously with the current text; handle async errors in the
  parent and decide whether to reinsert failed messages.
- The textarea height is manipulated directly for auto-grow.
- There is no built-in attachment handling. The `actions` slot only renders your
  controls.

## Related

- `ChatBubble` for rendered messages.
- `CommentThread` for threaded discussion.
- `Textarea` for controlled long-form input.
- `Button` for custom send and attachment actions.
