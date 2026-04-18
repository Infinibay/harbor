import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  selected?: string;
  className?: string;
}

export function TreeView({
  nodes,
  defaultExpanded = [],
  onSelect,
  selected,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState(new Set(defaultExpanded));
  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return (
    <ul className={cn("space-y-0.5", className)}>
      {nodes.map((n) => (
        <Node
          key={n.id}
          node={n}
          depth={0}
          expanded={expanded}
          onToggle={toggle}
          onSelect={onSelect}
          selected={selected}
        />
      ))}
    </ul>
  );
}

function Node({
  node,
  depth,
  expanded,
  onToggle,
  onSelect,
  selected,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: string;
}) {
  const hasChildren = !!node.children?.length;
  const open = expanded.has(node.id);
  const isSelected = selected === node.id;

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          onSelect?.(node.id);
        }}
        data-cursor="button"
        className={cn(
          "w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors",
          isSelected
            ? "bg-fuchsia-500/15 text-white"
            : "text-white/80 hover:bg-white/5",
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        {hasChildren ? (
          <motion.svg
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-white/45"
          >
            <path d="M9 6l6 6-6 6" />
          </motion.svg>
        ) : (
          <span className="w-2.5" />
        )}
        {node.icon ? (
          <span className="text-white/60">{node.icon}</span>
        ) : null}
        <span className="truncate">{node.label}</span>
      </button>
      <AnimatePresence initial={false}>
        {hasChildren && open ? (
          <motion.ul
            key="c"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {node.children!.map((c) => (
              <Node
                key={c.id}
                node={c}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                onSelect={onSelect}
                selected={selected}
              />
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
