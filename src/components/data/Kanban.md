# Kanban

`Kanban` provides a controlled drag-and-drop board for operational queues: roadmap planning, support triage, deployment reviews, hiring pipelines, bug workflows, and any process that moves cards across stages.

Harbor renders the board, columns, cards, hover states, move menu, and enter/exit animation. Your app owns the arrays for each column and applies each `onCardMove` event to state.

## Import

```tsx
import {
  KanbanBoard,
  KanbanColumn,
  type KanbanCardData,
  type KanbanCardMoveEvent,
} from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
const [board, setBoard] = useState<Record<string, KanbanCardData[]>>({
  todo: [{ id: "api", title: "Define billing API", meta: "Platform" }],
  doing: [{ id: "ui", title: "Polish checkout", meta: "Growth" }],
  done: [],
});

function moveCard(e: KanbanCardMoveEvent) {
  setBoard((prev) => {
    const from = prev[e.from].slice();
    const cardIndex = from.findIndex((card) => card.id === e.cardId);
    if (cardIndex < 0) return prev;
    const [card] = from.splice(cardIndex, 1);
    const to = prev[e.to].slice();
    to.splice(Math.min(e.toIndex, to.length), 0, card);
    return { ...prev, [e.from]: from, [e.to]: to };
  });
}

<KanbanBoard onCardMove={moveCard}>
  <KanbanColumn id="todo" title="To do" cards={board.todo} accent="sky" />
  <KanbanColumn id="doing" title="Doing" cards={board.doing} accent="amber" />
  <KanbanColumn id="done" title="Done" cards={board.done} accent="green" />
</KanbanBoard>
```

## How Moves Work

`onCardMove` fires once per drop. The event includes `cardId`, source column `from`, destination column `to`, and destination `toIndex`. For same-column moves, `toIndex` is already adjusted as if the card had first been removed from its original position.

## Props

`KanbanBoard` accepts `children`, `onCardMove`, and `className`.

`KanbanColumn` accepts `id`, `title`, `count`, `cards`, `accent`, `moveTo`, and `className`.

`KanbanCardData` accepts `id`, `title`, `meta`, `tags`, and `assignee`.

## Accessibility

Drag uses native HTML drag-and-drop. Each card also exposes a "Move to" menu when destinations are available, giving pointer users a precise non-drag fallback. Keep card titles concise and pass accessible components for tags and assignees.

## Gotchas

The component does not mutate your state. If cards appear to snap back after a drop, check that `onCardMove` removes the card from `from` and inserts it into `to`.

## Related

Use with `Card`, `Avatar`, `Badge`, `DataTable`, `FilterPanel`, and `ActivityFeed`.
