import { useState } from "react";
import {
  ThresholdRuleBuilder,
  emptyCondition,
  emptyGroup,
  type RuleNode,
} from "./ThresholdRuleBuilder";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const metrics = [
  { value: "cpu", label: "CPU", unit: "%" },
  { value: "ram", label: "RAM", unit: "%" },
  { value: "disk", label: "Disk", unit: "%" },
  { value: "net_in", label: "Net in", unit: "MB/s" },
  { value: "net_out", label: "Net out", unit: "MB/s" },
] as const;

const initialRule: RuleNode = {
  ...emptyGroup("and"),
  children: [
    { ...emptyCondition("cpu"), op: ">", value: 80, forSeconds: 60 },
    {
      ...emptyGroup("or"),
      children: [
        { ...emptyCondition("ram"), op: ">", value: 90, forSeconds: 30 },
        { ...emptyCondition("disk"), op: ">", value: 95, forSeconds: 30 },
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ThresholdRuleBuilderDemo(_props: any) {
  const [value, setValue] = useState<RuleNode>(initialRule);
  return (
    <div className="w-[640px] max-w-full">
      <ThresholdRuleBuilder value={value} onChange={setValue} metrics={metrics} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ThresholdRuleBuilderDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "onChange", signature: "(next: RuleNode) => void" }],
  notes:
    "Click the AND/OR badge to flip a group's combinator. Use `+ condition` or `+ group` to grow the tree; the × on the right removes the row.",
};
