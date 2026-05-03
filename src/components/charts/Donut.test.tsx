import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Donut, type DonutSlice } from "./Donut";

const slices: DonutSlice[] = [
  { id: "a", label: "Alpha", value: 40 },
  { id: "b", label: "Beta", value: 30 },
  { id: "c", label: "Gamma", value: 30 },
];

describe("Donut", () => {
  it("renders the SVG chart", () => {
    const { container } = renderWithHarbor(<Donut slices={slices} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders slice labels in legend", () => {
    const { container } = renderWithHarbor(<Donut slices={slices} />);
    expect(container.textContent).toContain("Alpha");
    expect(container.textContent).toContain("Beta");
    expect(container.textContent).toContain("Gamma");
  });

  it("renders percentage values in legend", () => {
    const { container } = renderWithHarbor(<Donut slices={slices} />);
    // 40/100 = 40%, 30/100 = 30%
    expect(container.textContent).toContain("40%");
    expect(container.textContent).toContain("30%");
  });

  it("renders centerValue when provided", () => {
    const { container } = renderWithHarbor(
      <Donut slices={slices} centerValue="100" />,
    );
    expect(container.textContent).toContain("100");
  });

  it("renders centerLabel when provided", () => {
    const { container } = renderWithHarbor(
      <Donut slices={slices} centerLabel="Total" />,
    );
    expect(container.textContent).toContain("Total");
  });

  it("renders with custom size", () => {
    const { container } = renderWithHarbor(<Donut slices={slices} size={240} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("240");
    expect(svg?.getAttribute("height")).toBe("240");
  });

  it("renders with custom thickness", () => {
    const { container } = renderWithHarbor(
      <Donut slices={slices} thickness={24} />,
    );
    const paths = container.querySelectorAll("svg path");
    // Each slice has a path
    expect(paths.length).toBeGreaterThanOrEqual(slices.length);
  });

  it("uses custom slice colors", () => {
    const colored: DonutSlice[] = [
      { id: "x", label: "X", value: 50, color: "#ff0000" },
      { id: "y", label: "Y", value: 50, color: "#00ff00" },
    ];
    const { container } = renderWithHarbor(<Donut slices={colored} />);
    const redPath = container.querySelector('svg path[stroke="#ff0000"]');
    expect(redPath).toBeTruthy();
  });

  it("renders with a single slice", () => {
    const single: DonutSlice[] = [{ id: "only", label: "Only", value: 100 }];
    const { container } = renderWithHarbor(<Donut slices={single} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Donut slices={slices} className="my-donut" />,
    );
    // Outermost div from the component
    const wrapper = container.querySelector("div.inline-flex");
    expect(wrapper?.className).toContain("my-donut");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Donut slices={slices} centerLabel="Total" centerValue="100" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
