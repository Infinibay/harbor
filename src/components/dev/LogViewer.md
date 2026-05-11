# LogViewer

`LogViewer` renders a dense, filterable stream of log entries with level
toggles, text search, optional auto-follow, source labels, and an empty state. It
is built for developer consoles, deployment pages, workers, import jobs, webhook
debugging, and infrastructure tools where users need to inspect recent output
without leaving the app.

The component owns filtering UI locally. Your application owns fetching,
streaming, retention, severity mapping, and any action that follows from an
error.

## Import

```tsx
import { LogViewer, type LogEntry } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
const entries: LogEntry[] = [
  {
    id: "1",
    time: new Date(),
    level: "info",
    source: "api",
    message: "Server listening on :8080",
  },
  {
    id: "2",
    time: "12:04:18",
    level: "error",
    source: "redis",
    message: "Connection refused",
  },
];

<LogViewer entries={entries} height={360} autoScroll />;
```

For streaming logs, append new entries in your parent state and let auto-scroll
follow them until the user pauses.

## Props

- **entries** - `LogEntry[]`. Required. The full list to display and filter.
- **height** - `number`. Scroll viewport height in pixels. Default `320`.
- **autoScroll** - `boolean`. Scrolls to the bottom when filtered entries change,
  unless the viewer is paused. Default `true`.
- **className** - extra classes on the wrapper.

## LogEntry

```ts
type LogEntry = {
  id: string | number;
  time: string | Date;
  level: "debug" | "info" | "warn" | "error";
  source?: string;
  message: string;
};
```

String times are rendered as-is. `Date` values are formatted with
`toLocaleTimeString` using 24-hour output.

## Interaction

The toolbar includes a text filter and one toggle per log level. Search matches
against `source` and `message`, case-insensitively. Level counts are calculated
from all entries, not only the filtered result.

The `Follow` button controls local pause state. When paused, new entries can
arrive without forcing the scroll position to the bottom.

## Accessibility

Log lines are rendered as text, so they remain selectable and readable. Keep
messages concise and include the actionable source in either `source` or the
message itself.

For critical errors, do not rely on the log row alone. Pair the viewer with an
`Alert`, failed status, retry action, or incident detail surface.

## Gotchas

- This is not virtualized. Use a bounded log window or a virtualized list for
  very large streams.
- Filtering is client-side only.
- `autoScroll` follows the filtered result. If filters hide new rows, users will
  not see those hidden entries until they change filters.
- The component does not parse ANSI color codes or structured JSON.

## Related

- `Terminal` for command-style output.
- `ScrollArea` for custom scroll containers.
- `Alert` and `Banner` for important failures.
- `StatusBar` for compact job state.
