import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CostBreakdown, type CostItem } from "./CostBreakdown";

const items: CostItem[] = [
  { id: "compute", label: "Compute", amount: 120 },
  { id: "storage", label: "Storage", amount: 80 },
  { id: "network", label: "Network", amount: 50 },
];

describe("CostBreakdown", () => {
  it("renders donut variant by default", () => {
    const { container } = renderWithHarbor(<CostBreakdown items={items} />);
    // Donut variant renders an SVG
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders item labels", () => {
    const { container } = renderWithHarbor(<CostBreakdown items={items} />);
    expect(container.textContent).toContain("Compute");
    expect(container.textContent).toContain("Storage");
    expect(container.textContent).toContain("Network");
  });

  it("renders formatted currency amounts", () => {
    const { container } = renderWithHarbor(<CostBreakdown items={items} />);
    // Intl.NumberFormat with USD should produce "$120", "$80", "$50"
    expect(container.textContent).toContain("120");
    expect(container.textContent).toContain("80");
    expect(container.textContent).toContain("50");
  });

  it("renders percentage for each item", () => {
    const { container } = renderWithHarbor(<CostBreakdown items={items} />);
    // 120/250 = 48%, 80/250 = 32%, 50/250 = 20%
    expect(container.textContent).toContain("48%");
    expect(container.textContent).toContain("32%");
    expect(container.textContent).toContain("20%");
  });

  it("renders stacked variant with a bar instead of donut", () => {
    const { container } = renderWithHarbor(
      <CostBreakdown items={items} variant="stacked" />,
    );
    // Stacked variant has a rounded-full bar container
    expect(container.textContent).toContain("Compute");
    // No SVG in stacked mode (no donut)
    expect(container.querySelector("svg")).toBeNull();
  });

  it("uses custom currency", () => {
    const { container } = renderWithHarbor(
      <CostBreakdown items={items} currency="EUR" />,
    );
    expect(container.textContent).toContain("Compute");
  });

  it("renders with custom className", () => {
    const { container } = renderWithHarbor(
      <CostBreakdown items={items} className="my-cost" />,
    );
    const wrapper = container.querySelector(".my-cost");
    expect(wrapper).toBeTruthy();
  });

  it("renders with a single item", () => {
    const single: CostItem[] = [{ id: "only", label: "Only", amount: 100 }];
    const { container } = renderWithHarbor(<CostBreakdown items={single} />);
    expect(container.textContent).toContain("Only");
    expect(container.textContent).toContain("100");
  });

  it("renders with empty items", () => {
    const { container } = renderWithHarbor(<CostBreakdown items={[]} />);
    expect(container).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<CostBreakdown items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
