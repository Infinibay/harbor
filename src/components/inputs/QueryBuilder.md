# QueryBuilder

`QueryBuilder` lets users compose nested `and` / `or` filters without typing a query language. It is useful for audit search, billing filters, log explorers, customer segmentation, feature flag targeting, and admin screens where free-text search is not precise enough.

The component is fully controlled: you provide the query tree, field definitions, and an `onChange` handler. Harbor handles the editing UI; your app serializes the tree to SQL, Elasticsearch, Prisma, a REST payload, or any backend format.

## Import

```tsx
import {
  QueryBuilder,
  emptyQueryGroup,
  type QueryField,
  type QueryNode,
} from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const fields: QueryField[] = [
  { id: "status", label: "Status", kind: "enum", options: [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ] },
  { id: "amount", label: "Amount", kind: "number" },
  { id: "owner", label: "Owner", kind: "string" },
];

const [query, setQuery] = useState<QueryNode>(emptyQueryGroup("and"));

<QueryBuilder value={query} onChange={setQuery} fields={fields} />;
```

## Query Shape

```ts
type QueryNode =
  | { kind: "condition"; id: string; field: string; op: QueryOp; value: string | number | string[] }
  | { kind: "group"; id: string; op: "and" | "or"; children: QueryNode[] };
```

Groups can contain conditions or other groups. Conditions select a field, an operator, and a value editor derived from the field kind.

## Props

- `value`: current `QueryNode`.
- `onChange`: receives the next query tree.
- `fields`: field definitions users can filter by.
- `className`: optional wrapper class.

## Field Definitions

Field `kind` can be `string`, `number`, `enum`, or `date`. Harbor chooses valid default operators per kind. Use `ops` to restrict a field to a smaller set, and `options` for enum values.

## Accessibility

Each remove button has an accessible label, group operator buttons announce the target operator, and value editors use native inputs or Harbor `Select`. Add a visible page title and a live result count near the builder so screen-reader users understand the effect of changes.

## Gotchas

`emptyQueryGroup()` generates random ids for UI editing. If you persist filters, store the resulting tree after user changes, or replace ids with stable server ids during serialization.

## Related

Use with `FilterPanel`, `Select`, `DataTable`, `AuditLog`, `LogTailer`, and `CommandPalette`.
