import { useMemo, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ConditionOp = ">" | ">=" | "<" | "<=" | "==" | "!=";

export interface Condition {
  kind: "condition";
  id: string;
  metric: string;
  op: ConditionOp;
  value: number;
  /** "for N seconds / minutes" duration before firing. */
  forSeconds?: number;
}

export interface Group {
  kind: "group";
  id: string;
  op: "and" | "or";
  children: RuleNode[];
}

export type RuleNode = Condition | Group;

export interface ThresholdRuleBuilderProps {
  value: RuleNode;
  onChange: (next: RuleNode) => void;
  /** Available metric options (shown in the metric select). */
  metrics: readonly { value: string; label: string; unit?: string }[];
  className?: string;
}

let idCounter = 0;
function newId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 5)}`;
}

export function emptyCondition(metric = ""): Condition {
  return {
    kind: "condition",
    id: newId("c"),
    metric,
    op: ">",
    value: 0,
    forSeconds: 60,
  };
}

export function emptyGroup(op: "and" | "or" = "and"): Group {
  return { kind: "group", id: newId("g"), op, children: [emptyCondition()] };
}

/** Visual builder for alert / threshold rules. Emits a nested
 *  `RuleNode` tree that mirrors the UI — callers serialize to their
 *  own wire format. */
export function ThresholdRuleBuilder({
  value,
  onChange,
  metrics,
  className,
}: ThresholdRuleBuilderProps) {
  return (
    <div className={cn("text-xs", className)}>
      <RuleNodeEditor
        node={value}
        onChange={onChange}
        onReplaceWithGroup={(op) =>
          onChange({ kind: "group", id: newId("g"), op, children: [value] })
        }
        metrics={metrics}
        depth={0}
      />
    </div>
  );
}

interface EditorProps {
  node: RuleNode;
  onChange: (next: RuleNode) => void;
  onRemove?: () => void;
  onReplaceWithGroup?: (op: "and" | "or") => void;
  metrics: ThresholdRuleBuilderProps["metrics"];
  depth: number;
}

function RuleNodeEditor({
  node,
  onChange,
  onRemove,
  metrics,
  depth,
}: EditorProps): ReactNode {
  if (node.kind === "condition") {
    return (
      <ConditionEditor
        value={node}
        onChange={onChange}
        onRemove={onRemove}
        metrics={metrics}
      />
    );
  }
  return (
    <GroupEditor
      value={node}
      onChange={onChange}
      onRemove={onRemove}
      metrics={metrics}
      depth={depth}
    />
  );
}

function ConditionEditor({
  value,
  onChange,
  onRemove,
  metrics,
}: {
  value: Condition;
  onChange: (next: Condition) => void;
  onRemove?: () => void;
  metrics: ThresholdRuleBuilderProps["metrics"];
}) {
  const metric = metrics.find((m) => m.value === value.metric);
  const unit = metric?.unit;
  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <select
        value={value.metric}
        onChange={(e) => onChange({ ...value, metric: e.target.value })}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white outline-none focus:border-fuchsia-400/40 text-xs"
      >
        <option value="">metric…</option>
        {metrics.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <select
        value={value.op}
        onChange={(e) => onChange({ ...value, op: e.target.value as ConditionOp })}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white outline-none focus:border-fuchsia-400/40 text-xs font-mono"
      >
        {([">", ">=", "<", "<=", "==", "!="] as ConditionOp[]).map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={value.value}
        onChange={(e) => onChange({ ...value, value: Number(e.target.value) })}
        className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-white outline-none focus:border-fuchsia-400/40 text-xs tabular-nums"
      />
      {unit ? <span className="text-white/40">{unit}</span> : null}
      <span className="text-white/40 text-[11px]">for</span>
      <input
        type="number"
        min={0}
        value={value.forSeconds ?? 0}
        onChange={(e) => onChange({ ...value, forSeconds: Number(e.target.value) })}
        className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white outline-none focus:border-fuchsia-400/40 text-xs tabular-nums"
      />
      <span className="text-white/40 text-[11px]">seconds</span>
      {onRemove ? (
        <button
          onClick={onRemove}
          className="text-white/30 hover:text-rose-300 ml-1"
          title="Remove"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

function GroupEditor({
  value,
  onChange,
  onRemove,
  metrics,
  depth,
}: {
  value: Group;
  onChange: (next: Group) => void;
  onRemove?: () => void;
  metrics: ThresholdRuleBuilderProps["metrics"];
  depth: number;
}) {
  const isRoot = depth === 0;
  const ringCls = useMemo(
    () =>
      ({
        and: "border-sky-400/30 bg-sky-500/[0.04]",
        or: "border-amber-400/30 bg-amber-500/[0.04]",
      })[value.op],
    [value.op],
  );
  return (
    <div
      className={cn(
        "relative rounded-lg border pl-2 pr-2 py-1.5",
        ringCls,
        isRoot ? "" : "ml-2",
      )}
    >
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() =>
            onChange({ ...value, op: value.op === "and" ? "or" : "and" })
          }
          className={cn(
            "h-6 px-2 text-[10px] uppercase tracking-widest rounded font-semibold",
            value.op === "and"
              ? "bg-sky-500/20 text-sky-200"
              : "bg-amber-500/20 text-amber-200",
          )}
        >
          {value.op}
        </button>
        <button
          onClick={() =>
            onChange({ ...value, children: [...value.children, emptyCondition()] })
          }
          className="h-6 px-2 text-[10px] rounded text-white/70 hover:bg-white/5"
        >
          + condition
        </button>
        <button
          onClick={() =>
            onChange({ ...value, children: [...value.children, emptyGroup()] })
          }
          className="h-6 px-2 text-[10px] rounded text-white/70 hover:bg-white/5"
        >
          + group
        </button>
        {onRemove ? (
          <button
            onClick={onRemove}
            className="ml-auto text-white/30 hover:text-rose-300"
            title="Remove group"
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="pl-1 flex flex-col gap-1">
        {value.children.map((child, idx) => (
          <RuleNodeEditor
            key={child.id}
            node={child}
            onChange={(next) => {
              const children = value.children.slice();
              children[idx] = next;
              onChange({ ...value, children });
            }}
            onRemove={() => {
              const children = value.children.filter((_, i) => i !== idx);
              onChange({ ...value, children });
            }}
            metrics={metrics}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}
