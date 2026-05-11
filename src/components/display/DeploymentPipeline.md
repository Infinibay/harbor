# DeploymentPipeline

`DeploymentPipeline` visualizes the status of a build, test, deploy, or release pipeline. It renders each stage as a status node with duration, detail text, and animated connectors that show running work.

Use it in developer dashboards, release approvals, CI/CD monitors, admin deploy views, and operational control planes where users need to inspect which stage failed or is still running.

## Import

```tsx
import { DeploymentPipeline, type PipelineStage } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { DeploymentPipeline, type PipelineStage } from "@infinibay/harbor/display";

const stages: PipelineStage[] = [
  { id: "build", name: "Build", status: "success", duration: 84_000 },
  { id: "test", name: "Test", status: "success", duration: 142_000 },
  {
    id: "deploy",
    name: "Deploy",
    status: "running",
    startedAt: Date.now() - 30_000,
    detail: "rolling out 3/6",
  },
  { id: "smoke", name: "Smoke", status: "pending" },
];

export function ReleasePipeline() {
  return <DeploymentPipeline stages={stages} onStageClick={(stage) => console.log(stage.id)} />;
}
```

## Props

- **stages** - `readonly PipelineStage[]`. Required ordered pipeline stages.
- **onStageClick** - `(stage: PipelineStage) => void`. Called when a stage node is clicked.
- **orientation** - `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** - extra classes on the wrapper.

## Stage Model

`status` can be `"pending"`, `"running"`, `"success"`, `"failed"`, `"skipped"`, or `"canceled"`. `duration` is milliseconds. If a running stage has `startedAt` but no `duration`, Harbor derives elapsed time from `Date.now()`.

`detail` is a short secondary line for information such as failing test names, rollout progress, or environment names.

## Behavior

Horizontal mode stays on one row and scrolls if needed. Vertical mode stacks stages and connectors. Running stages pulse, running connectors animate, and failed upstream stages color the following connector as danger.

Every stage is a button, even when `onStageClick` is omitted, so the visual affordance stays consistent.

## Accessibility

Status is rendered as text inside each stage, not only as color. This is important for failed and canceled releases. If stage clicks open a drawer or log panel, move focus into that surface from your application code.

## Gotchas

- Durations are displayed with Harbor's `formatDuration`.
- Derived running duration updates only when the component rerenders.
- `icon` exists on the stage type but is not rendered by the current implementation.
- Long pipelines should live in a horizontally scrollable area or use vertical orientation.

## Related

- `Timeline` for chronological release events.
- `StatusDot` for compact status rows.
- `Terminal` or `LogViewer` for stage logs.
