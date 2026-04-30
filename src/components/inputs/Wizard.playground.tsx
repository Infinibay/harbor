import { useState } from "react";
import { Wizard, type WizardStep } from "./Wizard";
import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WizardDemo(_props: any) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("us-east");

  const steps: WizardStep[] = [
    {
      id: "name",
      label: "Name",
      description: "Pick a name for your project.",
      content: (
        <TextField
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ),
      validate: () => name.trim().length > 0 || "Name is required.",
    },
    {
      id: "region",
      label: "Region",
      description: "Where should this run?",
      content: (
        <div className="flex flex-col gap-2 text-sm text-white/80">
          {["us-east", "us-west", "eu-central"].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="region"
                value={r}
                checked={region === r}
                onChange={() => setRegion(r)}
              />
              {r}
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "review",
      label: "Review",
      description: "Confirm and create.",
      content: (
        <div className="text-sm text-white/80 space-y-1">
          <div>
            <span className="text-white/50">Name:</span> {name || "—"}
          </div>
          <div>
            <span className="text-white/50">Region:</span> {region}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-[560px] max-w-full">
      <Wizard
        steps={steps}
        onComplete={() => alert(`Creating ${name} in ${region}`)}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: WizardDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "onComplete", signature: "() => void" }],
  notes:
    "Each step declares a `validate()` that may be async. Try clicking Next on the empty Name step to see the validation message.",
};
