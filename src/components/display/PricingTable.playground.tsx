import { PricingTable } from "./PricingTable";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const tiers = [
  {
    id: "free",
    name: "Free",
    tagline: "For tinkerers",
    price: 0,
    period: "mo",
    features: [
      { label: "1 project", included: true },
      { label: "Community support", included: true },
      { label: "Custom domains", included: false },
      { label: "SAML SSO", included: false },
    ],
    cta: (
      <button className="w-full px-3 py-2 rounded-md border border-white/10 text-white/80 text-sm hover:bg-white/5">
        Start free
      </button>
    ),
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing teams",
    price: 29,
    period: "mo",
    highlighted: true,
    badge: "Most popular",
    features: [
      { label: "Unlimited projects", included: true },
      { label: "Priority support", included: true, hint: "24h SLA" },
      { label: "Custom domains", included: true },
      { label: "SAML SSO", included: false },
    ],
    cta: (
      <button className="w-full px-3 py-2 rounded-md bg-fuchsia-500 text-white text-sm font-medium hover:bg-fuchsia-400">
        Upgrade
      </button>
    ),
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For larger orgs",
    price: "Custom",
    features: [
      { label: "Unlimited everything", included: true },
      { label: "Dedicated support", included: true },
      { label: "Custom domains", included: true },
      { label: "SAML SSO", included: true },
    ],
    cta: (
      <button className="w-full px-3 py-2 rounded-md border border-white/10 text-white/80 text-sm hover:bg-white/5">
        Contact sales
      </button>
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PricingTableDemo(props: any) {
  return <PricingTable {...props} tiers={tiers} />;
}

export const playground: PlaygroundManifest = {
  component: PricingTableDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  notes: "Tiers are hard-coded in the demo; pass your own via the `tiers` prop.",
};
