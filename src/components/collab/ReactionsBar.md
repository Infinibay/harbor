# ReactionsBar

A compact emoji-reaction strip with an inline picker. Use it on any
single item (post, message, card) where users add or remove reactions.
For threaded discussions where each comment has its own reactions,
prefer `<CommentThread>`.

## Import

```tsx
import { ReactionsBar } from "@infinibay/harbor/collab";
```

## Example

```tsx
const [reactions, setReactions] = useState([
  { emoji: "👍", count: 4, mine: false },
  { emoji: "🎉", count: 2, mine: true },
]);

<ReactionsBar
  reactions={reactions}
  onToggle={(emoji) => toggleReaction(emoji)}
/>;
```

## Props

- **reactions** — `Reaction[]`. Required. Shape:
  `{ emoji: string, count: number, mine?: boolean }`. Chips with
  `mine: true` render in the highlighted fuchsia state.
- **onToggle** — `(emoji: string) => void`. Required. Fires both when
  an existing chip is clicked and when an emoji is picked from the
  popover. The component does not mutate `reactions` itself — apply
  the toggle in your own state.
- **quickEmojis** — `string[]`. Emojis shown in the picker popover.
  Default: `["👍", "❤️", "🎉", "🚀", "👀", "🤔", "🔥", "😂"]`.
- **className** — extra classes on the root inline-flex container.

## Notes

- The picker is local UI state; clicking the `+ 😀` button toggles it,
  and a fixed-position backdrop closes it on outside click. Selecting
  an emoji fires `onToggle` and closes the picker.
- The component is fully controlled: removing a reaction (count to 0)
  or appending a new emoji is the caller's responsibility inside the
  `onToggle` handler.
- Empty `reactions` is valid — only the `+ 😀` trigger renders.
- The trigger has `aria-label="Add reaction"` for screen readers; chip
  buttons rely on their visible emoji and count.
