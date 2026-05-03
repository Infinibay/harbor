import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { LineChart, type LineSeries } from "./LineChart";

const series: LineSeries[] = [
  { id: "s1", label: "Series 1", data: [10, 20, 15, 30, 25] },
];
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

describe("LineChart", () => {
  it("renders an SVG chart", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} labels={labels} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders the series label in legend for multi-series", () => {
    const multi: LineSeries[] = [
      { id: "a", label: "Alpha", data: [1, 2, 3] },
      { id: "b", label: "Beta", data: [3, 2, 1] },
    ];
    const { container } = renderWithHarbor(<LineChart series={multi} />);
    expect(container.textContent).toContain("Alpha");
    expect(container.textContent).toContain("Beta");
  });

  it("renders x-axis labels", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} labels={labels} />,
    );
    expect(container.textContent).toContain("Mon");
    // Not all labels may show (sparse labeling), but at least the first should
  });

  it("renders area fill when area=true (default)", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} area={true} />,
    );
    // Area fill uses linearGradient
    const gradient = container.querySelector("svg linearGradient");
    expect(gradient).toBeTruthy();
  });

  it("omits area fill when area=false", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} area={false} />,
    );
    const gradient = container.querySelector("svg linearGradient");
    expect(gradient).toBeNull();
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} height={300} />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toContain("300");
  });

  it("uses custom yTicks", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} yTicks={6} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    // yTicks + 1 = 7 Y-axis ticks
    const yTexts = container.querySelectorAll('svg text[text-anchor="end"]');
    expect(yTexts.length).toBe(7);
  });

  it("uses formatY to format axis values", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} formatY={(v) => `${v}ms`} />,
    );
    expect(container.textContent).toContain("ms");
  });

  it("renders with empty series array", () => {
    const { container } = renderWithHarbor(<LineChart series={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} className="my-line" />,
    );
    const wrapper = container.querySelector(".my-line");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <LineChart series={series} labels={labels} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
