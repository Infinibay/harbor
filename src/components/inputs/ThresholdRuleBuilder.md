# ThresholdRuleBuilder

Visual editor for nested boolean rule trees — typically alert /
threshold rules of the form *"CPU > 80% AND (RAM > 90% OR disk >
95%) for 60 seconds"*. Emits a `RuleNode` tree (`Condition` |
`Group`) that mirrors the UI; callers serialize the tree to their
own wire format (PromQL, GraphQL filter, etc.). Use this instead of
`<QueryBuilder>` when the leaf is a `metric op value` predicate
rather than an arbitrary field/operator/value.

## Import

```tsx
import {
  ThresholdRuleBuilder,
  emptyCondition,
  emptyGroup,
} from "@infinibay/harbor/inputs";
import type {
  RuleNode,
  Condition,
  Group,
  ConditionOp,
} from "@infinibay/harbor/inputs";
```

## Example

```tsx
const metrics = [
  { value: "cpu", label: "CPU", unit: "%" },
  { value: "ram", label: "RAM", unit: "%" },
  { value: "disk", label: "Disk", unit: "%" },
] as const;

const [rule, setRule] = useState<RuleNode>(emptyGroup("and"));

<ThresholdRuleBuilder value={rule} onChange={setRule} metrics={metrics} />
```

## Props

- **value** — `RuleNode`. Required. Either a `Condition` (single
  predicate) or a `Group` (with `op: "and" | "or"` and a `children`
  array of nested `RuleNode`s).
- **onChange** — `(next: RuleNode) => void`. Required.
- **metrics** — `readonly { value: string; label: string; unit?: string }[]`.
  Required. Drives the metric `<select>` and the unit hint.
- **className** — extra classes on the wrapper.

## Types

- **ConditionOp** — `">" | ">=" | "<" | "<=" | "==" | "!="`.
- **Condition** — `{ kind: "condition"; id; metric; op; value;
  forSeconds? }`.
- **Group** — `{ kind: "group"; id; op: "and" | "or"; children:
  RuleNode[] }`.

## Helpers

- **emptyCondition(metric?)** — builds a fresh `Condition` (default
  `op: ">"`, `value: 0`, `forSeconds: 60`).
- **emptyGroup(op?)** — builds a `Group` with one empty child
  condition.

## Notes

- `forSeconds` is the dwell time before the rule fires — surfaced as
  the "for N seconds" input next to each condition.
- Toggling a group's badge flips it between `AND` (sky tint) and
  `OR` (amber tint).
- The root node can itself be a single `Condition`; promoting it to
  a group happens implicitly when the user clicks `+ condition` on
  the root.
