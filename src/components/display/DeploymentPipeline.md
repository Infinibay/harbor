# DeploymentPipeline

Horizontal (or vertical) pipeline of deployment / CI stages with status
chips, animated running connectors, and click-to-drill behavior. For
boot-time stages with detail logs use `<BootSequence>`.

## Import

```tsx
import { DeploymentPipeline } from "@infinibay/harbor/display";
```

## Example

```tsx
<DeploymentPipeline
  stages={[
    { id: "build",  name: "Build",   status: "success", duration: 84_000 },
    { id: "test",   name: "Test",    status: "success", duration: 142_000 },
    { id: "deploy", name: "Deploy",  status: "running", startedAt: Date.now() - 30_000 },
    { id: "smoke",  name: "Smoke",   status: "pending" },
  ]}
  onStageClick={(s) => navigate(`/runs/${runId}#${s.id}`)}
/>
```

## PipelineStage

```ts
{
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failed" | "skipped" | "canceled";
  startedAt?: Date | string | number;
  duration?: number;     // ms — derived from startedAt while running if omitted
  icon?: string;         // currently unused — reserved
  detail?: string;       // sub-line under the status chip
}
```

## Props

- **stages** — `readonly PipelineStage[]`. Required.
- **onStageClick** — `(stage: PipelineStage) => void`.
- **orientation** — `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** — extra classes on the wrapper.

## Notes

- Connectors animate when either side is running; they tint red after a
  failed stage.
- While `status === "running"`, the chip pulses (Tailwind `animate-pulse`).
- Durations format via `lib/format.formatDuration`.
