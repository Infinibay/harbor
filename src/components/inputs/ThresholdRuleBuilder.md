# ThresholdRuleBuilder

`ThresholdRuleBuilder` lets users compose alert logic visually. It emits a
nested rule tree made of conditions and groups, where each condition compares a
metric to a value for a duration and each group combines children with `and` or
`or`.

Use it for alerting, automation, monitoring policies, billing thresholds, and
workflow triggers.

## Import

```tsx
import {
  ThresholdRuleBuilder,
  emptyCondition,
  emptyGroup,
  type RuleNode,
} from "@infinibay/harbor/inputs";
```

## Basic Usage

Keep the rule tree in state and serialize it to your own backend format.

```tsx
const [rule, setRule] = useState<RuleNode>(emptyGroup("and"));

<ThresholdRuleBuilder
  value={rule}
  onChange={setRule}
  metrics={[
    { value: "latency_p95", label: "P95 latency", unit: "ms" },
    { value: "error_rate", label: "Error rate", unit: "%" },
  ]}
/>
```

## Rule Shape

A condition has `metric`, `op`, `value`, and optional `forSeconds`.

```tsx
{
  kind: "condition",
  id: "c-1",
  metric: "latency_p95",
  op: ">",
  value: 500,
  forSeconds: 120,
}
```

A group has `op` and child nodes.

## Props

- `value`: required rule node tree.
- `onChange`: receives the next rule tree.
- `metrics`: available metric options with optional unit.
- `className`: wrapper class override.

Helpers `emptyCondition` and `emptyGroup` create valid starter nodes.

## Accessibility

Inputs and select controls include labels for metric, operator, value, duration,
and removal actions. For production alerting, show a readable summary beside or
below the builder so users can verify the rule before saving.

## Gotchas

Generated ids are client-side conveniences. Your backend can replace them with
stable ids when persisting rules.

The component does not evaluate rules. It only edits the tree; your monitoring
system owns execution semantics.

## Related

- `FormField` for surrounding labels and errors.
- `Select` and `NumberField` for simpler threshold forms.
- `MetricCard` for showing the metric being guarded.
- `Banner` or `Alert` for rule validation feedback.
