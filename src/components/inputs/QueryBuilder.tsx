import { useMemo } from "react";
import { cn } from "../../lib/cn";

export type QueryOp =
  | "=="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "contains"
  | "starts-with"
  | "in"
  | "between";

export type QueryFieldKind = "string" | "number" | "enum" | "date";

export interface QueryField {
  id: string;
  label: string;
  kind: QueryFieldKind;
  /** Enum options (only for kind="enum"). */
  options?: readonly { value: string; label: string }[];
  /** Ops this field supports. Default: all ops valid for the kind. */
  ops?: readonly QueryOp[];
}

export interface QueryCondition {
  kind: "condition";
  id: string;
  field: string;
  op: QueryOp;
  value: string | number | string[];
}

export interface QueryGroup {
  kind: "group";
  id: string;
  op: "and" | "or";
  children: QueryNode[];
}

export type QueryNode = QueryCondition | QueryGroup;

export interface QueryBuilderProps {
  value: QueryNode;
  onChange: (next: QueryNode) => void;
  fields: readonly QueryField[];
  className?: string;
}

const DEFAULT_OPS: Record<QueryFieldKind, QueryOp[]> = {
  string: ["==", "!=", "contains", "starts-with", "in"],
  number: ["==", "!=", ">", ">=", "<", "<=", "between"],
  enum: ["==", "!=", "in"],
  date: ["==", ">", "<", "between"],
};

function mkId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
function newCondition(field: string): QueryCondition {
  return { kind: "condition", id: mkId("c"), field, op: "==", value: "" };
}
function newGroup(op: "and" | "or" = "and"): QueryGroup {
  return { kind: "group", id: mkId("g"), op, children: [] };
}

/** Structured AND/OR query builder. Caller defines `fields`; the
 *  component emits a nested `QueryNode` tree users serialize to their
 *  backend however they like (Elasticsearch DSL, SQL WHERE, whatever). */
export function QueryBuilder({ value, onChange, fields, className }: QueryBuilderProps) {
  return (
    <div className={cn("text-xs", className)}>
      <Node
        node={value}
        onChange={onChange}
        fields={fields}
        depth={0}
      />
    </div>
  );
}

function Node({
  node,
  onChange,
  onRemove,
  fields,
  depth,
}: {
  node: QueryNode;
  onChange: (next: QueryNode) => void;
  onRemove?: () => void;
  fields: QueryBuilderProps["fields"];
  depth: number;
}) {
  if (node.kind === "condition") {
    return (
      <ConditionEditor
        value={node}
        onChange={onChange as (next: QueryCondition) => void}
        onRemove={onRemove}
        fields={fields}
      />
    );
  }
  return (
    <GroupEditor
      value={node}
      onChange={onChange as (next: QueryGroup) => void}
      onRemove={onRemove}
      fields={fields}
      depth={depth}
    />
  );
}

function ConditionEditor({
  value,
  onChange,
  onRemove,
  fields,
}: {
  value: QueryCondition;
  onChange: (next: QueryCondition) => void;
  onRemove?: () => void;
  fields: QueryBuilderProps["fields"];
}) {
  const field = fields.find((f) => f.id === value.field);
  const ops = useMemo(() => {
    if (!field) return DEFAULT_OPS.string;
    return field.ops ?? DEFAULT_OPS[field.kind];
  }, [field]);

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <select
        value={value.field}
        onChange={(e) => onChange({ ...value, field: e.target.value })}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40"
      >
        <option value="">field…</option>
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
      <select
        value={value.op}
        onChange={(e) => onChange({ ...value, op: e.target.value as QueryOp })}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40 font-mono"
      >
        {ops.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      {field?.kind === "enum" ? (
        <select
          value={String(value.value)}
          onChange={(e) => onChange({ ...value, value: e.target.value })}
          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40"
        >
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : value.op === "between" ? (
        <BetweenEditor value={value} onChange={onChange} />
      ) : (
        <input
          type={field?.kind === "number" ? "number" : "text"}
          value={Array.isArray(value.value) ? value.value.join(", ") : String(value.value)}
          onChange={(e) =>
            onChange({
              ...value,
              value:
                value.op === "in"
                  ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  : field?.kind === "number"
                    ? Number(e.target.value)
                    : e.target.value,
            })
          }
          placeholder={value.op === "in" ? "a, b, c" : "value"}
          className="min-w-[140px] bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40 tabular-nums font-mono"
        />
      )}
      {onRemove ? (
        <button
          onClick={onRemove}
          className="text-white/30 hover:text-rose-300 ml-1"
          title="Remove condition"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

function BetweenEditor({
  value,
  onChange,
}: {
  value: QueryCondition;
  onChange: (next: QueryCondition) => void;
}) {
  const pair = Array.isArray(value.value) ? value.value : ["", ""];
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={pair[0] ?? ""}
        onChange={(e) => onChange({ ...value, value: [e.target.value, pair[1] ?? ""] })}
        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40 tabular-nums font-mono"
      />
      <span className="text-white/40">and</span>
      <input
        type="number"
        value={pair[1] ?? ""}
        onChange={(e) => onChange({ ...value, value: [pair[0] ?? "", e.target.value] })}
        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40 tabular-nums font-mono"
      />
    </div>
  );
}

function GroupEditor({
  value,
  onChange,
  onRemove,
  fields,
  depth,
}: {
  value: QueryGroup;
  onChange: (next: QueryGroup) => void;
  onRemove?: () => void;
  fields: QueryBuilderProps["fields"];
  depth: number;
}) {
  const ringCls =
    value.op === "and"
      ? "border-sky-400/30 bg-sky-500/[0.04]"
      : "border-amber-400/30 bg-amber-500/[0.04]";
  const defaultField = fields[0]?.id ?? "";
  return (
    <div
      className={cn(
        "relative rounded-lg border pl-2 pr-2 py-1.5",
        ringCls,
        depth > 0 && "ml-2",
      )}
    >
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => onChange({ ...value, op: value.op === "and" ? "or" : "and" })}
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
            onChange({
              ...value,
              children: [...value.children, newCondition(defaultField)],
            })
          }
          className="h-6 px-2 text-[10px] rounded text-white/70 hover:bg-white/5"
        >
          + condition
        </button>
        <button
          onClick={() =>
            onChange({
              ...value,
              children: [...value.children, newGroup()],
            })
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
        {value.children.length === 0 ? (
          <div className="text-xs text-white/30 italic py-2">
            Empty group — add a condition.
          </div>
        ) : (
          value.children.map((child, idx) => (
            <Node
              key={child.id}
              node={child}
              onChange={(next) => {
                const children = value.children.slice();
                children[idx] = next;
                onChange({ ...value, children });
              }}
              onRemove={() => {
                onChange({
                  ...value,
                  children: value.children.filter((_, i) => i !== idx),
                });
              }}
              fields={fields}
              depth={depth + 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function emptyQueryGroup(op: "and" | "or" = "and"): QueryGroup {
  return newGroup(op);
}
