import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

/* ------------------------------------------------------------------ *
 *  Kanban — board + columns + cross-column drag-and-drop.
 *
 *    <KanbanBoard onCardMove={({ cardId, from, to, toIndex }) => …}>
 *      <KanbanColumn id="todo"  title="To do"  cards={todo}  accent="sky" />
 *      <KanbanColumn id="doing" title="Doing"  cards={doing} accent="amber" />
 *      <KanbanColumn id="done"  title="Done"   cards={done}  accent="green" />
 *    </KanbanBoard>
 *
 *  The parent owns each column's array. `onCardMove` fires once per
 *  drop and covers BOTH same-column reorders and cross-column moves —
 *  the parent reconciles by removing from `from` and inserting into
 *  `to` at `toIndex`.
 * ------------------------------------------------------------------ */

export interface KanbanCardData {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode[];
  assignee?: ReactNode;
}

export interface KanbanCardMoveEvent {
  cardId: string;
  from: string;
  to: string;
  /** Index in the destination column where the card should be inserted.
   *  For same-column moves, this is the index AFTER removing the card
   *  from its original position. */
  toIndex: number;
}

export interface KanbanBoardProps {
  children: ReactNode;
  /** Called once per drop. Covers both in-column reorders (from===to)
   *  and cross-column moves. The parent should remove the card from
   *  the `from` column and insert it into `to` at `toIndex`. */
  onCardMove?: (e: KanbanCardMoveEvent) => void;
  className?: string;
}

export interface KanbanColumnProps {
  id: string;
  title: string;
  count?: number;
  cards: KanbanCardData[];
  accent?: "neutral" | "sky" | "amber" | "green" | "rose";
  className?: string;
  /** Per-card "Move to…" menu options. Useful as a keyboard / no-drag
   *  fallback. Falls back to all sibling columns on the board. */
  moveTo?: { id: string; label: string }[];
}

const accents = {
  neutral: "bg-white/50",
  sky: "bg-sky-400",
  amber: "bg-amber-400",
  green: "bg-emerald-400",
  rose: "bg-rose-400",
};

type DragState = { cardId: string; fromColumn: string } | null;

type Ctx = {
  drag: DragState;
  setDrag: (s: DragState) => void;
  emit: (e: KanbanCardMoveEvent) => void;
  hoverColumn: string | null;
  setHoverColumn: (id: string | null) => void;
  registerColumn: (col: { id: string; title: string }) => () => void;
  columns: { id: string; title: string }[];
};

const KanbanCtx = createContext<Ctx | null>(null);

