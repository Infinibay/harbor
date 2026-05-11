# EmojiPicker

`EmojiPicker` renders a compact emoji palette for chat, reactions, comments, notes, and collaborative workflows. It provides categories, a search input, animated emoji buttons, and an `onPick` callback when the user chooses an emoji.

The picker ships with a small built-in emoji set. It is designed for lightweight product interactions, not as a complete Unicode emoji browser.

## Import

```tsx
import { EmojiPicker } from "@infinibay/harbor/chat";
```

## Basic Usage

```tsx
<Popover trigger={<Button variant="secondary">React</Button>}>
  <EmojiPicker onPick={(emoji) => addReaction(message.id, emoji)} />
</Popover>
```

Use it with chat input composition:

```tsx
<EmojiPicker onPick={(emoji) => setDraft((draft) => draft + emoji)} />
```

## Props

- **onPick** - required callback `(emoji: string) => void`.
- **className** - optional string merged onto the picker root.

## Interaction Model

The picker starts on the `Smileys` category. Category buttons switch the visible set. Clicking an emoji calls `onPick` with the selected emoji string.

The current search field does not perform text matching. When it contains text, the picker shows all emojis from every category and hides the category bar. Treat it as a lightweight broadening control until search metadata is added.

## Composition Guidance

`EmojiPicker` does not manage its own popover, drawer, or menu placement. Put it inside `Popover`, `Drawer`, `Dialog`, or an app-specific reaction panel.

After `onPick`, decide whether the parent should close the picker, keep it open for multiple reactions, or insert the emoji into a draft.

## Accessibility

Emoji buttons are visible buttons, but the current implementation does not add descriptive labels per emoji. For production accessibility, consider adding labels or using surrounding text when emoji choice affects important meaning.

Do not use emoji as the only indicator for critical state.

## Gotchas

- The emoji set is intentionally small.
- Search does not filter by name today.
- No recent/favorites list is built in.
- The component does not close itself after selection.

## Related

- `ReactionsBar` for displaying selected reactions.
- `ChatInput` for message composition.
- `Popover` for compact placement.
- `CommandPalette` for searchable command-style selection.
