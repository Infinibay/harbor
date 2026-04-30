# EmojiPicker

A compact emoji palette with category tabs and a search field. Designed to
be mounted inside a popover or floating panel anchored to a `<ChatInput>`
action.

## Import

```tsx
import { EmojiPicker } from "@infinibay/harbor/chat";
```

## Example

```tsx
<EmojiPicker onPick={(emoji) => insertAtCursor(emoji)} />
```

## Props

- **onPick** — `(emoji: string) => void`. Required. Called with the emoji character when a cell is clicked.
- **className** — extra classes on the panel.

## Notes

- Ships with five fixed categories: `Smileys`, `Gestures`, `Hearts`, `Nature`, `Tech`. Categories are baked in; not configurable.
- Typing into the search field flattens all categories into a single grid (the category tab row hides while searching). Search is currently a passthrough — it does not filter by name, it just switches view.
- Fixed width (`w-64`); grid is 7 columns; emoji list scrolls inside `max-h-56`.
- The picker has no built-in floating/positioning behavior — wrap it in your own popover or `<Portal>` and anchor it yourself.
- Cells animate scale on hover/tap via `framer-motion`.
