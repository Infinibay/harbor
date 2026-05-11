# JsonViewer

`JsonViewer` renders structured data as an expandable, syntax-colored tree. Use it for API responses, webhook payloads, audit metadata, feature flags, configuration previews, debug panels, event details, and admin tools where raw JSON should be inspectable without leaving the app.

It accepts any JavaScript value and renders arrays, objects, strings, numbers, booleans, and null values with Harbor styling.

## Import

```tsx
import { JsonViewer } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
<JsonViewer
  rootLabel="response"
  data={apiResponse}
/>
```

Start collapsed for large payloads:

```tsx
<JsonViewer
  data={webhookPayload}
  defaultExpanded={0}
/>
```

## Props

- **data** - required `unknown`. The value to inspect.
- **rootLabel** - optional string. Defaults to `"$"`.
- **defaultExpanded** - optional number. Defaults to `2`. Nodes with depth lower than this value start open.
- **className** - optional string merged onto the root.

## Expansion Model

Objects and arrays render as collapsible nodes. Closed nodes show the opening bracket, child count, and closing bracket. Open nodes animate their children with Framer Motion. Each nested object or array owns its own open state.

Primitive values render inline. Object keys are quoted; array items omit labels and keep their order.

## Data Guidance

Pass already-sanitized data. `JsonViewer` is a display component, not a security filter. Avoid rendering secrets, access tokens, payment details, or private customer data in admin screens unless the user has explicit permission.

For very large payloads, start collapsed or provide a filtered subset.

## Accessibility

Expandable nodes are buttons, so they can be reached with keyboard navigation. The current tree does not implement full ARIA tree semantics. For developer/admin tools that require deep keyboard inspection, consider adding tree roles or providing a downloadable JSON option.

## Gotchas

- Very large objects can create many React nodes.
- Functions and unsupported values fall back to `String(value)`.
- Circular data structures are not supported.
- `defaultExpanded` only affects initial node state.

## Related

- `DiffViewer` for comparing structured text versions.
- `CodeBlock` for static JSON snippets.
- `YAMLConfigEditor` for editable configuration.
- `DataTable` for tabular records extracted from JSON.
