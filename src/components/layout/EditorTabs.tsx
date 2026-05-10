import { AnimatePresence, Reorder } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface EditorTab {
  id: string;
  title: string;
  icon?: ReactNode;
  dirty?: boolean;
  pinned?: boolean;
  badge?: ReactNode;
}

export interface EditorTabsProps {
  tabs: EditorTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose?: (id: string) => void;
  onReorder?: (tabs: EditorTab[]) => void;
  onNew?: () => void;
  className?: string;
}

export function EditorTabs({
  tabs,
  activeId,
  onActivate,
  onClose,
  onReorder,
  onNew,
  className,
}: EditorTabsProps) {
  return (
    <div
      className={cn(
        [
          "flex min-w-0 items-end border-b",
          "h-[var(--harbor-workbench-tab-height)] border-[var(--harbor-workbench-border)] bg-[var(--harbor-workbench-panel-bg)]",
          "[font-family:var(--harbor-workbench-mono-family)] [font-size:var(--harbor-workbench-tab-font-size)]",
        ].join(" "),
        className,
      )}
    >
      <Reorder.Group
        axis="x"
        values={tabs}
        onReorder={(next) => onReorder?.(next as EditorTab[])}
        className="flex min-w-0 flex-1 items-end overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {tabs.map((tab) => {
            const active = tab.id === activeId;
            return (
              <Reorder.Item
                key={tab.id}
                value={tab}
                dragListener={!tab.pinned}
                whileDrag={{ zIndex: 3, scale: 1.01 }}
                onClick={() => onActivate(tab.id)}
                className={cn(
                  [
                    "group relative flex cursor-pointer select-none items-center border-r",
                    "h-[var(--harbor-workbench-tab-height)] min-w-[var(--harbor-workbench-tab-min-width)] max-w-[var(--harbor-workbench-tab-max-width)]",
                    "gap-[var(--harbor-workbench-tab-gap)] border-[var(--harbor-workbench-border)] px-[var(--harbor-workbench-tab-padding-x)]",
                  ].join(" "),
                  active
                    ? "bg-[var(--harbor-workbench-tab-active-bg)] text-[color:var(--harbor-workbench-selection-fg)]"
                    : "bg-[var(--harbor-workbench-tab-bg)] text-[color:var(--harbor-workbench-fg-muted)] hover:bg-[var(--harbor-workbench-tab-hover-bg)] hover:text-[color:var(--harbor-workbench-selection-fg)]",
                )}
              >
                {active ? (
                  <span
                    className="absolute left-0 right-0 top-0 h-[var(--harbor-workbench-tab-indicator-height)] bg-[var(--harbor-workbench-accent)]"
                  />
                ) : null}
                {tab.icon ? (
                  <span className="grid h-[var(--harbor-workbench-tab-icon-size)] w-[var(--harbor-workbench-tab-icon-size)] shrink-0 place-items-center">
                    {tab.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate font-mono">{tab.title}</span>
                {tab.badge}
                {tab.dirty ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--harbor-workbench-dirty)]" />
                ) : onClose && !tab.pinned ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onClose(tab.id);
                    }}
                    className={cn(
                      "grid h-[var(--harbor-workbench-tab-close-size)] w-[var(--harbor-workbench-tab-close-size)] shrink-0 place-items-center rounded-[var(--harbor-workbench-radius)] text-[length:var(--harbor-workbench-font-size)] leading-none text-[color:var(--harbor-workbench-icon-muted)] hover:bg-[var(--harbor-workbench-control-hover-bg)] hover:text-[color:var(--harbor-workbench-selection-fg)]",
                      active ? "opacity-80" : "opacity-0 group-hover:opacity-80",
                    )}
                    aria-label={`Close ${tab.title}`}
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
          type="button"
          onClick={onNew}
          className="mb-1 mr-1 grid h-[var(--harbor-workbench-tab-new-size)] w-[var(--harbor-workbench-tab-new-size)] shrink-0 place-items-center rounded-[var(--harbor-workbench-radius)] text-[color:var(--harbor-workbench-icon-muted)] hover:bg-[var(--harbor-workbench-control-hover-bg)] hover:text-[color:var(--harbor-workbench-selection-fg)]"
          aria-label="New tab"
        >
          +
        </button>
      ) : null}
    </div>
  );
}
