# LogViewer

Compact, controlled log table with level filter chips, substring search,
and follow / pause. For streaming with imperative `append()`, ring
buffers, or regex search, use `<LogTailer>`.

## Import

```tsx
import { LogViewer } from "@infinibay/harbor/dev";
```

## Example

```tsx
<LogViewer
  entries={[
    { id: 1, time: new Date(), level: "info",  message: "Server up on :8080" },
    { id: 2, time: new Date(), level: "warn",  source: "cache", message: "Miss for users:42" },
    { id: 3, time: new Date(), level: "error", message: "ECONNREFUSED redis://cache:6379" },
  ]}
  height={320}
/>
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

- **entries** — `LogEntry[]`. Required.
- **height** — `number`. Pixel height of the scroll viewport. Default `320`.
- **autoScroll** — `boolean`. Default `true`. Disabling stops the
  auto-scroll-on-new-entry behavior entirely; the user can still pause
  manually with the Follow/Paused button.
- **className** — extra classes on the root.

## Notes

- Level chips show running counts (`info · 12`).
- Search matches against `source + " " + message`, case-insensitive.
