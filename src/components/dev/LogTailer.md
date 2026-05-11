# LogTailer

`LogTailer` is a streaming log panel for developer tools, admin consoles, build
systems, deployment pages, and desktop workbenches. It keeps a rolling buffer,
filters by level, searches by text or regex, and follows the bottom until the
user scrolls up.

Use it when logs are actively arriving. Use `LogViewer` for static logs and
`Terminal` when the user is typing commands.

## Import

```tsx
import { LogTailer, type LogTailerHandle } from "@infinibay/harbor/dev";
```

## Basic Usage

For controlled data, pass a growing `entries` array from your app state.

```tsx
<LogTailer
  entries={deploymentLogs}
  height={420}
  onFollowChange={(following) => analytics.track("log_follow", { following })}
/>
```

Each entry uses the `LogViewer` shape: `id`, `time`, `level`, optional `source`,
and `message`.

## Imperative Streaming

For SSE, WebSocket, or process output, attach a ref and call `append`.

```tsx
const tailer = useRef<LogTailerHandle>(null);

useEffect(() => {
  const stream = new EventSource("/api/builds/42/logs");
  stream.onmessage = (event) => {
    tailer.current?.append(JSON.parse(event.data));
  };
  return () => stream.close();
}, []);

return <LogTailer ref={tailer} bufferSize={5000} />;
```

Call `clear()` when a build restarts and `scrollToBottom()` when the user clicks
an external "jump to latest" command.

## Filtering

Level chips toggle `debug`, `info`, `warn`, and `error`. The search field uses
case-insensitive substring matching by default. Enable the `.*` chip to treat
the search as a regex; invalid regex input falls back to substring matching.

## Props

- `entries`: optional controlled log array.
- `bufferSize`: retained entry count for imperative mode; defaults to `10000`.
- `height`: scroll viewport height in pixels.
- `levels`: initially visible levels.
- `searchPlaceholder`: custom search placeholder.
- `onFollowChange`: called when follow mode pauses or resumes.
- `className`: wrapper class override.

## Accessibility

Level filters and regex mode are real toggle buttons with pressed state. The
search field has an accessible label. When follow mode is paused, the Resume
button returns to the latest log line.

For critical errors, do not rely on the log panel alone. Surface important state
in a `Banner`, `Alert`, or page status summary.

## Gotchas

If `entries` is provided, the component is controlled and `append()` does
nothing. In that mode your state owner is responsible for adding and trimming
entries.

Follow mode pauses when the user scrolls away from the bottom. New logs still
arrive; the panel simply stops forcing scroll position.

## Related

- `LogViewer` for static logs.
- `Terminal` for command-oriented sessions.
- `FindBar` for external find controls.
- `StatusBar` for compact process state.