function useKanbanCtx(component: string): Ctx {
  const ctx = useContext(KanbanCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be inside <KanbanBoard>.`);
  }
  return ctx;
}

const MIME = "application/x-harbor-kanban";

export function KanbanBoard({
  children,
  onCardMove,
  className,
}: KanbanBoardProps) {
  const [drag, setDrag] = useState<DragState>(null);
  const [hoverColumn, setHoverColumn] = useState<string | null>(null);
  const columnsRef = useRef<{ id: string; title: string }[]>([]);
  // Re-render trigger on register/unregister.
  const [, bump] = useState(0);

  const registerColumn = (col: { id: string; title: string }) => {
    columnsRef.current = [...columnsRef.current, col];
    bump((n) => n + 1);
    return () => {
      columnsRef.current = columnsRef.current.filter((c) => c.id !== col.id);
      bump((n) => n + 1);
    };
  };

  const emit = (e: KanbanCardMoveEvent) => {
    onCardMove?.(e);
  };

  return (
    <KanbanCtx.Provider
      value={{
        drag,
        setDrag,
        emit,
        hoverColumn,
        setHoverColumn,
        registerColumn,
        columns: columnsRef.current,
      }}
    >
      <div className={cn("flex gap-3 overflow-x-auto pb-2", className)}>
        {children}
      </div>
    </KanbanCtx.Provider>
  );
}

export function KanbanColumn({
  id,
  title,
  count,
  cards,
  accent = "neutral",
  className,
  moveTo,
}: KanbanColumnProps) {
  const ctx = useKanbanCtx("KanbanColumn");
  const isHover = ctx.hoverColumn === id;
  const isDragSource = ctx.drag?.fromColumn === id;

  // Register column for sibling-aware "Move to…" fallback.
  useRegisterColumn(ctx, id, title);

  const fallbackMoveTo =
    moveTo ??
    ctx.columns.filter((c) => c.id !== id).map((c) => ({ id: c.id, label: c.title }));

  const onColumnDragOver = (e: ReactDragEvent) => {
    if (!ctx.drag) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    ctx.setHoverColumn(id);
  };
  const onColumnDragLeave = (e: ReactDragEvent) => {
    // Only clear when leaving the column wrapper, not its children.
    if (e.currentTarget === e.target) ctx.setHoverColumn(null);
  };
  const onColumnDrop = (e: ReactDragEvent) => {
    if (!ctx.drag) return;
    e.preventDefault();
    const toIndex = sameColumnAdjustedIndex(ctx.drag, id, cards, cards.length);
    ctx.emit({
      cardId: ctx.drag.cardId,
      from: ctx.drag.fromColumn,
      to: id,
      toIndex,
    });
    ctx.setHoverColumn(null);
    ctx.setDrag(null);
  };

  return (
    <div
      onDragOver={onColumnDragOver}
      onDragLeave={onColumnDragLeave}
      onDrop={onColumnDrop}
      className={cn(
        "flex flex-col min-w-[240px] rounded-2xl bg-white/[0.02] border p-2 transition-colors",
        isHover && !isDragSource
          ? "border-fuchsia-400/40 bg-fuchsia-500/[0.04]"
          : "border-white/8",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2 py-2">
        <span className={cn("w-2 h-2 rounded-full", accents[accent])} />
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="ml-auto text-xs text-white/40 tabular-nums">
          {count ?? cards.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-[60px]">
        <AnimatePresence initial={false}>
          {cards.map((c, i) => (
            <KanbanCard
              key={c.id}
              card={c}
              columnId={id}
              index={i}
              moveTo={fallbackMoveTo}
            />
          ))}
        </AnimatePresence>
        {/* Spacer drop target for empty/end-of-column drops. */}
        <div
          onDragOver={(e) => {
            if (!ctx.drag) return;
            e.preventDefault();
          }}
          onDrop={(e) => {
            if (!ctx.drag) return;
            e.preventDefault();
            e.stopPropagation();
            const toIndex = sameColumnAdjustedIndex(
              ctx.drag,
              id,
              cards,
              cards.length,
            );
            ctx.emit({
              cardId: ctx.drag.cardId,
              from: ctx.drag.fromColumn,
              to: id,
              toIndex,
            });
            ctx.setHoverColumn(null);
            ctx.setDrag(null);
          }}
          className="flex-1 min-h-[24px]"
        />
      </div>
    </div>
  );
}

function useRegisterColumn(ctx: Ctx, id: string, title: string) {
  // Register on mount, unregister on unmount; updates on title change.
  const ref = useRef<{ id: string; title: string } | null>(null);
  if (!ref.current || ref.current.id !== id || ref.current.title !== title) {
    ref.current = { id, title };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => ctx.registerColumn(ref.current!));
}

function useEffectOnce(fn: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}

function KanbanCard({
  card,
  columnId,
  index,
  moveTo,
}: {
  card: KanbanCardData;
  columnId: string;
  index: number;
  moveTo?: { id: string; label: string }[];
}) {
  const ctx = useKanbanCtx("KanbanCard");
  const [menu, setMenu] = useState(false);
  const isDragging = ctx.drag?.cardId === card.id;

  const onDragStart = (e: ReactDragEvent) => {
    ctx.setDrag({ cardId: card.id, fromColumn: columnId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(MIME, card.id);
  };

  const onDragOverCard = (e: ReactDragEvent) => {
    if (!ctx.drag) return;
    e.preventDefault();
  };

  // Drop on a card → insert before or after based on cursor Y.
  const onDropOnCard = (e: ReactDragEvent) => {
    if (!ctx.drag) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isBelow = e.clientY > rect.top + rect.height / 2;
    const insertAt = index + (isBelow ? 1 : 0);
    handleCardDrop(e, ctx, columnId, insertAt);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={() => ctx.setDrag(null)}
        onDragOver={onDragOverCard}
        onDrop={onDropOnCard}
        className="group relative rounded-xl bg-[#14141c] border border-white/10 p-3 cursor-grab active:cursor-grabbing"
      >
      <div className="text-sm text-white font-medium pr-6">{card.title}</div>
      {card.meta ? (
        <div className="text-xs text-white/50 mt-1">{card.meta}</div>
      ) : null}
      {card.tags && card.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">{card.tags}</div>
      ) : null}
      {card.assignee ? (
        <div className="absolute bottom-2 right-2">{card.assignee}</div>
      ) : null}
      {moveTo?.length ? (
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setMenu((m) => !m)}
            className="w-6 h-6 grid place-items-center rounded-md text-white/50 hover:text-white hover:bg-white/5"
          >
            ⋯
          </button>
          <AnimatePresence>
            {menu ? (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                className="absolute right-0 mt-1 min-w-[140px] rounded-lg bg-[#1c1c26] border border-white/10 shadow-xl p-1 z-10"
              >
                {moveTo.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      ctx.emit({
                        cardId: card.id,
                        from: columnId,
                        to: t.id,
                        toIndex: Number.MAX_SAFE_INTEGER,
                      });
                      setMenu(false);
                    }}
                    className="w-full text-left text-xs text-white/80 hover:bg-white/5 rounded px-2 py-1.5"
                  >
                    Move to {t.label}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
      </div>
    </motion.div>
  );
}

/* --------------------------- drop helpers --------------------------- */

function handleCardDrop(
  _e: ReactDragEvent,
  ctx: Ctx,
  toColumn: string,
  insertAt: number,
) {
  if (!ctx.drag) return;
  ctx.emit({
    cardId: ctx.drag.cardId,
    from: ctx.drag.fromColumn,
    to: toColumn,
    toIndex: insertAt,
  });
  ctx.setHoverColumn(null);
  ctx.setDrag(null);
}

function sameColumnAdjustedIndex(
  drag: NonNullable<DragState>,
  toColumn: string,
  cards: KanbanCardData[],
  proposedIndex: number,
): number {
  if (drag.fromColumn !== toColumn) return proposedIndex;
  const fromIndex = cards.findIndex((c) => c.id === drag.cardId);
  if (fromIndex < 0) return proposedIndex;
  // After removing the card from its original spot, adjust the target.
  return proposedIndex > fromIndex ? proposedIndex - 1 : proposedIndex;
}
