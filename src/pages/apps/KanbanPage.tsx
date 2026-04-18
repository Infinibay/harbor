import { useState } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import { KanbanBoard, KanbanColumn, type KanbanCardData } from "../../components";

type State = {
  todo: KanbanCardData[];
  doing: KanbanCardData[];
  done: KanbanCardData[];
};

type ColId = keyof State;

function moveCard(k: State, from: ColId, to: ColId, id: string): State {
  const card = k[from].find((c) => c.id === id);
  if (!card) return k;
  return {
    ...k,
    [from]: k[from].filter((c) => c.id !== id),
    [to]: [card, ...k[to]],
  };
}

export function KanbanPage() {
  const [kanban, setKanban] = useState<State>({
    todo: [
      { id: "k1", title: "Rotate API keys", meta: "due tomorrow" },
      { id: "k2", title: "Upgrade Postgres to 16" },
    ],
    doing: [{ id: "k3", title: "Audit log export", meta: "Ana F." }],
    done: [{ id: "k4", title: "Add OTP to sign-in" }],
  });

  return (
    <Group id="kanban" title="Kanban · workflow" desc="Draggable columns, reorder, move across.">
      <Demo title="Board" wide intensity="soft">
        <KanbanBoard>
          <KanbanColumn
            id="todo"
            title="To do"
            accent="sky"
            cards={kanban.todo}
            onReorder={(c) => setKanban((k) => ({ ...k, todo: c }))}
            onMoveOut={(id, to) => setKanban((k) => moveCard(k, "todo", to as ColId, id))}
            moveTo={[
              { id: "doing", label: "Doing" },
              { id: "done", label: "Done" },
            ]}
          />
          <KanbanColumn
            id="doing"
            title="Doing"
            accent="amber"
            cards={kanban.doing}
            onReorder={(c) => setKanban((k) => ({ ...k, doing: c }))}
            onMoveOut={(id, to) => setKanban((k) => moveCard(k, "doing", to as ColId, id))}
            moveTo={[
              { id: "todo", label: "To do" },
              { id: "done", label: "Done" },
            ]}
          />
          <KanbanColumn
            id="done"
            title="Done"
            accent="green"
            cards={kanban.done}
            onReorder={(c) => setKanban((k) => ({ ...k, done: c }))}
            onMoveOut={(id, to) => setKanban((k) => moveCard(k, "done", to as ColId, id))}
            moveTo={[
              { id: "todo", label: "To do" },
              { id: "doing", label: "Doing" },
            ]}
          />
        </KanbanBoard>
      </Demo>
    </Group>
  );
}
