import { BillingCard } from "./BillingCard";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const usage = {
  label: "API calls",
  total: 1_000_000,
  segments: [
    { value: 620_000, label: "Used", color: "rgb(168 85 247)" },
    { value: 80_000, label: "Reserved", color: "rgba(255,255,255,0.25)" },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BillingCardDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 540 }}>
      <BillingCard
        {...props}
        period={{ start: "2026-04-01", end: "2026-04-30" }}
        usage={usage}
        cta={
          <Button variant="primary" size="sm" onClick={() => props.onUpgrade?.()}>
            Upgrade
          </Button>
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BillingCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    plan: { type: "text", default: "Team" },
    price: { type: "text", default: "$49 / mo" },
    nextInvoice: { type: "text", default: "$64.12" },
  },
  events: [
    { name: "onUpgrade", signature: "() => void", description: "Wired to the demo's CTA button." },
  ],
};
