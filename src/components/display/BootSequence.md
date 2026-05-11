# BootSequence

`BootSequence` renders a vertical timeline of system startup stages. It supports
pending, running, done, failed, and skipped states, optional duration text, and
detail lines for diagnostics.

Use it for VM boot, service startup, environment provisioning, deploy startup,
and guided infrastructure checks.

## Import

```tsx
import { BootSequence, type BootStage } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
const stages: BootStage[] = [
  { id: "bios", label: "BIOS POST", status: "done", duration: 412 },
  { id: "kernel", label: "Kernel handoff", status: "done", duration: 1204 },
  { id: "initrd", label: "initrd", status: "running", detail: "Mounting /home" },
  { id: "ssh", label: "OpenSSH", status: "pending" },
];

<BootSequence stages={stages} />;
```

## Props

- **stages** - `readonly BootStage[]`. Required ordered stage list.
- **className** - extra classes on the root `ol`.

## BootStage

```ts
type BootStage = {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  duration?: number;
  detail?: string;
};
```

`duration` is milliseconds and is formatted with `formatDuration`.

## Behavior

The component renders one ordered-list item per stage. Running stages pulse,
failed stages use a danger tone, and timeline connectors link stages vertically.
It does not advance stages on its own; pass updated status from your job state.

## Accessibility

Stages render as text inside an ordered list, so the sequence remains readable
without animation. Include actionable detail for failures; color alone is not
enough for operators.

## Gotchas

- No polling or state machine is included.
- Durations are display-only and should come from measured backend events.
- Keep labels short; put logs or stack traces in `LogViewer`.

## Related

- `Progress` for single-task progress.
- `LogViewer` for detailed output.
- `StatusBar` for compact job state.
- `Alert` for failed boot summaries.
