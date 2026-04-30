# TraceWaterfall

Jaeger / Lightstep-style nested span waterfall. Each row is a `<SpanBar>` placed against a shared time axis; child spans indent under their parent and fold/unfold via the chevron. Use for distributed traces or any timeline of parent/child operations; for self-inclusive call stacks (no overlap) use `FlameGraph`.

## Import

```tsx
import { TraceWaterfall } from "@infinibay/harbor/charts";
```

## Example

```tsx
<TraceWaterfall
  spans={[
    { id: "req",  name: "POST /orders",       start:   0, duration: 480, status: "ok" },
    { id: "auth", name: "auth.verify",        start:  10, duration:  35, parent: "req" },
    { id: "db",   name: "db.query orders",    start:  60, duration: 180, parent: "req" },
    { id: "ext",  name: "stripe.charge",      start: 260, duration: 200, parent: "req", status: "error" },
    { id: "log",  name: "kafka.publish",      start: 470, duration:  10, parent: "req" },
  ]}
  onSpanClick={(s) => console.log(s.id)}
/>
```

## Props

- **spans** — `readonly Span[]`. Each `{ id, name, start, duration, status?, parent?, tags?, color? }`. Times in ms, relative to the trace start. `parent` omitted = root.
- **totalMs** — override the time axis. Default: `max(start + duration)` across spans.
- **onSpanClick** — `(span) => void`. Fires on bar click.
- **header** — slot above the axis (title, summary, filters).
- **className** — wrapper class.

The `<SpanBar>` row component is also exported for ad-hoc waterfalls.

## Notes

- Status drives the default bar color: `ok` green, `error` red, `pending` amber. Per-span `color` overrides.
- All rows start expanded; the chevron toggles each subtree.
- The bar width is clamped to a minimum of 0.3 % so 0 ms spans remain clickable.
- Tooltip (`title=`) shows the full duration plus a JSON dump of `tags`.
