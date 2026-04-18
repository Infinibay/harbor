import { AnimatePresence, Reorder, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface BrowserTab {
  id: string;
  title: string;
  icon?: ReactNode;
  pinned?: boolean;
  loading?: boolean;
}

export interface BrowserTabsProps {
  tabs: BrowserTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose?: (id: string) => void;
  onReorder?: (tabs: BrowserTab[]) => void;
  onNew?: () => void;
  className?: string;
}

export function BrowserTabs({
  tabs,
  activeId,
  onActivate,
  onClose,
  onReorder,
  onNew,
  className,
}: BrowserTabsProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-0.5 px-1 pt-1 bg-white/[0.02] border-b border-white/8",
        className,
      )}
    >
      <Reorder.Group
        axis="x"
        values={tabs}
        onReorder={(next) => onReorder?.(next as BrowserTab[])}
        className="flex items-end gap-0.5 overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {tabs.map((t) => {
            const active = t.id === activeId;
            return (
              <Reorder.Item
                key={t.id}
                value={t}
                dragListener={!t.pinned}
                whileDrag={{ zIndex: 2, scale: 1.02 }}
                className={cn(
                  "group relative flex items-center gap-2 h-8 pl-3 pr-2 rounded-t-md cursor-pointer max-w-[180px] min-w-[80px]",
                  active
                    ? "bg-[#14141c] text-white"
                    : "bg-white/[0.03] text-white/65 hover:bg-white/[0.06] hover:text-white/90",
                )}
                onClick={() => onActivate(t.id)}
              >
                {active ? (
                  <motion.span
                    layoutId="tab-bottom"
                    className="absolute left-0 right-0 -bottom-px h-px bg-[#14141c]"
                  />
                ) : null}
                <span className="w-4 h-4 grid place-items-center text-xs shrink-0">
                  {t.loading ? (
                    <span className="block w-3 h-3 rounded-full border border-white/50 border-t-transparent animate-spin" />
                  ) : (
                    t.icon ?? "🌐"
                  )}
                </span>
                <span className="flex-1 truncate text-xs font-medium">
                  {t.title}
                </span>
                {onClose && !t.pinned ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose(t.id);
                    }}
                    className={cn(
                      "w-4 h-4 grid place-items-center rounded text-xs text-white/50 hover:bg-white/10 hover:text-white",
                      active ? "opacity-70" : "opacity-0 group-hover:opacity-70",
                    )}
                    aria-label="Close tab"
                  >
                    ×
                  </button>
                ) : null}
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>
      {onNew ? (
        <button
          onClick={onNew}
          className="h-7 w-7 ml-0.5 mb-0.5 rounded-md grid place-items-center text-white/50 hover:bg-white/5 hover:text-white text-sm"
          aria-label="New tab"
        >
          +
        </button>
      ) : null}
    </div>
  );
}
