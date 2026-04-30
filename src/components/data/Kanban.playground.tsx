import { useState } from "react";
import {
  KanbanBoard,
  KanbanColumn,
  type KanbanCardData,
  type KanbanCardMoveEvent,
} from "./Kanban";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

type ColumnId = "todo" | "doing" | "done";

const initial: Record<ColumnId, KanbanCardData[]> = {
  todo: [
    { id: "t1", title: "Audit type imports", meta: "Frontend · Cleanup" },
    { id: "t2", title: "Spike: Bun runtime in CI", meta: "Platform" },
    {
      id: "t3",
      title: "Migrate billing webhook",
      tags: [
        <span key="p" className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
          priority
        </span>,
      ],
    },
  ],
  doing: [
    { id: "d1", title: "Refactor Dialog to subcomponents", meta: "harbor" },
    { id: "d2", title: "Drag & drop on Kanban", meta: "harbor" },
  ],
  done: [
    { id: "x1", title: "Document backgrounds (10)", meta: "harbor-site" },
    { id: "x2", title: "Document buttons (11)", meta: "harbor-site" },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KanbanDemo(_props: any) {
  const [board, setBoard] = useState(initial);

  const handleMove = (e: KanbanCardMoveEvent) => {
    setBoard((prev) => {
      const from = prev[e.from as ColumnId].slice();
      const idx = from.findIndex((c) => c.id === e.cardId);
      if (idx < 0) return prev;
      const [card] = from.splice(idx, 1);
      const next = { ...prev, [e.from]: from };
      const to = (next[e.to as ColumnId] ?? []).slice();
      const insertAt = Math.min(e.toIndex, to.length);
      to.splice(insertAt, 0, card);
      next[e.to as ColumnId] = to;
      return next;
    });
  };

  return (
    <div style={{ minHeight: 420 }}>
      <KanbanBoard onCardMove={handleMove}>
        <KanbanColumn id="todo"  title="To do" cards={board.todo}  accent="sky" />
        <KanbanColumn id="doing" title="Doing" cards={board.doing} accent="amber" />
        <KanbanColumn id="done"  title="Done"  cards={board.done}  accent="green" />
      </KanbanBoard>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: KanbanDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {},
  events: [
    {
      name: "onCardMove",
      signature: "({ cardId, from, to, toIndex }) => void",
      description:
        "Fires once per drop. Covers both same-column reorders and cross-column moves.",
    },
  ],
  notes:
    "Drag any card across columns to reorder or reclassify. The per-card ⋯ menu is a no-drag fallback that emits the same event.",
};
