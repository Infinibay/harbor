# VMConsole

Chrome wrapper around a terminal backend — title bar with status, host
name, resolution, action slot, and Connect / Disconnect / Fullscreen
buttons. Bring your own backend via the `TerminalAdapter` interface
(structurally compatible with `xterm.js`).

## Import

```tsx
import { VMConsole, type TerminalAdapter } from "@infinibay/harbor/dev";
```

## Example (with xterm.js)

```tsx
import { Terminal as XTerm } from "@xterm/xterm";

const adapter: TerminalAdapter = useMemo(() => {
  const xterm = new XTerm();
  return {
    mount: (el) => xterm.open(el),
    unmount: () => xterm.dispose(),
    write: (data) => xterm.write(data),
    onData: (cb) => xterm.onData(cb).dispose,
    resize: (cols, rows) => xterm.resize(cols, rows),
    focus: () => xterm.focus(),
  };
}, []);

<VMConsole
  name="vm-staging-01"
  subtitle="10.0.4.12 · ubuntu 24.04"
  status="online"
  resolution="80×24"
  terminal={adapter}
  onDisconnect={() => closeWebSocket()}
/>;
```

## Example (placeholder, no adapter)

```tsx
<VMConsole
  name="vm-staging-01"
  subtitle="10.0.4.12"
  status="offline"
  onConnect={() => connect()}
/>
```

## TerminalAdapter

```ts
{
  mount(el: HTMLElement): void;
  unmount(): void;
  write(data: string): void;
  onData(cb: (data: string) => void): () => void;
  resize(cols: number, rows: number): void;
  focus?(): void;
}
```

## Props

- **name** — `string`. Required. Title-bar host name.
- **subtitle** — `string`. Secondary line (IP, OS, region).
- **status** — `Status`. Default `"online"`. Driven to `"offline"`
  while disconnected regardless of prop.
- **terminal** — `TerminalAdapter`. When omitted, a static teaser
  `<Terminal>` is rendered.
- **resolution** — `string`. Cosmetic — e.g. `"80×24"`.
- **actions** — `ReactNode`. Top-right slot for power/migrate/snapshot.
- **onDisconnect** / **onConnect** — `() => void`.
- **onFullscreen** — `() => void`. Override the default which calls
  `requestFullscreen()` on the root.
- **height** — `number`. Pixel height of the content area. Default `420`.
- **placeholder** — `ReactNode`. Replaces the static teaser when no
  adapter is wired.
- **className** — extra classes on the wrapper.

## Notes

- Mount/unmount is handled in a `useEffect` keyed on the adapter
  identity — pass a stable reference (e.g. `useMemo`) to avoid churn.
- `onFullscreen` is purely a hook; if you skip it, Harbor falls back to
  the standard Fullscreen API on its root element.
