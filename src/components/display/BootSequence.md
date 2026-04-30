# BootSequence

Vertical timeline of boot stages (BIOS → kernel → init → services).
Running stages pulse, durations are auto-formatted, failed stages get a
red accent. For incidents / deployment timelines see `<IncidentTimeline>`
or `<DeploymentPipeline>`.

## Import

```tsx
import { BootSequence } from "@infinibay/harbor/display";
```

## Example

```tsx
<BootSequence
  stages={[
    { id: "bios",    label: "BIOS POST",       status: "done",    duration: 412 },
    { id: "kernel",  label: "Kernel handoff",  status: "done",    duration: 1_204 },
    { id: "initrd",  label: "initrd",          status: "running", detail: "Mounting /home" },
    { id: "systemd", label: "systemd targets", status: "pending" },
    { id: "ssh",     label: "OpenSSH",         status: "pending" },
  ]}
/>
```

## BootStage

```ts
{
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  duration?: number;   // milliseconds, only meaningful for done/failed
  detail?: string;     // sub-line, monospaced
}
```

## Props

- **stages** — `readonly BootStage[]`. Required. Render order is the
  array order — the component does not reorder.
- **className** — extra classes on the wrapper.

## Notes

- Durations are formatted with `lib/format.formatDuration` (`includeMs: true`).
- The status dot animates with a 1s pulse loop only when status is
  `"running"`.
- The connector line is omitted on the last stage.
