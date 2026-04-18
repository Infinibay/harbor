import { useState, type ReactNode } from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface KanbanCardData {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode[];
  assignee?: ReactNode;
}

export interface KanbanColumnProps {
  id: string;
  title: string;
  count?: number;
  cards: KanbanCardData[];
  onReorder: (cards: KanbanCardData[]) => void;
  onMoveOut?: (cardId: string, toColumn: string) => void;
  accent?: "neutral" | "sky" | "amber" | "green" | "rose";
  className?: string;
  moveTo?: { id: string; label: string }[];
}

const accents = {
  neutral: "bg-white/50",
  sky: "bg-sky-400",
  amber: "bg-amber-400",
  green: "bg-emerald-400",
  rose: "bg-rose-400",
};

export function KanbanColumn({
  title,
  count,
  cards,
  onReorder,
  onMoveOut,
  accent = "neutral",
  className,
  moveTo,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col min-w-[240px] rounded-2xl bg-white/[0.02] border border-white/8 p-2",
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
      <Reorder.Group
        axis="y"
        values={cards}
        onReorder={onReorder}
        className="flex flex-col gap-2 flex-1 min-h-[60px]"
      >
        <AnimatePresence initial={false}>
          {cards.map((c) => (
            <KanbanCard
              key={c.id}
              card={c}
              onMoveOut={onMoveOut}
              moveTo={moveTo}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

function KanbanCard({
  card,
  onMoveOut,
  moveTo,
}: {
  card: KanbanCardData;
  onMoveOut?: (cardId: string, toColumn: string) => void;
  moveTo?: { id: string; label: string }[];
}) {
  const [menu, setMenu] = useState(false);
  return (
    <Reorder.Item
      value={card}
      dragListener
      whileDrag={{
        scale: 1.03,
        boxShadow: "0 12px 30px -10px rgba(0,0,0,0.5)",
      }}
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
                      onMoveOut?.(card.id, t.id);
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
    </Reorder.Item>
  );
}

export function KanbanBoard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 overflow-x-auto pb-2", className)}>
      {children}
    </div>
  );
}
