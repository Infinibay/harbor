# Terminal

Stylized fake-terminal panel for showing scripted command flows
(onboarding tours, docs, demos). It is **not** a real PTY — for an
interactive terminal use `<VMConsole>` with a `TerminalAdapter`
(typically xterm.js).

## Import

```tsx
import { Terminal } from "@infinibay/harbor/dev";
```

## Example

```tsx
<Terminal
  title="~/work/harbor-site"
  height={260}
  lines={[
    { id: 1, kind: "cmd", text: "npm install @infinibay/harbor" },
    { id: 2, kind: "out", text: "added 110 packages in 14s" },
    { id: 3, kind: "cmd", text: "npm run dev" },
    { id: 4, kind: "out", text: "VITE v8.0.10 ready in 482 ms" },
    { id: 5, kind: "info", text: "  ➜  Local: http://localhost:5174/" },
  ]}
/>
```

## TerminalLine

```ts
{
  id: string | number;
  kind?: "out" | "cmd" | "err" | "info";  // default "out"
  text: ReactNode;
}
```

`kind: "cmd"` lines render with the prompt prefix.

## Props

- **lines** — `TerminalLine[]`. Required.
- **prompt** — `string`. Default `"$"`.
- **title** — `string`. Window title. Default `"terminal"`.
- **height** — `number | string`. Default `260`.
- **autoScroll** — `boolean`. Default `true`.
- **className** — extra classes on the wrapper.

## Notes

- Lines animate in via `<AnimatePresence>` — push to the array to
  simulate real-time output.
- A blinking caret is always rendered at the bottom for ambience.
