import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { PricingTable } from "./PricingTable";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "mo",
    features: [
      { label: "5 users", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "mo",
    highlighted: true,
    badge: "Popular",
    features: [
      { label: "Unlimited users", included: true },
      { label: "API access", included: true, hint: "Rate limit: 10k/min" },
    ],
    cta: <button>Upgrade</button>,
  },
];

describe("PricingTable", () => {
  it("renders tier names", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("Free");
    expect(container.textContent).toContain("Pro");
  });

  it("renders prices", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("$0");
    expect(container.textContent).toContain("$49");
  });

  it("renders period", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("/mo");
  });

  it("renders feature labels", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("5 users");
    expect(container.textContent).toContain("API access");
    expect(container.textContent).toContain("Unlimited users");
  });

  it("renders ✓ for included features", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("✓");
  });

  it("renders × for excluded features", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("×");
  });

  it("renders badge", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("Popular");
  });

  it("renders CTA slot", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("Upgrade");
  });

  it("renders feature hints", () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(container.textContent).toContain("Rate limit: 10k/min");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <PricingTable tiers={tiers} className="my-pricing" />,
    );
    expect(container.querySelector(".my-pricing")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<PricingTable tiers={tiers} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
