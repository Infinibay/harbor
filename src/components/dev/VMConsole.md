# VMConsole

`VMConsole` wraps a terminal backend in product chrome: host name, subtitle,
connection status, resolution, action slot, connect/disconnect controls, and
fullscreen support. It is designed for cloud dashboards, VM managers, remote
debugging tools, Tauri desktop apps, and infrastructure admin panels.

Use it when terminal access is part of a larger product workflow. Use `Terminal`
for static command output or demos.

## Import

```tsx
import { VMConsole, type TerminalAdapter } from "@infinibay/harbor/dev";
```

## Basic Usage

Without an adapter, the component renders a static placeholder and optional
Connect action.

```tsx
<VMConsole
  name="prod-api-01"
  subtitle="10.0.4.18 · us-east"
  status="warning"
  resolution="80x24"
  onConnect={() => openSession()}
/>
```

## Terminal Adapter

Wire your own terminal implementation through `TerminalAdapter`. The interface
matches common xterm-style lifecycles.

```tsx
const adapter: TerminalAdapter = {
  mount: (el) => xterm.open(el),
  unmount: () => xterm.dispose(),
  write: (data) => xterm.write(data),
  onData: (cb) => xterm.onData(cb).dispose,
  resize: (cols, rows) => fit(cols, rows),
  focus: () => xterm.focus(),
};

<VMConsole name="worker-7" terminal={adapter} onDisconnect={closeSession} />
```

## Actions

Use `actions` for power, snapshot, migrate, reconnect, or audit controls.

```tsx
<VMConsole name="db-primary" actions={<Button size="sm">Snapshot</Button>} />
```

## Props

- `name`: host or VM name.
- `subtitle`: secondary metadata.
- `status`: connection status; defaults to `online`.
- `terminal`: optional backend adapter.
- `resolution`: display text such as `80x24`.
- `actions`: top-right slot.
- `onDisconnect`, `onConnect`, `onFullscreen`: control callbacks.
- `height`: console body height.
- `placeholder`: custom disconnected content.
- `className`: wrapper class override.

## Accessibility

Connection controls are buttons. If your terminal backend has its own focus and
screen reader behavior, expose that through the adapter and surrounding app
chrome.

Do not rely on status color alone; include host state in nearby text or details.

## Gotchas

Harbor does not ship a terminal emulator. Bring xterm.js, ttyd, a websocket
adapter, or your own backend.

Fullscreen defaults to the browser Fullscreen API on the root element. Override
`onFullscreen` when your desktop shell or router needs custom behavior.

## Related

- `Terminal` for static terminal panels.
- `LogTailer` for streaming logs.
- `StatusDot` for connection state.
- `WindowFrame` for desktop-style chrome.
