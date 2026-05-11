# ReactionsBar

`ReactionsBar` renders compact emoji reactions with counts, current-user state, and a quick emoji picker. Use it in comments, activity feeds, chat messages, review threads, changelog entries, and collaborative annotations.

The component is controlled. Your app decides how toggling an emoji updates counts and whether the current user owns a reaction.

## Import

```tsx
import { ReactionsBar, type Reaction } from "@infinibay/harbor/collab";
```

## Basic Usage

```tsx
import { ReactionsBar, type Reaction } from "@infinibay/harbor/collab";

export function CommentReactions() {
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "👍", count: 4, mine: true },
    { emoji: "🚀", count: 2 },
  ]);

  return (
    <ReactionsBar
      reactions={reactions}
      onToggle={(emoji) => setReactions((current) => toggleReaction(current, emoji))}
    />
  );
}
```

## Quick Emoji Picker

```tsx
<ReactionsBar
  reactions={reactions}
  quickEmojis={["👍", "👀", "✅", "❤️"]}
  onToggle={toggleReaction}
/>
```

The picker is intentionally small. For full emoji search, use `EmojiPicker` in a popover or chat composer.

## Props

- **reactions**: `Reaction[]`. Required rendered reactions.
- **onToggle**: `(emoji: string) => void`. Required toggle callback.
- **quickEmojis**: `string[]`. Picker options. Defaults to eight common emoji.
- **className**: custom class on the wrapper.

`Reaction` is `{ emoji: string; count: number; mine?: boolean }`.

## Accessibility

Reaction chips are buttons with pressed state when `mine` is true. The add button exposes expanded state while the picker is open. If reactions affect workflow state, mirror the important outcome in text outside the emoji row.

## Gotchas

- Counts are not mutated internally. `onToggle` must update the `reactions` array.
- The picker closes after choosing an emoji.
- The outside click layer is a fixed div; keep the bar inside normal stacking contexts.
- Emoji labels are limited. For highly regulated or business-critical workflows, use explicit actions instead of emoji-only feedback.

## Related

- [`CommentThread`](./CommentThread.md) for review discussions.
- [`EmojiPicker`](../chat/EmojiPicker.md) for richer emoji selection.
- [`ActivityFeed`](../feedback/ActivityFeed.md) for event streams.
