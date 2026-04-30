import { useState } from "react";
import { QueryBuilder, emptyQueryGroup, type QueryNode, type QueryField } from "./QueryBuilder";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const fields: QueryField[] = [
  { id: "name", label: "Name", kind: "string" },
  { id: "cpu", label: "vCPUs", kind: "number" },
  { id: "memory", label: "Memory (GB)", kind: "number" },
  {
    id: "status",
    label: "Status",
    kind: "enum",
    options: [
      { value: "running", label: "Running" },
      { value: "stopped", label: "Stopped" },
      { value: "error", label: "Error" },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QueryBuilderDemo(props: any) {
  const [value, setValue] = useState<QueryNode>(() => ({
    kind: "group",
    id: "root",
    op: "and",
    children: [
      { kind: "condition", id: "c1", field: "status", op: "==", value: "running" },
      { kind: "condition", id: "c2", field: "cpu", op: ">=", value: 4 },
    ],
  }));
  return (
    <div className="w-full max-w-2xl">
      <QueryBuilder
        {...props}
        fields={fields}
        value={value}
        onChange={(next: QueryNode) => {
          setValue(next);
          props.onChange?.(next);
        }}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: QueryBuilderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  variants: [
    { label: "Default", props: {} },
    {
      label: "Empty group",
      props: { __seed: "empty" },
    },
  ],
  events: [{ name: "onChange", signature: "(next: QueryNode) => void" }],
  notes: "Caller owns the QueryNode tree. Use `emptyQueryGroup()` to seed an empty AND group.",
};

// Re-export so consumers can grab it from the same module.
export { emptyQueryGroup };
