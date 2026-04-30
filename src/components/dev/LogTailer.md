# LogTailer

Streaming log pane with level filters, regex search, follow mode, and a
ring buffer. Two ways to drive it:

1. **Controlled** — pass `entries` as a growing array.
2. **Imperative** — attach a ref and call `append()` / `clear()` /
   `scrollToBottom()` from outside (best for SSE / WebSocket).

For a simpler, controlled-only viewer use `<LogViewer>`.

## Import

```tsx
import { LogTailer, type LogTailerHandle } from "@infinibay/harbor/dev";
```

## Example (imperative)

```tsx
const ref = useRef<LogTailerHandle>(null);

useEffect(() => {
  const es = new EventSource("/logs");
  es.onmessage = (e) => {
    const entry = JSON.parse(e.data);
    ref.current?.append(entry);
  };
  return () => es.close();
}, []);

<LogTailer ref={ref} bufferSize={5_000} height={420} />;
```

## LogEntry

```ts
{
  id: string | number;
  time: string | Date;
  level: "debug" | "info" | "warn" | "error";
  source?: string;
  message: string;
}
```

## Props

- **entries** — `readonly LogEntry[]`. Optional. When provided, the
  component is controlled and `append`/`clear` no-op.
- **bufferSize** — `number`. Imperative-mode ring buffer cap. Default `10000`.
- **height** — `number`. Pixel height of the scroll viewport. Default `360`.
- **levels** — `LogLevel[]`. Initially-enabled level chips.
  Default `["debug","info","warn","error"]`.
- **searchPlaceholder** — `string`. Default `"Search (regex supported)…"`.
- **onFollowChange** — `(following: boolean) => void`.
- **className** — extra classes on the root.

## Imperative handle

```ts
{
  append(entry: LogEntry | LogEntry[]): void;  // no-op when controlled
  clear(): void;                               // no-op when controlled
  scrollToBottom(): void;
  readonly following: boolean;
}
```

## Notes

- Follow auto-pauses when the user scrolls up; a "Resume ↓" button
  brings it back. `onFollowChange` fires on every flip.
- The `.* ` button toggles regex search; invalid regex falls back to
  substring matching silently.
