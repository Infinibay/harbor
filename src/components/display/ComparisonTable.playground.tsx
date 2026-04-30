import { ComparisonTable } from "./ComparisonTable";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const plans = [
  { id: "free", name: "Free" },
  { id: "team", name: "Team", highlighted: true },
  { id: "ent", name: "Enterprise" },
];

const groups = [
  {
    label: "Core",
    rows: [
      { label: "Projects", values: [3, "Unlimited", "Unlimited"] },
      { label: "Members", values: [1, 10, "Unlimited"] },
      { label: "API access", values: [false, true, true] },
      { label: "SSO", values: [false, false, true], hint: "SAML / OIDC" },
    ],
  },
  {
    label: "Support",
    rows: [
      { label: "Community", values: [true, true, true] },
      { label: "Priority queue", values: [false, true, true] },
      { label: "Dedicated CSM", values: [false, false, true] },
    ],
  },
];

function ComparisonTableDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <ComparisonTable plans={plans} groups={groups} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ComparisonTableDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {},
};
