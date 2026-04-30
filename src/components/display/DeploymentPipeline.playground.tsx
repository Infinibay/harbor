import { DeploymentPipeline, type PipelineStage } from "./DeploymentPipeline";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const stages: PipelineStage[] = [
  { id: "build", name: "Build", status: "success", duration: 84_000 },
  { id: "test", name: "Test", status: "success", duration: 142_000 },
  { id: "deploy", name: "Deploy", status: "running", startedAt: Date.now() - 30_000, detail: "rolling out 3/6" },
  { id: "smoke", name: "Smoke", status: "pending" },
];

const failedStages: PipelineStage[] = [
  { id: "build", name: "Build", status: "success", duration: 84_000 },
  { id: "test", name: "Test", status: "failed", duration: 21_000, detail: "auth.spec.ts (3 failing)" },
  { id: "deploy", name: "Deploy", status: "skipped" },
  { id: "smoke", name: "Smoke", status: "skipped" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeploymentPipelineDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 760 }}>
      <DeploymentPipeline
        stages={props.failed ? failedStages : stages}
        orientation={props.orientation}
        onStageClick={(s) => props.onStageClick?.(s.id)}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: DeploymentPipelineDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    failed: { type: "boolean", default: false, description: "Toggle the failed-pipeline variant." },
  },
  variants: [
    { label: "Horizontal · running", props: { orientation: "horizontal", failed: false } },
    { label: "Horizontal · failed", props: { orientation: "horizontal", failed: true } },
    { label: "Vertical", props: { orientation: "vertical", failed: false } },
  ],
  events: [{ name: "onStageClick", signature: "(stage: PipelineStage) => void" }],
};
