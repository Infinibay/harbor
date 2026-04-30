# Kanban

Drag-and-drop board with **cross-column drag** and a unified
`onCardMove` event. `<KanbanBoard>` is the horizontal container;
`<KanbanColumn>` is one column with reorderable cards. The board does
not own state — the parent maintains the per-column card arrays and
applies the move on each event.

## Import

```tsx
import {
  KanbanBoard,
  KanbanColumn,
  type KanbanCardData,
  type KanbanCardMoveEvent,
} from "@infinibay/harbor/data";
```

## Example

```tsx
const [board, setBoard] = useState({
  todo:  [{ id: "a", title: "Wire login" }],
  doing: [{ id: "b", title: "Refactor auth" }],
  done:  [],
});

const handleMove = (e: KanbanCardMoveEvent) => {
  setBoard((prev) => {
    const from = prev[e.from].slice();
    const idx = from.findIndex((c) => c.id === e.cardId);
    const [card] = from.splice(idx, 1);
    const to = prev[e.to].slice();
    to.splice(Math.min(e.toIndex, to.length), 0, card);
    return { ...prev, [e.from]: from, [e.to]: to };
  });
};

<KanbanBoard onCardMove={handleMove}>
  <KanbanColumn id="todo"  title="To do" cards={board.todo}  accent="sky" />
  <KanbanColumn id="doing" title="Doing" cards={board.doing} accent="amber" />
  <KanbanColumn id="done"  title="Done"  cards={board.done}  accent="green" />
</KanbanBoard>;
```

## KanbanCardData

```ts
{
  id: string;
  title: ReactNode;
  meta?: ReactNode;       // small subtitle line under the title
  tags?: ReactNode[];     // chips rendered as a wrap row
  assignee?: ReactNode;   // bottom-right slot (e.g. <Avatar>)
}
```

## KanbanCardMoveEvent

```ts
{
  cardId: string;
  from: string;             // source column id
  to: string;               // destination column id
  toIndex: number;          // insert index in the destination, after
                            // the card has been removed from `from`
}
```

## Props (`<KanbanBoard>`)

- **children** — `<KanbanColumn>` instances.
- **onCardMove** — `(e: KanbanCardMoveEvent) => void`. Fires once per
  drop. Covers BOTH same-column reorders (`from === to`) and
  cross-column moves. The parent reconciles the new state.
- **className** — extra classes on the row.

## Props (`<KanbanColumn>`)

- **id** — `string`. Required. Stable column key.
- **title** — `string`. Required.
- **cards** — `KanbanCardData[]`. Required.
- **count** — `number`. Override the count badge. Default `cards.length`.
- **accent** — `"neutral" | "sky" | "amber" | "green" | "rose"`. Default `"neutral"`.
- **moveTo** — `{ id, label }[]`. Per-card "Move to…" menu (no-drag
  fallback). When omitted, the menu lists all sibling columns
  registered on the same board.
- **className** — extra classes on the column.

## Notes

- Drag uses native HTML5 DnD — no extra dependencies, works with
  keyboard-only-no scenarios via the `⋯` per-card menu.
- Drop targets: hovering over a card inserts before/after based on the
  cursor's vertical position; hovering empty column space appends.
- The destination column highlights while a card is dragged over it
  from another column.
- Cards animate with `<AnimatePresence>` on enter/exit — the parent
  must derive new arrays from a single source of truth so the diff
  stays consistent.
- The board scrolls horizontally when columns overflow.
