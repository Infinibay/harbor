# TraceWaterfall

`TraceWaterfall` visualizes distributed traces as nested spans across a shared
time axis. It is the Harbor component for "where did the request spend time?"
views: API gateways, database calls, queue waits, background jobs, RPC calls, and
third-party integrations.

Use it when span timing and parent-child structure matter. Use `Timeline` for
human-readable milestones and `FlameGraph` when aggregate stack cost matters
more than one request.

## Import

```tsx
import { TraceWaterfall } from "@infinibay/harbor/charts";
```

## Basic Usage

Pass spans with `start` and `duration` in milliseconds. Root spans omit
`parent`; child spans reference a parent span id.

```tsx
<TraceWaterfall
  spans={[
    { id: "root", name: "POST /checkout", start: 0, duration: 840 },
    { id: "auth", parent: "root", name: "Auth service", start: 28, duration: 120 },
    { id: "db", parent: "root", name: "Create order", start: 180, duration: 390 },
    { id: "stripe", parent: "root", name: "Payment provider", start: 600, duration: 210 },
  ]}
/>
```

## Interaction

Children are expanded by default. Parent rows include a collapse button. Use
`onSpanClick` to open a details drawer, inspector, log panel, or related metric.

```tsx
<TraceWaterfall
  spans={trace.spans}
  header={<TraceSummary trace={trace} />}
  onSpanClick={(span) => setSelectedSpan(span)}
/>
```

## SpanBar

`SpanBar` is exported for custom trace rows. It paints one duration bar against a
known `totalMs` value.

```tsx
<SpanBar
  name="Database query"
  start={120}
  duration={86}
  totalMs={900}
  status="pending"
/>
```

## Props

- `spans`: required trace spans.
- `totalMs`: optional time window override; defaults to the latest span end.
- `onSpanClick`: called with the clicked span.
- `header`: optional content above the axis.
- `className`: wrapper class override.

Each span includes `id`, `name`, `start`, `duration`, optional `status`, optional
`parent`, optional `tags`, and optional `color`.

## Accessibility

Collapse controls are buttons with expanded state. Clickable span bars expose
button semantics and keyboard activation. The row label remains visible outside
the bar so short spans are still readable.

Do not rely on bar color alone for status. Pair `status="error"` with detail in
the selected span drawer, header summary, or adjacent alert.

## Gotchas

The component does not sort the original root list beyond start time inside each
tree level. Send spans with stable ids and parent relationships.

Very tiny spans are clamped to a minimum visible width. The visual width helps
selection but should not be interpreted as exact timing for sub-millisecond
events.

## Related

- `FlameGraph` for aggregate stack time.
- `TimeSeriesChart` for latency over time.
- `LogTailer` for logs tied to selected spans.
- `Drawer` or `Inspector` for span details.
