import { Stepper } from "./Stepper";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const steps = [
  { id: "1", label: "Account" },
  { id: "2", label: "Workspace" },
  { id: "3", label: "Plan" },
  { id: "4", label: "Confirm" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepperDemo(props: any) {
  return <Stepper {...props} steps={steps} />;
}

export const playground: PlaygroundManifest = {
  component: StepperDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    current: { type: "number", default: 1, min: 0, max: 3 },
    orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
  },
  variants: [
    { label: "Step 1", props: { current: 0 } },
    { label: "Step 3", props: { current: 2 } },
    { label: "Vertical", props: { current: 1, orientation: "vertical" } },
  ],
};
