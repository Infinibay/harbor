import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface FileExplorerNode {
  id: string;
  name: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: FileExplorerNode[];
}

export interface FileExplorerProps {
  nodes: FileExplorerNode[];
  selectedId?: string;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  onSelect?: (id: string, node: FileExplorerNode) => void;
  onNodeContextMenu?: (
    event: MouseEvent<HTMLButtonElement>,
    node: FileExplorerNode,
  ) => void;
  className?: string;
}

export function FileExplorer({
  nodes,
  selectedId,
  defaultExpandedIds = [],
  expandedIds,
  onExpandedIdsChange,
  onSelect,
  onNodeContextMenu,
  className,
}: FileExplorerProps) {
  const [internalExpanded, setInternalExpanded] = useState(
    () => new Set(defaultExpandedIds),
  );
  const expanded = useMemo(
    () => new Set(expandedIds ?? Array.from(internalExpanded)),
    [expandedIds, internalExpanded],
  );

  function setExpanded(next: Set<string>) {
    if (expandedIds) onExpandedIdsChange?.(Array.from(next));
    else setInternalExpanded(next);
  }

  function toggle(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }

  return (
    <div
      className={cn(
        [
          "select-none overflow-auto py-[var(--harbor-space-1)]",
          "bg-[var(--harbor-workbench-panel-deep-bg)] text-[color:var(--harbor-workbench-fg)]",
          "[font-family:var(--harbor-workbench-mono-family)] [font-size:var(--harbor-workbench-font-size)] [line-height:var(--harbor-workbench-line-height)]",
        ].join(" "),
        className,
      )}
    >
      <ul className="space-y-0.5">
        {nodes.map((node) => (
          <FileExplorerRow
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            selectedId={selectedId}
            onToggle={toggle}
            onSelect={onSelect}
            onNodeContextMenu={onNodeContextMenu}
          />
        ))}
      </ul>
    </div>
  );
}

function FileExplorerRow({
  node,
  depth,
  expanded,
  selectedId,
  onToggle,
  onSelect,
  onNodeContextMenu,
}: {
  node: FileExplorerNode;
  depth: number;
  expanded: Set<string>;
  selectedId?: string;
  onToggle: (id: string) => void;
  onSelect?: (id: string, node: FileExplorerNode) => void;
  onNodeContextMenu?: (
    event: MouseEvent<HTMLButtonElement>,
    node: FileExplorerNode,
  ) => void;
}) {
  const folder = !!node.children?.length;
  const open = expanded.has(node.id);
  const selected = selectedId === node.id;

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (folder) onToggle(node.id);
          onSelect?.(node.id, node);
        }}
        onContextMenu={(event) => onNodeContextMenu?.(event, node)}
        className={cn(
          [
            "flex w-full items-center text-left transition-colors",
            "h-[var(--harbor-workbench-tree-row-height)] gap-[var(--harbor-workbench-gap)]",
            "text-[length:var(--harbor-workbench-font-size)]",
          ].join(" "),
          selected
            ? "bg-[var(--harbor-workbench-selection-bg)] text-[color:var(--harbor-workbench-selection-fg)]"
            : "text-[color:var(--harbor-workbench-fg-muted)] hover:bg-[var(--harbor-workbench-control-hover-bg)] hover:text-[color:var(--harbor-workbench-fg)]",
        )}
        style={{
          paddingLeft: `calc(var(--harbor-workbench-tree-padding-x) + ${depth} * var(--harbor-workbench-tree-indent))`,
          paddingRight: "var(--harbor-workbench-tree-padding-x)",
        }}
      >
        {folder ? (
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
            className="grid h-[var(--harbor-workbench-tree-disclosure-size)] w-[var(--harbor-workbench-tree-disclosure-size)] place-items-center text-[length:var(--harbor-workbench-badge-font-size)] text-[color:var(--harbor-workbench-icon-muted)]"
          >
            ▶
          </motion.span>
        ) : (
          <span className="h-[var(--harbor-workbench-tree-disclosure-size)] w-[var(--harbor-workbench-tree-disclosure-size)] shrink-0" />
        )}
        {node.icon ? (
          <span className="grid h-[var(--harbor-workbench-tree-icon-size)] w-[var(--harbor-workbench-tree-icon-size)] shrink-0 place-items-center">
            {node.icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
        {node.badge ? <span className="shrink-0">{node.badge}</span> : null}
      </button>
      <AnimatePresence initial={false}>
        {folder && open ? (
          <motion.ul
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <FileExplorerRow
                key={child.id}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={onToggle}
                onSelect={onSelect}
                onNodeContextMenu={onNodeContextMenu}
              />
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
