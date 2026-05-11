# Terminal

`Terminal` renders a styled terminal or console log surface with typed lines, prompts, auto-scroll, and Harbor terminal theme tokens. Use it for install guides, deployment logs, local dev output, command previews, sandbox consoles, and build status panels.

It displays lines only. It is not an interactive shell.

## Import

```tsx
import { Terminal, type TerminalLine } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
import { Terminal, type TerminalLine } from "@infinibay/harbor/dev";

const lines: TerminalLine[] = [
  { id: 1, kind: "cmd", text: "npm install @infinibay/harbor" },
  { id: 2, kind: "out", text: "added 110 packages in 14s" },
  { id: 3, kind: "cmd", text: "npm run dev" },
  { id: 4, kind: "info", text: "Local: http://localhost:5174/" },
];

export function InstallTerminal() {
  return <Terminal title="~/work/app" lines={lines} height={280} />;
}
```

## Props

- **lines** - `TerminalLine[]`. Required ordered output lines.
- **prompt** - `string`. Prompt shown before `cmd` lines. Default `"$"`.
- **title** - `string`. Header title. Default `"terminal"`.
- **height** - `number | string`. Scroll area height. Default `260`.
- **autoScroll** - `boolean`. Default `true`.
- **variant** - `"window" | "console"`. Default `"window"`.
- **className** - extra classes on the wrapper.

## Line Model

```ts
type TerminalLine = {
  id: string | number;
  kind?: "out" | "cmd" | "err" | "info";
  text: ReactNode;
};
```

`cmd` lines receive the prompt. `err` and `info` use terminal error and info tokens. `text` accepts `ReactNode`, but plain strings are easiest to scan and copy.

## Behavior

When `autoScroll` is true, the scroll container moves to the bottom whenever `lines` changes. Lines animate in with a small x offset. The terminal always renders a pulsing cursor at the bottom.

`window` variant shows macOS-style dots and a header. `console` uses a compact title strip and workbench radius.

## Accessibility

The component does not currently expose live-region semantics. For live build output, wrap updates in an accessible log region or provide a textual status summary. Avoid using color alone to distinguish errors; include clear error text.

## Gotchas

- This is read-only. It does not capture input.
- `autoScroll` is tied to the `lines` array reference and content updates.
- Very long logs should be virtualized or paginated.
- Keep line ids stable to avoid unnecessary re-animation.

## Related

- `LogViewer` for searchable structured logs.
- `LogTailer` for live log streams.
- `CodeBlock` for static commands and snippets.
