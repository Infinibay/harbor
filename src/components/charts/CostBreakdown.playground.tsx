import { CostBreakdown } from "./CostBreakdown";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleItems = [
  { id: "compute", label: "Compute", amount: 1820 },
  { id: "storage", label: "Storage", amount: 640 },
  { id: "egress", label: "Egress", amount: 312 },
  { id: "support", label: "Support", amount: 199 },
  { id: "other", label: "Other", amount: 87 },
];

function CostBreakdownDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 240 }}>
      <CostBreakdown {...props} items={props.items ?? sampleItems} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CostBreakdownDemo as never,
  importPath: "@infinibay/harbor/charts",
  controls: {
    variant: {
      type: "select",
      options: ["donut", "stacked"],
      default: "donut",
    },
    currency: {
      type: "select",
      options: ["USD", "EUR", "GBP", "JPY"],
      default: "USD",
    },
  },
  variants: [
    { label: "Donut (USD)", props: { variant: "donut", currency: "USD" } },
    { label: "Stacked (EUR)", props: { variant: "stacked", currency: "EUR" } },
  ],
};
