# QueryBuilder

Structured AND/OR predicate builder for filter UIs. The caller declares
the available `fields` (with kind: `string` / `number` / `enum` /
`date`) and the component emits a nested `QueryNode` tree of groups and
conditions you can serialize to whatever your backend speaks
(Elasticsearch DSL, SQL `WHERE`, GraphQL filter input, etc.). Reach for
this when a single text query box isn't expressive enough but a
hand-rolled "advanced filters" form would explode in scope.

## Import

```tsx
import {
  QueryBuilder,
  emptyQueryGroup,
  type QueryNode,
  type QueryField,
} from "@infinibay/harbor/inputs";
```

## Example

```tsx
const fields: QueryField[] = [
  { id: "name", label: "Name", kind: "string" },
  { id: "cpu", label: "vCPUs", kind: "number" },
  {
    id: "status",
    label: "Status",
    kind: "enum",
    options: [
      { value: "running", label: "Running" },
      { value: "stopped", label: "Stopped" },
    ],
  },
];

const [query, setQuery] = useState<QueryNode>(emptyQueryGroup("and"));

<QueryBuilder value={query} onChange={setQuery} fields={fields} />;
```

## Props

- **value** — `QueryNode`. Required. The root node — typically a
  `QueryGroup` produced by `emptyQueryGroup()`.
- **onChange** — `(next: QueryNode) => void`. Required. Fired on every
  edit; the consumer is responsible for persisting the tree.
- **fields** — `readonly QueryField[]`. Required. Available fields the
  user can build conditions over.
- **className** — extra classes on the root wrapper.

## Types

- **QueryNode** — `QueryCondition | QueryGroup`.
- **QueryGroup** — `{ kind: "group"; id; op: "and" | "or"; children: QueryNode[] }`.
- **QueryCondition** — `{ kind: "condition"; id; field; op: QueryOp; value }`.
- **QueryOp** — `"==" | "!=" | ">" | ">=" | "<" | "<=" | "contains" | "starts-with" | "in" | "between"`.
- **QueryField** — `{ id; label; kind: "string" | "number" | "enum" | "date"; options?; ops? }`.

## Notes

- The set of operators offered per field defaults to the kind (e.g.
  `number` shows comparisons + `between`, `enum` shows equality + `in`).
  Override with `field.ops` to constrain.
- `op: "in"` value is a comma-split `string[]`; `op: "between"` value is
  a `[a, b]` numeric pair. Everything else is a scalar string or
  number.
- `emptyQueryGroup(op?)` is a helper for seeding state — defaults to
  an empty `and` group.
- The builder doesn't validate semantics (e.g. `name >= 5` is allowed
  if `name` is a string field with `>=` in `ops`). Pre-filter `ops`
  per field if that matters.
