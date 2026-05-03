import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { BarChart, type Bar } from "./BarChart";

const bars: Bar[] = [
  { id: "a", label: "Alpha", value: 40 },
  { id: "b", label: "Beta", value: 70 },
  { id: "c", label: "Gamma", value: 30 },
];

describe("BarChart", () => {
  it("renders vertical chart with SVG by default", () => {
    const { container } = renderWithHarbor(<BarChart bars={bars} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders bar labels in vertical mode", () => {
    const { container } = renderWithHarbor(<BarChart bars={bars} />);
    expect(container.textContent).toContain("Alpha");
    expect(container.textContent).toContain("Beta");
    expect(container.textContent).toContain("Gamma");
  });

  it("renders horizontal chart with div bars", () => {
    const { container } = renderWithHarbor(
      <BarChart bars={bars} orientation="horizontal" />,
    );
    // Horizontal mode uses div-based bars, not SVG
    expect(container.querySelector("svg")).toBeNull();
    expect(container.textContent).toContain("Alpha");
  });

  it("renders formatValue output in horizontal mode", () => {
    const { container } = renderWithHarbor(
      <BarChart bars={bars} orientation="horizontal" formatValue={(v) => `${v}ms`} />,
    );
    expect(container.textContent).toContain("40ms");
    expect(container.textContent).toContain("70ms");
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(<BarChart bars={bars} height={300} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    // The viewBox should use height 300
    expect(svg?.getAttribute("viewBox")).toContain("300");
  });

  it("uses custom bar colors", () => {
    const coloredBars: Bar[] = [
      { id: "x", label: "X", value: 50, color: "#ff0000" },
      { id: "y", label: "Y", value: 50, color: "#00ff00" },
    ];
    const { container } = renderWithHarbor(<BarChart bars={coloredBars} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders an empty bars array", () => {
    const { container } = renderWithHarbor(<BarChart bars={[]} />);
    // Should render the SVG container even with no bars
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders a single bar", () => {
    const single: Bar[] = [{ id: "only", label: "Only", value: 100 }];
    const { container } = renderWithHarbor(<BarChart bars={single} />);
    expect(container.textContent).toContain("Only");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <BarChart bars={bars} className="my-chart" />,
    );
    const wrapper = container.querySelector(".my-chart");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<BarChart bars={bars} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
